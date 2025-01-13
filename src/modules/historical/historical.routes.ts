import { Router } from 'express';
import { getPingsController } from './historical.controller';
import { getHistoricalDataZodSchema } from './req.types';
import { validate } from '../../middlewares/validate';

const router = Router();

router.post('/', validate(getHistoricalDataZodSchema), getPingsController);

export default router;
