import axios from 'axios';
import app from './app';
import { createServer } from 'http';
import cron from 'node-cron';
import { pingHttpBin } from './utils/ping';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;

// Schedule the task to run every 5 minutes
cron.schedule('*/1 * * * *', () => {
    console.log('Pinging httpbin.org/anything...');
    pingHttpBin();
});

const http = createServer(app);
// express http server
export const server = http.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// websocket server
export const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
