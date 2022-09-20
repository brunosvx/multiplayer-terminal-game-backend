import { Server } from 'socket.io';

import { addPlayer } from './game.js';

const io = new Server(3333, {
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket) => {
    console.log('New socket connected:', socket.id);

    const positions = addPlayer({ playerId: socket.id })

    socket.emit('initialPositions', positions);
    socket.broadcast.emit('newPlayer', { playerId: socket.id, ...positions });
})