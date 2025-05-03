import { PrismaClient } from '@prisma/client';
import { LRUCache } from 'lru-cache';
import { Nubilo } from '../../libs/nubilo/src/core/nubilo'; // adjust if using npm or alias
import { CloudConfig } from '../../libs/nubilo/src/interfaces/storage-providers';

const prisma = new PrismaClient();

type ProviderConfigMap = {
  aws?: {
    region: string;
    credentials: { accessKeyId: string; secretAccessKey: string };
    bucketName: string;
  };
  azure?: {
    accountName: string;
    credential: { accountKey?: string; sasToken?: string };
    containerName: string;
  };
  gcp?: {
    projectId: string;
    keyFilename: string;
    bucketName: string;
  };
};

type NubiloCacheEntry = {
  instance: Nubilo;
  provider: 'aws' | 'azure' | 'gcp';
  config: ProviderConfigMap;
};

class NubiloManager {
  private static cache = new LRUCache<string, NubiloCacheEntry>({
    max: 1000,
    ttl: 1000 * 60 * 10, // 10 minutes
  });

  public static async getInstanceForUser(userId: string): Promise<Nubilo> {
    const cached = this.cache.get(userId);
    if (cached) return cached.instance;

    const config = await prisma.providerConfig.findFirst({
      where: { userId },
    });

    if (!config) throw new Error(`No cloud config found for user: ${userId}`);

    const cloudProvider = config.providerName;

    let providerConfigs: ProviderConfigMap = {};

    switch (cloudProvider) {
      case 'aws':
        if (!config.accessKey || !config.secretKey || !config.bucketName || !config.region) {
          throw new Error('Incomplete AWS config');
        }
        providerConfigs = {
          aws: {
            region: config.region,
            credentials: {
              accessKeyId: config.accessKey,
              secretAccessKey: config.secretKey,
            },
            bucketName: config.bucketName,
          },
        };
        break;

      case 'azure':
        if (!config.accountName || !config.accountKey || !config.containerName) {
          throw new Error('Incomplete Azure config');
        }
        providerConfigs = {
          azure: {
            accountName: config.accountName,
            credential: { accountKey: config.accountKey },
            containerName: config.containerName,
          },
        };
        break;

      case 'gcp':
        if (!config.projectId || !config.keyFilename || !config.bucketName) {
          throw new Error('Incomplete GCP config');
        }
        providerConfigs = {
          gcp: {
            projectId: config.projectId,
            keyFilename: config.keyFilename,
            bucketName: config.bucketName,
          },
        };
        break;

      default:
        throw new Error(`Unsupported provider: ${cloudProvider}`);
    }

    const nubiloInstance = new Nubilo({
      cloudProvider,
      providerConfigs,
    });

    this.cache.set(userId, {
      instance: nubiloInstance,
      provider: cloudProvider,
      config: providerConfigs,
    });

    return nubiloInstance;
  }

  public static invalidateUser(userId: string) {
    this.cache.delete(userId);
  }

  public static clearAll() {
    this.cache.clear();
  }
}

export default NubiloManager;
