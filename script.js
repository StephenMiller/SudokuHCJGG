let game = null;
let currentGrid = null;

// Add a function to handle grid selection
function selectGrid(gridIndex) {
    game.startNewGame(gridIndex);
    currentGrid = gridIndex;
}

function newGrid() {
    selectGrid(currentGrid);
}

function clearGrid(){
    selectGrid(6);
}

document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});