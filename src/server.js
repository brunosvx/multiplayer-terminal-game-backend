
const gameState = {
    players:{},
    fruits: {}
}

function addPlayer({ playerId, positionX, positionY }) {
    gameState.players[playerId] = {
        positionX,
        positionY
    }
    
}

function removePlayer({ playerId }) {
    delete gameState.players[playerId];
}

function removeFruit({ fruitId }) {
    delete gameState.fruits[fruitId];
}