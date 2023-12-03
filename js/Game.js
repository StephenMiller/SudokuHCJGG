class Game {
    
    static activeGame = null;
    static hintsEnabled = false;
    static MAGIC_NUMBER = 9;

    static startingGrids = [
        // ... (existing starting grids)
        "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
        "000000805000030000000700000120000000000045700000020000000600000034058000091000000",
        "007090060030000007010000400000700008000030000200008000005000010900000020080040300",
        "100007090030020008009600500005300900010000080002005400001000700700030010080900004",
        "600008500070060100380000006500004000020000070000800003900000045007010020004600007",
        "004006070500803002603000850800090006030000080700410005085000104100704009060900200"
    ]

    constructor() {
        Game.activeGame = this;
        this.activeCell = null;
        this.grid = new Grid();
        this.nextGrid = new Grid(); // Initialize the next grid
        this.addEventListeners();
        this.startNewGame(0);  // Initial game

        this.hintsButton = document.getElementById('hints-button');
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
        this.removeOverlay();
        this.grid.initializeBoard(selectedGrid);
    }    
    
    handleDocumentClick(event) {
        // Handle document-level click events if needed
    }

    handleCellClick(cell) {
        if (cell.editable) {
            console.log(cell);
            console.log(this.activeCell);
            // Remove the overlay of the previously clicked cell
            if (this.activeCell && this.activeCell !== cell) {
                this.removeOverlay();
            }
    
            // Create the overlay
            this.overlay = this.createOverlay(cell);
            document.body.appendChild(this.overlay);
    
            // Position the overlay with the corner in the middle of the cell
            const rect = cell.element.getBoundingClientRect();
            const cellSize = cell.element.offsetWidth;
            const halfCellSize = (1/2) * cellSize;
            this.overlay.style.width = `${ 2.04 * cellSize }px`;
            this.overlay.style.top = `${rect.bottom - halfCellSize }px`;
            this.overlay.style.left = `${rect.left + halfCellSize}px`;

            // Set the active cell clicked cell
            this.activeCell = cell;
        } else {
            this.removeOverlay()
            this.activeCell = null
        }
    }

    createOverlay(cell) {
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        // Values including blank (0) are added to the overlay
        for (let value = 1; value <= 10; value++) {
            const valueButton = document.createElement('button')
            valueButton.textContent = value === 10 ? 'Blank' : value
            valueButton.addEventListener('click', () => cell.handleValueSelection(value))
            overlay.appendChild(valueButton)
        }

        return overlay;
    }

    removeOverlay() {
        if (this.overlay) {
            document.body.removeChild(this.overlay)
            this.overlay = null;
        }
    }

    toggleHints(){
        Game.hintsEnabled = !Game.hintsEnabled;
        this.updateBoardHints();
    }

    updateBoardHints() {
        // Iterate through each cell and update the display based on hintsEnabled
        for (let row = 0; row < Game.MAGIC_NUMBER; row++) {
            for (let col = 0; col < Game.MAGIC_NUMBER; col++) {
                const cell = this.grid.board[row][col];
                cell.updateCellDisplay();
            }
        }
    }
}