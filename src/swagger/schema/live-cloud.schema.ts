export const liveCloudSchemas = {
  BrowseCloudDto: {
    type: 'object',
    properties: {
      prefix: { type: 'string', example: 'folder1/' },
    },
  },
  MetadataDto: {
    type: 'object',
    required: ['path'],
    properties: {
      path: { type: 'string', example: 'folder1/file.txt' },
    },
  },
};

