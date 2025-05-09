export const searchSchemas = {
  SmartSearchDto: {
    type: 'object',
    required: ['query'],
    properties: {
      query: {
        type: 'string',
        example: 'Show me large PDFs tagged with finance from March',
      },
    },
  },
  AdvancedSearchDto: {
    type: 'object',
    properties: {
      fileName: { type: 'string', example: 'report' },
      mimeType: { type: 'string', example: 'application/pdf' },
      tag: { type: 'string', example: 'finance' },
      isFavorite: { type: 'boolean', example: true },
      sizeMin: { type: 'number', example: 5000000 },
      sizeMax: { type: 'number', example: 20000000 },
      sharedOnly: { type: 'boolean', example: false },
      createdBefore: { type: 'string', format: 'date-time', example: '2024-07-03T00:00:00Z' },
      createdAfter: { type: 'string', format: 'date-time', example: '2024-06-01T00:00:00Z' },
    },
  },
  RawSearchDto: {
    type: 'object',
    properties: {
      query: { type: 'string', example: 'invoice' },
      directory: { type: 'string', example: 'documents/' },
      extension: { type: 'string', example: '.pdf' },
      metadata: { type: 'object' },
      page: { type: 'number', example: 1 },
      pageSize: { type: 'number', example: 20 },
    },
  },

};
