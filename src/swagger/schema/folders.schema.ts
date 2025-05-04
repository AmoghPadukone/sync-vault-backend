export const foldersSchemas = {
  CreateFoldersDto: {
    type: 'object',
    properties: {
      path: { type: 'string', example: 'project-x/' },
      name: { type: 'string', example: 'Project X' },
      tags: {
        type: 'array',
        items: { type: 'string' },
        example: ['urgent', 'client-a'],
      },
      intent: {
        type: 'string',
        enum: ['mydrive', 'archive'],
        example: 'mydrive',
      },
    },
    required: ['path', 'name', 'intent'],
  },

  Folder: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'fldr_123' },
      userId: { type: 'string' },
      provider: { type: 'string', enum: ['aws', 'azure', 'gcp'] },
      path: { type: 'string', example: 'project-x/' },
      name: { type: 'string', example: 'Project X' },
      tags: {
        type: 'array',
        items: { type: 'string' },
        example: ['urgent', 'client-a'],
      },
      isFavorite: { type: 'boolean', example: false },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  File: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'file_abc123' },
      userId: { type: 'string' },
      provider: { type: 'string', enum: ['aws', 'azure', 'gcp'] },
      cloudPath: { type: 'string', example: 'project-x/report.pdf' },
      fileName: { type: 'string', example: 'report.pdf' },
      folderPath: { type: 'string', example: 'project-x/' },
      size: { type: 'integer', example: 204800 },
      mimeType: { type: 'string', example: 'application/pdf' },
      isFavorite: { type: 'boolean', example: false },
      isEnriched: { type: 'boolean', example: true },
      tags: {
        type: 'array',
        items: { type: 'string' },
        example: ['finance'],
      },
      classification: {
        type: 'object',
        additionalProperties: true,
        example: { label: 'document' },
      },
      lastCloudModified: { type: 'string', format: 'date-time' },
      lastSyncedAt: { type: 'string', format: 'date-time' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  FolderContentsResponse: {
    type: 'object',
    properties: {
      path: { type: 'string', example: 'project-x/' },
      folders: {
        type: 'array',
        items: { $ref: '#/components/schemas/Folder' },
      },
      files: {
        type: 'array',
        items: { $ref: '#/components/schemas/File' },
      },
    },
  },

  GetFolderResponse: {
    type: 'object',
    properties: {
      folder: { $ref: '#/components/schemas/Folder' },
      enrichedFiles: {
        type: 'array',
        items: { $ref: '#/components/schemas/File' },
      },
    },
  },

  CreateFolderResponse: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Folder created in My Drive + Cloud' },
      folder: { $ref: '#/components/schemas/Folder' },
    },
  },

  DeleteFolderResponse: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Folder deleted from DB and cloud' },
    },
  },
  ListFolderContentsResponse: {
    type: 'object',
    properties: {
      path: { type: 'string', example: 'mydrive/' },
      folders: {
        type: 'array',
        items: { $ref: '#/components/schemas/Folder' },
      },
      files: {
        type: 'array',
        items: { $ref: '#/components/schemas/File' },
      },
    },
  },
};