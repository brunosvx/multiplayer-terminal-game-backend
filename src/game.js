import { v4 as uuid } from 'uuid';

import { config } from './config.js';
import { emitPlayerPoints, newFruitGenerated } from './server.js';

export const gameState = {
    players:{},
    fruits: {}
}

function generateRandomPositions() {
    const positionX = Math.floor(Math.random() * config.screenWidth);
    const positionY = Math.floor(Math.random() * config.screenHeight);

    return { positionX, positionY }
}

function addFruit({ fruitId, positionX, positionY }) {
    gameState.fruits[fruitId] = {
        positionX,
        positionY
    }
}


function generateFruits({ interval, max }) {
    if(Object.keys(gameState.fruits).length >= max) return setTimeout(() => generateFruits({ interval, max }), interval);
    if(!Object.keys(gameState.players).length) return setTimeout(() => generateFruits({ interval, max }), interval);

    const fruitPositions = generateRandomPositions();
    const fruitId = uuid()

    addFruit({
        fruitId,
        ...fruitPositions
    })

    newFruitGenerated({ fruitId, ...fruitPositions });
    setTimeout(() => generateFruits({ interval, max }), interval);
}

generateFruits({ interval: 2000, max: 5 });

export function addPlayer({ playerId, positions = generateRandomPositions() }) {
    gameState.players[playerId] = {
        positionX: positions.positionX,
        positionY: positions.positionY,
        points: 0
    }
    return positions;
}

export function removePlayer({ playerId }) {
    delete gameState.players[playerId];
}

function removeFruit({ fruitId }) {
    delete gameState.fruits[fruitId];
}

export function movePlayer({ playerId, move }) {
    const acceptedMoves = {
        down() {
            if(gameState.players[playerId].positionY + 1 === config.screenHeight) return false;
            gameState.players[playerId].positionY++
        },
        up() {
            if(gameState.players[playerId].positionY === 0) return false;
            gameState.players[playerId].positionY--
        },
        left() {
            if(gameState.players[playerId].positionX === 0) return false;
            gameState.players[playerId].positionX--
        },
        right() {
            if(gameState.players[playerId].positionX + 1 === config.screenWidth) return false;
            gameState.players[playerId].positionX++
        },
    }

    const moveFunction = acceptedMoves[move];

    if(!moveFunction) return false;

    moveFunction();
    checkPlayerCollision({ playerId })
    return true;
}


function checkPlayerCollision({ playerId }) {
    const player = gameState.players[playerId];

    for(const fruitId in gameState.fruits){
        const fruit = gameState.fruits[fruitId];
        if(player.positionX !== fruit.positionX || player.positionY !== fruit.positionY) continue

        removeFruit({
            fruitId
        });

        player.points++
        emitPlayerPoints({
            playerId,
            points: player.points
        })
    }
}
