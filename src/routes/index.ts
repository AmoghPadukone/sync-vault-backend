import { Express } from 'express';
import fs from 'fs';
import path from 'path';

const ROUTES_DIR = __dirname;

export const registerRoutes = (app: Express) => {
    ``
    const files = fs.readdirSync(ROUTES_DIR);

    files.forEach((file) => {
        if (
            file === 'index.ts' ||
            file === 'index.js' ||
            !file.endsWith('.routes.ts') &&
            !file.endsWith('.routes.js')
        ) return;

        const routePath = path.join(ROUTES_DIR, file);
        const route = require(routePath).default;

        // e.g., 'cloudProvider.routes.ts' → 'cloudProvider'
        const baseName = file.split('.')[0];
        const routeName = baseName.replace('.routes', '');

        app.use(`/api/${routeName}`, route);
    });
};
