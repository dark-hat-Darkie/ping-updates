import { Router } from 'express';
import historicalRouter from './historical/historical.routes';
const router = Router();

router.use('/historical', historicalRouter);

export default router;
