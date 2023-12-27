class Game {
    
    static activeGame = null;
    static hintsEnabled = false;
    static MAGIC_NUMBER = 9;
    static eventBus = null;
    static selector = null;

    static startingGrids = [
        // ... (existing starting grids)
        "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
        "000000805000030000000700000120000000000045700000020000000600000034058000091000000",
        "007090060030000007010000400000700008000030000200008000005000010900000020080040300",
        "100007090030020008009600500005300900010000080002005400001000700700030010080900004",
        "600008500070060100380000006500004000020000070000800003900000045007010020004600007",
        "004006070500803002603000850800090006030000080700410005085000104100704009060900200",
        "000000000000000000000000000000000000000000000000000000000000000000000000000000000"
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

        this.startNewGame(0);  // Initial game
    }

    static selectStartingGrid(gridIndex) {
        if (gridIndex >= 0 && gridIndex < Game.startingGrids.length) {
            const selectedGrid = Game.startingGrids[gridIndex];
            return selectedGrid;
        } else {
            console.error("Invalid grid index");
            return Game.startingGrids[0]; // Default to the first grid
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