export const filesSchemas = {
  CreateFilesDto: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', example: 'Sample Files' },
      isActive: { type: 'boolean', example: true },
    },
  },
};

