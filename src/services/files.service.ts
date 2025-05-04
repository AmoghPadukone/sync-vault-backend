import fs from 'fs/promises';
import { UploadFileDto } from 'src/types/dto/files.dto';
import prisma from '../db/client';
import NubiloManager from './nubiloManager';

type DeleteFileOptions = {
  userId: string;
  fileId: string;
  multiple?: boolean;
  paths?: string[];
  softDelete?: boolean;
  backupPrefix?: string;
};

type GetFileMetadataOptions = {
  userId: string;
  cloudPath: string;
  includeCloud: boolean;
};

export const fileService = {
  // Add service methods here
  async uploadFile(
    {
      userId,
      files,
      body,
    }: {
      userId: string;
      files: Express.Multer.File[] | undefined;
      body: UploadFileDto;
    }
  ) {
    const {
      destination,
      usePresignedUrl,
      expiration,
      resumable,
      chunkSize,
      tempResumableConfigPath,
      uploadIntent,
      tags,
    } = body;

    const nubilo = await NubiloManager.getInstanceForUser(userId);
    const provider = await NubiloManager.getProviderType(userId);
    const results: any[] = [];

    // Presigned URL Mode
    if (usePresignedUrl) {
      for (const file of files ?? []) {
        const remotePath = `${destination}${file.originalname}`;
        const presignedUrl = await nubilo.upload(remotePath, remotePath, {
          usePresignedUrl: true,
          expiration,
          resumable,
          chunkSize,
          tempResumableConfigPath,
        });

        if (uploadIntent === 'mydrive') {
          await prisma.file.upsert({
            where: {
              userId_provider_cloudPath: {
                userId,
                provider,
                cloudPath: remotePath,
              },
            },
            update: {},
            create: {
              userId,
              provider,
              cloudPath: remotePath,
              fileName: file.originalname,
              folderPath: destination,
              mimeType: file.mimetype,
              size: BigInt(file.size),
              tags,
            },
          });
        }

        results.push({
          file: remotePath,
          uploadUrl: presignedUrl,
          method: 'PUT',
        });
      }
      return results;
    }

    // Server Upload Mode
    if (!files || files.length === 0) {
      throw new Error('No files provided for direct upload');
    }

    for (const file of files) {
      const remotePath = `${destination}${file.originalname}`;

      await nubilo.upload(file.path, remotePath, {
        resumable,
        chunkSize,
        tempResumableConfigPath,
        usePresignedUrl: false,
      });

      await fs.unlink(file.path); // delete temp file

      if (uploadIntent === 'mydrive') {
        await prisma.file.upsert({
          where: {
            userId_provider_cloudPath: {
              userId,
              provider,
              cloudPath: remotePath,
            },
          },
          update: {},
          create: {
            userId,
            provider,
            cloudPath: remotePath,
            fileName: file.originalname,
            folderPath: destination,
            mimeType: file.mimetype,
            size: BigInt(file.size),
            tags,
          },
        });
      }

      results.push({ file: remotePath, status: 'uploaded' });
    }

    return results;
  },

  async deleteFile({
    userId,
    fileId,
    multiple,
    paths,
    softDelete = false,
    backupPrefix,
  }: DeleteFileOptions) {
    const nubilo = await NubiloManager.getInstanceForUser(userId);
    const provider = await NubiloManager.getProviderType(userId);

    if (multiple) {
      if (!paths || paths.length === 0) {
        throw new Error('Multiple deletion requested but no paths provided');
      }

      await nubilo.delete(paths, {
        multiple: true,
        softDelete,
        backupPrefix,
      });

      // Only delete enriched files from DB
      const enrichedPaths = await prisma.file.findMany({
        where: {
          userId,
          provider,
          cloudPath: { in: paths },
        },
        select: { cloudPath: true },
      });

      const enrichedCloudPaths = enrichedPaths.map((f) => f.cloudPath);

      if (enrichedCloudPaths.length > 0) {
        await prisma.file.deleteMany({
          where: {
            userId,
            provider,
            cloudPath: { in: enrichedCloudPaths },
          },
        });
      }

      return { message: `${paths.length} files deleted from cloud. ${enrichedCloudPaths.length} DB entries removed.` };
    }

    // Single delete
    await nubilo.delete(fileId, {
      softDelete,
      backupPrefix,
    });

    const enriched = await prisma.file.findUnique({
      where: {
        userId_provider_cloudPath: {
          userId,
          provider,
          cloudPath: fileId,
        },
      },
      select: { id: true },
    });

    if (enriched) {
      await prisma.file.delete({
        where: { id: enriched.id },
      });
    }

    return {
      message: `File ${fileId} deleted from cloud.${enriched ? ' DB entry also removed.' : ''}`,
    };
  },
  async getFileMetadata({
    userId,
    cloudPath,
    includeCloud,
  }: GetFileMetadataOptions) {
    const provider = await NubiloManager.getProviderType(userId);
    const nubilo = await NubiloManager.getInstanceForUser(userId);

    const enriched = await prisma.file.findUnique({
      where: {
        userId_provider_cloudPath: {
          userId,
          provider,
          cloudPath,
        },
      },
    });

    // 1. Enriched path found in DB
    if (enriched) {
      const response: any = {
        source: 'db',
        cloudPath,
        fileName: enriched.fileName,
        size: Number(enriched.size),
        mimeType: enriched.mimeType,
        lastModified: enriched.lastCloudModified,
        tags: enriched.tags,
        classification: enriched.classification,
      };

      if (includeCloud) {
        try {
          const cloudRes = await nubilo.fileOps(cloudPath, { getMetadata: true });
          response.rawMetadata = cloudRes;
        } catch (err) {
          response.rawMetadata = { error: 'Could not fetch cloud metadata' };
        }
      }

      return response;
    }

    // 2. Not in DB, fallback to cloud
    try {
      const cloudRes = await nubilo.fileOps(cloudPath, { getMetadata: true });

      if (typeof cloudRes === 'object' && cloudRes !== null) {
        return {
          source: 'cloud',
          cloudPath,
          fileName: cloudPath.split('/').pop(),
          size: cloudRes.size,
          mimeType: cloudRes.mimeType,
          lastModified: cloudRes.lastModified,
          tags: [],
          classification: {},
          rawMetadata: cloudRes,
        };
      } else {
        return {
          source: 'cloud',
          cloudPath,
          fileName: cloudPath.split('/').pop(),
          size: null,
          mimeType: null,
          lastModified: null,
          tags: [],
          classification: {},
          rawMetadata: cloudRes,
        };
      }
    } catch (err: any) {
      throw new Error(`File not found in DB or Cloud: ${err.message}`);
    }
  }
};

