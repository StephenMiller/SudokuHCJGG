let game = null
let eventBus = null

// Add a function to handle grid selection
function selectGrid(gridIndex) {
    game.startNewGame(gridIndex);
}

function toggleHints() {
    game.toggleHints();
}

document.addEventListener('DOMContentLoaded', () => {
    eventBus = new EventBus();
    game = new Game();
})