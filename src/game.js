import { config } from './config.js';

const gameState = {
    players:{},
    fruits: {}
}

function generateRandomPositions() {
    const positionX = Math.floor(Math.random() * config.screenWidth);
    const positionY = Math.floor(Math.random() * config.screenHeight);

    return { positionX, positionY }
}

export function addPlayer({ playerId, positions = generateRandomPositions() }) {
    gameState.players[playerId] = {
        positionX: positions.positionX,
        positionY: positions.positionY
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
            if(gameState.players[playerId].positionY + 1 === config.screenHeight) return
            gameState.players[playerId].positionY++
        },
        up() {
            if(gameState.players[playerId].positionY === 0) return
            gameState.players[playerId].positionY--
        },
        left() {
            if(gameState.players[playerId].positionX === 0) return
            gameState.players[playerId].positionX--
        },
        right() {
            if(gameState.players[playerId].positionX + 1 === config.screenWidth) return
            gameState.players[playerId].positionX++
        },
    }

    const moveFunction = acceptedMoves[move];

    if(!moveFunction) return;

    moveFunction();
    checkPlayerCollision({ playerId })
}


function checkPlayerCollision({ playerId }) {
    const player = gameState.players[playerId];

    for(const fruitId in gameState.fruits){
        const fruit = gameState.fruits[fruitId];
        if(player.positionX !== fruit.positionX || player.positionY !== fruit.positionY) continue

        removeFruit({
            fruitId
        })
    }
}
