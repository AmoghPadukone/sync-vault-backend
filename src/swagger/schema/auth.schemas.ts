export const authSchemas = {
  SignupDto: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', example: 'user@example.com' },
      password: { type: 'string', example: 'securePassword123' },
    },
  },
  LoginDto: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
  UserPreference: {
    type: 'object',
    properties: {
      theme: { type: 'string', enum: ['light', 'dark'], example: 'dark' },
      itemsPerPage: { type: 'integer', example: 20 },
      locale: { type: 'string', example: 'en-US' },
      dateFormat: { type: 'string', example: 'MM/DD/YYYY' },
      defaultUploadFolderPath: { type: 'string' },
      notificationEmailEnabled: { type: 'boolean', example: true },
    },
  },
  ProfileUpdateDto: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      defaultProvider: { type: 'string', enum: ['aws', 'gcp', 'azure'] },
      preferences: { $ref: '#/components/schemas/UserPreference' },
    },
  },
};
