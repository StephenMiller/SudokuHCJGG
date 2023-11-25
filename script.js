let game = null

// Add a function to handle grid selection
function selectGrid(gridIndex) {
    game.startNewGame(gridIndex)
}

document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});

