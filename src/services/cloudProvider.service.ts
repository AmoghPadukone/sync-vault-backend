import prisma from '../db/client';
import { ConnectProviderDto, UpdateProviderDto } from '../types/dto/cloudProvider.dto';
import { decrypt, encrypt } from '../utils/crypto.utils';

export const CloudProviderService = {
    async connect(userId: string, dto: ConnectProviderDto): Promise<void> {
        const { provider } = dto;

        if (provider === 'aws') {
            await prisma.providerConfig.upsert({
                where: {
                    userId_providerName: { userId, providerName: 'aws' },
                },
                update: {
                    region: dto.region,
                    bucketName: dto.bucketName,
                    accessKey: encrypt(dto.credentials.accessKeyId),
                    secretKey: encrypt(dto.credentials.secretAccessKey),
                },
                create: {
                    userId,
                    providerName: 'aws',
                    region: dto.region,
                    bucketName: dto.bucketName,
                    accessKey: encrypt(dto.credentials.accessKeyId),
                    secretKey: encrypt(dto.credentials.secretAccessKey),
                },
            });
        }

        if (provider === 'azure') {
            await prisma.providerConfig.upsert({
                where: {
                    userId_providerName: { userId, providerName: 'azure' },
                },
                update: {
                    accountName: dto.accountName,
                    accountKey: encrypt(dto.accountKey),
                    containerName: dto.containerName,
                },
                create: {
                    userId,
                    providerName: 'azure',
                    accountName: dto.accountName,
                    accountKey: encrypt(dto.accountKey),
                    containerName: dto.containerName,
                },
            });
        }

        if (provider === 'gcp') {
            await prisma.providerConfig.upsert({
                where: {
                    userId_providerName: { userId, providerName: 'gcp' },
                },
                update: {
                    projectId: dto.projectId,
                    keyFilename: encrypt(dto.keyFilename),
                    bucketName: dto.bucketName,
                },
                create: {
                    userId,
                    providerName: 'gcp',
                    projectId: dto.projectId,
                    keyFilename: encrypt(dto.keyFilename),
                    bucketName: dto.bucketName,
                },
            });
        }
    },
    async disconnect(userId: string, providerName: 'aws' | 'azure' | 'gcp') {
        await prisma.providerConfig.deleteMany({
            where: {
                userId,
                providerName,
            },
        });
    },
    async getFullProviderConfigs(userId: string) {
        const configs = await prisma.providerConfig.findMany({
            where: { userId },
        });

        return configs.map((config) => {
            return {
                provider: config.providerName,
                bucketName: config.bucketName,
                region: config.region,
                accessKey: config.accessKey ? decrypt(config.accessKey) : null,
                secretKey: config.secretKey ? decrypt(config.secretKey) : null,
                accountName: config.accountName,
                accountKey: config.accountKey ? decrypt(config.accountKey) : null,
                containerName: config.containerName,
                projectId: config.projectId,
                keyFilename: config.keyFilename ? decrypt(config.keyFilename) : null,
                createdAt: config.createdAt,
            };
        });
    }
    ,
    async updateProviderConfig(userId: string, providerName: 'aws' | 'gcp' | 'azure', dto: UpdateProviderDto) {
        const dataToUpdate: any = { ...dto };

        // selectively encrypt sensitive fields
        if (dto.accessKey) dataToUpdate.accessKey = encrypt(dto.accessKey);
        if (dto.secretKey) dataToUpdate.secretKey = encrypt(dto.secretKey);
        if (dto.accountKey) dataToUpdate.accountKey = encrypt(dto.accountKey);
        if (dto.keyFilename) dataToUpdate.keyFilename = encrypt(dto.keyFilename);

        const updated = await prisma.providerConfig.updateMany({
            where: {
                userId,
                providerName,
            },
            data: dataToUpdate,
        });

        if (updated.count === 0) throw new Error('No matching provider found');
    }


};




