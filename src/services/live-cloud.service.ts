import prisma from '../db/client';
import NubiloManager from './nubiloManager';

export const LiveCloudService = {
  async browse(userId: string, prefix?: string) {
    const nubilo = await NubiloManager.getInstanceForUser(userId);
    const result = await nubilo.directoryOps(prefix || '', {
      recursiveListContents: false,
    });

    const folders: any[] = [];
    const files: any[] = [];

    for (const item of Array.isArray(result) ? result : []) {
      if (item.type === 'folder') folders.push(item);
      else files.push(item);
    }

    return { folders, files };
  },

  async metadata(userId: string, path: string) {
    const nubilo = await NubiloManager.getInstanceForUser(userId);
    const result = await nubilo.fileOps(path, { getMetadata: true });
    return result;
  },
};

