import { getPings } from '../../modules/historical/historical.service';
import { PrismaClient } from '@prisma/client';

// Mock the Prisma client
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            ping: {
                findMany: jest.fn().mockImplementation(() => [
                    { id: 1, createdAt: new Date('2023-01-01T00:00:00Z') },
                    { id: 2, createdAt: new Date('2023-01-02T00:00:00Z') },
                ]),
            },
        })),
    };
});

describe('getPings', () => {
    let prisma: PrismaClient;

    beforeAll(() => {
        prisma = new PrismaClient();
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test to avoid state leaks
    });

    it('should return pings for the given date range', async () => {
        const from = '2023-01-12';
        const to = '2025-01-13';

        const mockPings = [
            { id: 1, createdAt: new Date('2023-01-01T00:00:00Z') },
            { id: 2, createdAt: new Date('2023-01-02T00:00:00Z') },
        ];
        // Call the actual function you're testing
        const pings = await getPings(from, to);
        console.log(pings); // Log pings for debugging

        // Assert that the function returns the mocked pings
        expect(pings).toEqual(mockPings);
    });
});
