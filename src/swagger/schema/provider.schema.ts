export const providerSchemas = {
    AwsProviderDto: {
        type: 'object',
        required: ['provider', 'region', 'bucketName', 'credentials'],
        properties: {
            provider: {
                type: 'string',
                enum: ['aws'],
                example: 'aws',
            },
            region: {
                type: 'string',
                example: 'ap-south-1',
            },
            bucketName: {
                type: 'string',
                example: 'my-s3-bucket',
            },
            credentials: {
                type: 'object',
                required: ['accessKeyId', 'secretAccessKey'],
                properties: {
                    accessKeyId: {
                        type: 'string',
                        example: 'AKIA...XYZ',
                    },
                    secretAccessKey: {
                        type: 'string',
                        example: 'abc123secret',
                    },
                },
            },
        },
    },

    AzureProviderDto: {
        type: 'object',
        required: ['provider', 'accountName', 'accountKey', 'containerName'],
        properties: {
            provider: {
                type: 'string',
                enum: ['azure'],
                example: 'azure',
            },
            accountName: {
                type: 'string',
                example: 'myazurestorage',
            },
            accountKey: {
                type: 'string',
                example: 'yourAccountKeyHere',
            },
            containerName: {
                type: 'string',
                example: 'my-container',
            },
        },
    },

    GcpProviderDto: {
        type: 'object',
        required: ['provider', 'projectId', 'bucketName', 'keyFilename'],
        properties: {
            provider: {
                type: 'string',
                enum: ['gcp'],
                example: 'gcp',
            },
            projectId: {
                type: 'string',
                example: 'gcp-project-id',
            },
            bucketName: {
                type: 'string',
                example: 'gcp-bucket-name',
            },
            keyFilename: {
                type: 'string',
                example: './path/to/keyfile.json',
            },
        },
    },

    UpdateProviderDto: {
        type: 'object',
        properties: {
            region: { type: 'string', example: 'us-east-1' },
            bucketName: { type: 'string', example: 'updated-bucket' },
            accessKey: { type: 'string', example: 'new-access-key' },
            secretKey: { type: 'string', example: 'new-secret-key' },
            accountName: { type: 'string', example: 'updated-account' },
            accountKey: { type: 'string', example: 'updated-account-key' },
            containerName: { type: 'string', example: 'new-container' },
            projectId: { type: 'string', example: 'updated-project-id' },
            keyFilename: { type: 'string', example: './new-keyfile.json' },
        },
    },

    ProviderConfigFull: {
        type: 'object',
        properties: {
            provider: { type: 'string', example: 'aws' },
            bucketName: { type: 'string', example: 'amogh-bucket' },
            region: { type: 'string', example: 'us-west-1' },
            accessKey: { type: 'string', example: 'AKIAXXX' },
            secretKey: { type: 'string', example: '*****' },
            accountName: { type: 'string', example: 'azure-storage' },
            accountKey: { type: 'string', example: '*****' },
            containerName: { type: 'string', example: 'container1' },
            projectId: { type: 'string', example: 'gcp-project' },
            keyFilename: { type: 'string', example: './keyfile.json' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T12:00:00Z' },
        },
    },
};
