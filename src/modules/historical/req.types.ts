import { query } from 'express';
import { z } from 'zod';

export const getHistoricalDataZodSchema = z.object({
    body: z
        .object({
            from: z
                .string()
                .regex(
                    /^\d{4}-\d{2}-\d{2}$/,
                    'Invalid date format. Use YYYY-MM-DD.'
                )
                .refine((date) => !isNaN(Date.parse(date)), {
                    message: 'Invalid date value.',
                }),
            to: z
                .string()
                .regex(
                    /^\d{4}-\d{2}-\d{2}$/,
                    'Invalid date format. Use YYYY-MM-DD.'
                )
                .refine((date) => !isNaN(Date.parse(date)), {
                    message: 'Invalid date value.',
                }),
        })
        .strict()
        .refine(
            (data) => {
                const fromDate = new Date(data.from);
                const toDate = new Date(data.to);
                return fromDate <= toDate;
            },
            {
                message:
                    '"from" date must be earlier than or equal to "to" date.',
                path: ['from'], // Optionally specify the error path
            }
        )
        .refine(
            (data) => {
                const toDate = new Date(data.to);
                const now = new Date();
                return toDate <= now;
            },
            {
                message: '"to" date cannot be in the future.',
                path: ['to'], // Optionally specify the error path
            }
        ),
    query: z.object({}).optional(),
    params: z.object({}).optional(),
});
