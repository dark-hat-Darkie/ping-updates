import { Ping, PrismaClient } from '@prisma/client';
import { CustomError } from '../../utils/CustomError';
const prisma = new PrismaClient();

export const getPings = async (from: string, to: string): Promise<Ping[]> => {
    try {
        const pings = await prisma.ping.findMany({
            where: {
                createdAt: {
                    gte: new Date(from),
                    lt: new Date(
                        new Date(to).setDate(new Date(to).getDate() + 1)
                    ),
                },
            },
        });
        return pings;
    } catch (error) {
        throw new CustomError('Error occurred while fetching pings', 500);
    }
};

export const createPing = async (
    ping: Omit<Ping, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Ping> => {
    try {
        const user = await prisma.ping.create({
            data: {
                name: ping.name,
                email: ping.email,
                address: ping.address,
                phone: ping.phone,
                company: ping.company,
            },
        });

        return user;
    } catch (error) {
        throw new CustomError('Error occurred while writing ping', 500);
    }
};
