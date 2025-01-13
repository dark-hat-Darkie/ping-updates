import express, { Application } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import globalErrorMiddleware from './middlewares/globalErrorHandler';

import v1Routes from './modules/routes.v1';

// Load environment variables
config();

const app: Application = express();

// Middleware
app.use(
    cors({
        origin: '*',
    })
);

app.use(express.json());

app.use('/api/v1', v1Routes);

// Error handling middleware
app.use(globalErrorMiddleware);
export default app;
