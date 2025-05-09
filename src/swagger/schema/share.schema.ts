export const shareSchemas = {
  ShareFileDto: {
    type: 'object',
    required: ['path'],
    properties: {
      path: { type: 'string', example: 'folder/file.pdf' },
      expiresIn: { type: 'number', example: 60 },
    },
  },

};

