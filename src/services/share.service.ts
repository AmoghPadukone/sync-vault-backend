import dayjs from 'dayjs';
import prisma from 'src/db/client';
import { v4 as uuidv4 } from 'uuid';
import NubiloManager from './nubiloManager';

export const ShareService = {
  async generateShare(userId: string, path: string, expiresIn: number) {
    const nubilo = await NubiloManager.getInstanceForUser(userId);
    const nubiloProvider = await NubiloManager.getProviderType(userId);
    const expirySeconds = expiresIn * 60;

    const result = await nubilo.fileOps(path, {
      generatePublicUrl: true,
      expiry: expirySeconds,
    });

    if (!result || typeof result !== 'string') {
      throw new Error('Expected a string presigned URL but got an invalid response from Nubilo.');
    }
    if (!expiresIn || typeof expiresIn !== 'number') {
      throw new Error('Expected a string presigned URL but got an invalid response from Nubilo.');
    }
    const presignedUrl: string = result;

    // Ensure file exists in DB
    const existingFile = await prisma.file.findFirst({
      where: { userId, cloudPath: path },
    });

    const file = existingFile ?? (await prisma.file.create({
      data: {
        userId,
        provider: nubiloProvider,
        cloudPath: path,
        fileName: path.split('/').pop() ?? 'unknown',
        folderPath: path.includes('/') ? path.split('/').slice(0, -1).join('/') + '/' : '',
        size: BigInt(0),
      },
    }));

    const uuid = uuidv4();
    const expiresOn = dayjs().add(expiresIn, 'minute').toDate();

    const sharedEntry = await prisma.sharedFile.create({
      data: {
        id: uuid,
        fileId: file.id,
        ownerId: userId,
        sharedUrl: presignedUrl,
        expiresOn,
        sharedOn: new Date(),
        isActive: true,
      },
    });

    return sharedEntry;
  },

  async revokeShare(userId: string, fileId: string) {
    return await prisma.sharedFile.deleteMany({
      where: { ownerId: userId, fileId },
    });
  },

  async listShares(userId: string) {
    return await prisma.sharedFile.findMany({
      where: { ownerId: userId },
      include: { file: true },
    });
  },
};
