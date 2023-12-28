let game = null;
let currentGrid = null;
const zeroGrid = 6;

// Add a function to handle grid selection
function selectGrid(gridIndex) {
    game.startNewGame(gridIndex);
    currentGrid = gridIndex;
}

function toggleHints() {
    game.toggleHints();
}

function newGrid() {
    selectGrid(currentGrid);
}

function clearGrid() {
    selectGrid(zeroGrid);
}

document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
})