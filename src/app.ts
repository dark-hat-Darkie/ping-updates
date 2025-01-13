import express, { Application } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import globalErrorMiddleware from './middlewares/globalErrorHandler';

// Import routes
import histocialRoutes from './modules/historical/historical.routes';

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

app.get('/', (req, res) => {
    res.send('Hello World');
});
// Routes
app.use('/historical', histocialRoutes);

// Error handling middleware
app.use(globalErrorMiddleware);
export default app;
