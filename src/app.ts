import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { logger } from './config/logger';
import { errorHandler } from './middlewares/errorHandler';
import { handleErrors } from './middlewares/handleErrors';
import { setupSwagger } from './plugins/swagger';
import { registerRoutes } from './routes';
// import authRoutes from './routes/auth.routes';
// import cloudProviderRoutes from './routes/cloudProvider.routes';
// import helloRoutes from './routes/hello.routes';

const prisma = new PrismaClient();

const app = express();
setupSwagger(app);

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
registerRoutes(app);

// app.use('/api/auth', authRoutes);
// app.use('/api/hello', helloRoutes);
// app.use('/api/provider', cloudProviderRoutes);
// app.get('/', (req, res) => {
//     res.send('Hello World');
// });
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});
// Health check route
app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`; // basic DB check
        res.json({ status: 'ok' });
    } catch (err) {
        logger.error('Health check failed:', err);
        res.status(500).json({ status: 'error' });
    }
});
// app.use(handleErrors);


app.use(errorHandler);

export default app;
