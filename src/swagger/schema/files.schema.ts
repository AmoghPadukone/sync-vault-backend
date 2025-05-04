export const filesSchemas = {
  CreateFilesDto: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', example: 'Sample Files' },
      isActive: { type: 'boolean', example: true },
    },
  },
  UploadFileDto: {
    type: 'object',
    properties: {
      destination: { type: 'string' },
      usePresignedUrl: { type: 'boolean', default: false },
      expiration: { type: 'number', example: 3600 },
      resumable: { type: 'boolean', default: false },
      chunkSize: { type: 'number' },
      tempResumableConfigPath: { type: 'string' },
      uploadIntent: { type: 'string', enum: ['mydrive', 'archive'], default: 'archive' },
      tags: {
        type: 'array',
        items: { type: 'string' },
        example: ['finance', 'urgent'],
      },
    },
  },


  DeleteFileDto: {
    type: 'object',
    properties: {
      softDelete: { type: 'boolean', example: true },
      backupPrefix: { type: 'string', example: 'deleted-files/' },
      multiple: { type: 'boolean', example: true },
      paths: {
        type: 'array',
        items: { type: 'string' },
        example: ['folder/a.jpg', 'folder/b.jpg'],
      },
    },
  },

};

