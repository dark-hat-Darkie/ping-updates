import { NextFunction, Request, Response } from 'express';
import { createPing, getPings } from './historical.service';

export const getPingsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { from, to } = req.body;
        const users = await getPings(from, to);
        res.json(users);
    } catch (error) {
        return next(error);
    }
};
