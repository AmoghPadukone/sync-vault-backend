// import { providerSchemas } from './schemas/provider.schemas'; // when you add them

import { authSchemas } from "./schema/auth.schemas";
import { providerSchemas } from "./schema/provider.schema";

export const swaggerComponents = {
    schemas: {
        ...authSchemas,
        ...providerSchemas,
    },
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
    },
};
