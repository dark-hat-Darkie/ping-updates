// tests/app.test.ts
import request from 'supertest';
import app from '../../../app'; // Import the Express app

jest.mock('../../../modules/historical/historical.service', () => {
    return {
        getPings: jest.fn().mockImplementation(() => [
            { id: 1, createdAt: new Date('2023-01-01T00:00:00Z') },
            { id: 2, createdAt: new Date('2023-01-02T00:00:00Z') },
        ]),
    };
});

describe('Express API tests', () => {
    it('should return a list of historical data', async () => {
        const response = await request(app).post('/api/v1/historical').send({
            from: '2023-01-12',
            to: '2025-01-13',
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 1,
                    createdAt: '2023-01-01T00:00:00.000Z',
                }),
                expect.objectContaining({
                    id: 2,
                    createdAt: '2023-01-02T00:00:00.000Z',
                }),
            ])
        );
    });

    it('should throw Zod Error if `to` is mising from body', async () => {
        const response = await request(app).post('/api/v1/historical').send({
            from: '2023-01-12',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should throw Zod Error if `from` is missing from body', async () => {
        const response = await request(app).post('/api/v1/historical').send({
            to: '2025-01-13',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should throw Zod Error if both `to` and `from` is not present', async () => {
        const response = await request(app).post('/api/v1/historical').send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should throw Zod Error if `from` is later than `to`', async () => {
        const response = await request(app).post('/api/v1/historical').send({
            from: '2025-01-13',
            to: '2023-01-12',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should throw Zod Error if `to` is in the future', async () => {
        const response = await request(app)
            .post('/api/v1/historical')
            .send({
                from: '2023-01-12',
                to: new Date(new Date().setDate(new Date().getDate() + 1)),
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should throw Zod Error if `from` is not a valid date', async () => {
        const response = await request(app).post('/api/v1/historical').send({
            from: '2023-01-12T00:00:00Z',
            to: '2025-01-13',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should throw Zod Error if `to` is not a valid date', async () => {
        const response = await request(app).post('/api/v1/historical').send({
            from: '2023-01-12',
            to: '2025-01-13T00:00:00Z',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });
});
