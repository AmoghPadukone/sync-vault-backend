// // import { providerSchemas } from './schemas/provider.schemas'; // when you add them

// import { authSchemas } from "./schema/auth.schemas";
// import { providerSchemas } from "./schema/provider.schema";

// export const swaggerComponents = {
//     schemas: {
//         ...authSchemas,
//         ...providerSchemas,
//     },
//     securitySchemes: {
//         bearerAuth: {
//             type: 'http',
//             scheme: 'bearer',
//             bearerFormat: 'JWT',
//         },
//     },
// };


import fs from 'fs';
import path from 'path';

const schemaDir = __dirname;
const schemas: Record<string, any> = {};

fs.readdirSync(schemaDir).forEach((file) => {
    if (
        file === 'index.ts' ||
        !file.endsWith('.schema.ts')
    ) return;

    const schemaPath = path.join(schemaDir, file);
    const mod = require(schemaPath);

    Object.entries(mod).forEach(([key, value]) => {
        schemas[key] = value;
    });
});

export const swaggerComponents = {
    schemas,
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
    },
};
