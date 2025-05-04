import prisma from '../db/client';
import NubiloManager from './nubiloManager';


interface CreateFolderOptions {
  userId: string;
  path: string;
  name: string;
  tags?: string[];
  intent: 'mydrive' | 'archive';
}

interface GetFolderOptions {
  userId: string;
  path: string;
}

interface DeleteFolderOptions {
  userId: string;
  path: string;
  recursive?: boolean;
}

export const foldersService = {
  async createFolder({ userId, path, name, tags, intent }: CreateFolderOptions) {
    const nubilo = await NubiloManager.getInstanceForUser(userId);

    // Always create folder in cloud using directoryOps
    await nubilo.directoryOps(path, { create: true });

    if (intent === 'archive') {
      return { message: 'Folder created in cloud only' };
    }

    const provider = await NubiloManager.getProviderType(userId);
    const folder = await prisma.folder.create({
      data: {
        userId,
        provider,
        path,
        name,
        tags: tags || [],
      },
    });

    return { message: 'Folder created in My Drive + Cloud', folder };
  },

  async getFolder({ userId, path }: GetFolderOptions) {
    const provider = await NubiloManager.getProviderType(userId);

    const folder = await prisma.folder.findUnique({
      where: {
        userId_provider_path: {
          userId,
          provider,
          path,
        },
      },
    });

    if (!folder) throw new Error('Folder not found in DB');

    const enrichedFiles = await prisma.file.findMany({
      where: {
        userId,
        provider,
        folderPath: path,
      },
    });

    return { folder, enrichedFiles };
  },

  async deleteFolder({ userId, path, recursive = false }: DeleteFolderOptions) {
    const provider = await NubiloManager.getProviderType(userId);
    const nubilo = await NubiloManager.getInstanceForUser(userId);

    // Delete from DB if exists
    await prisma.folder.deleteMany({
      where: {
        userId,
        provider,
        path,
      },
    });

    // Delete enriched files under this folder
    await prisma.file.deleteMany({
      where: {
        userId,
        provider,
        folderPath: path,
      },
    });

    // Delete cloud contents if recursive
    if (recursive) {
      await nubilo.directoryOps(path, { delete: true });
    }

    return { message: 'Folder deleted from DB' + (recursive ? ' and cloud' : '') };
  },

  async listEnrichedFolderContents(userId: string, path: string) {
    const provider = await NubiloManager.getProviderType(userId);

    const folders = await prisma.folder.findMany({
      where: {
        userId,
        provider,
        path: {
          startsWith: path,
        },
      },
    });

    const files = await prisma.file.findMany({
      where: {
        userId,
        provider,
        folderPath: path,
      },
    });

    return { path, folders, files };
  },
};
