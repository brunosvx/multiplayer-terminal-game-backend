import { Server } from 'socket.io';

import game from './game.js';

const io = new Server(3333, {
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket) => {

    console.log(socket.id);
})