// middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError'; // Import the class
import { Prisma } from '@prisma/client';

const globalErrorMiddleware = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({
            message: err.message,
            code: err.statusCode,
        });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).json({
            status: 'error',
            message: 'Prisma error occurred',
            code: err.code,
        });
    }

    res.status(500).json({
        status: 'error',
        message: (err as Error).message || 'Internal Server Error',
    });
};

export default globalErrorMiddleware;
