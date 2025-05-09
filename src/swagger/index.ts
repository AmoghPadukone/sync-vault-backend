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

const schemaDir = path.join(__dirname, 'schema'); // explicitly look in /schema
const schemas: Record<string, any> = {};

console.log('[DEBUG] __dirname:', __dirname);
console.log('[DEBUG] Scanning schema directory:', schemaDir);

const files = fs.readdirSync(schemaDir);
console.log('[DEBUG] Found files:', files);

files.forEach((file) => {
    if (file === 'index.ts' || !file.endsWith('.schema.ts')) return;

    const schemaPath = path.join(schemaDir, file);
    console.log(`[INFO] Attempting to require ${schemaPath}`);

    try {
        const mod = require(schemaPath);
        console.log(`[DEBUG] Module exports from ${file}:`, Object.keys(mod));

        Object.entries(mod).forEach(([key, val]) => {
            if (typeof val === 'object') {
                console.log(`[INFO] Spreading export "${key}" into schemas`);
                Object.assign(schemas, val);
            }
        });
    } catch (err) {
        console.error(`[ERROR] Failed to require ${schemaPath}:`, err);
    }
});

console.log('[DEBUG] Loaded Swagger Schemas:', Object.keys(schemas));

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
