import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { logger } from './config/logger';
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './plugins/swagger';
import authRoutes from './routes/auth.routes';
import helloRoutes from './routes/hello.routes';

const app = express();
setupSwagger(app);

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/hello', helloRoutes);
app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.use(errorHandler);

export default app;
