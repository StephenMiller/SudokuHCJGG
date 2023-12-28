class Game {
    
    static activeGame = null;
    static hintsEnabled = false;
    static MAGIC_NUMBER = 9;
    static eventBus = null;
    static selector = null;

    static startingGrids = [
        // Blank
        "000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        // Easy
        "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
        /// Medium
        "200080300060070084030500209000105408000000000402706000301007040720040060004010003",
        // Hard
        "000000012000035000000600070700000300000400800100000000000120000080000040050000600",
        // Very Hard
        "000300000000040000000000506460000070000070000020004000300900200040000700000008000",
        // Fiendish
        "000075400000000008080190000300001060000000034000068170204000603900000020530200000",
        // Diabolical
        "300000000050320000000000700000200900100040002063000000000000010000000000000082640",
        // Extreme
        "100007090030020008009600500005300900010080002600004000300000010040000007007000300"
    ]

    constructor() {
        Game.activeGame = this;
        Game.eventBus = new EventBus();
        Game.selector = new SelectionOverlay();
        Game.hintsEnabled = true;
        this.activeCell = null;
        this.grid = new Grid(); // This is the current grid and the on displayed to screen
        this.nextGrid = new Grid(); // Initialize the next grid, the future step based on logical implications
        this.addEventListeners();
        this.hintsButton = document.getElementById('hints-button');

        this.startNewGame(1);  // Initial game
    }

    static selectStartingGrid(gridIndex) {
        if (gridIndex >= 0 && gridIndex < Game.startingGrids.length) {
            const selectedGrid = Game.startingGrids[gridIndex];
            return selectedGrid;
        } else {
            console.error("Invalid grid index");
            return Game.startingGrids[1]; // Default to the first grid
        }
    }    

    addEventListeners() {
        // Add any necessary event listeners
        document.addEventListener('click', (event) => this.handleDocumentClick(event));
    }

    startNewGame(gridIndex) {
        console.log(`Start New Game Index: ${gridIndex}`);
        const selectedGrid = Game.selectStartingGrid(gridIndex);
        this.grid.initializeBoard(selectedGrid);
        this.updateBoard();
    }    
    
    handleDocumentClick(event) {
        // Handle document-level click events if needed
    }

    toggleHints(){
        // Toggle!
        Game.hintsEnabled = !Game.hintsEnabled;
        // Report
        const string = Game.hintsEnabled? 'On' : 'Off';
        console.log(`Toggle Hints: Hints ${string}`);
        // Trigger <LogicUpdate> event
        this.updateBoard();
    }

    updateBoard() {
        // Iterate through each cell and update the display
        for (let row = 0; row < Game.MAGIC_NUMBER; row++) {
            for (let col = 0; col < Game.MAGIC_NUMBER; col++) {
                this.grid.board[row][col].display.update();
            }
        }
    }

    calculateScores() {
        // How many cells solved?

        // How many numbers completed?

        // How many more to solve for each number?

        // Which rows, columns, and houses are solved?

        // Is the game complete?

        // How long has the current game been running?
    }
}