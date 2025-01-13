import { faker } from '@faker-js/faker';
import axios from 'axios';
import { createPing } from '../modules/historical/historical.service';
import { Ping } from '@prisma/client';
import { io } from '../server';
// Function to ping httpbin.org/anything with random payload
export const pingHttpBin = async (): Promise<void> => {
    const payload = generateRandomPayload();
    try {
        const response = await axios.post(
            'https://httpbin.org/anything',
            payload
        );
        console.log('Ping successful:', response.data);
        const createdPing = await createPing(payload);

        // Emit the ping data to all connected clients
        io.emit('BROADCASTED_PING', createdPing);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
    }
};

// Function to generate random payload data
const generateRandomPayload = (): Omit<
    Ping,
    'id' | 'createdAt' | 'updatedAt'
> => {
    return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        company: faker.company.name(),
    };
};
