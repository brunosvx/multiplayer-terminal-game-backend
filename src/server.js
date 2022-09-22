import { Server } from 'socket.io';

import { addPlayer, movePlayer, gameState } from './game.js';
console.log('server.js')
const io = new Server(3333, {
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket) => {
    console.log('New socket connected:', socket.id);

    socket.on('move', data => {
       const hasMoved = movePlayer({
        playerId: socket.id,
        move: data.move
       })

       if(!hasMoved) return;

       socket.broadcast.emit('playerMove', { playerId: socket.id, move: data.move });

    })

    const positions = addPlayer({ playerId: socket.id })

    socket.emit('setup', gameState);
    socket.broadcast.emit('newPlayer', { playerId: socket.id, ...positions });
})

export function newFruitGenerated({ fruitId, positionX, positionY }) {

    io.emit('newFruit', { fruitId, positionX, positionY });

}