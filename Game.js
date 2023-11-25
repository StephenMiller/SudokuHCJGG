class Game {
    constructor() {
        // Initial setup
        this.board = Array.from({ length: 9 }, () => Array(9).fill(null));
        this.initializeDOM();
        this.addEventListeners();
        this.startNewGame(0);  // Initial game
    }

    initializeDOM() {
        // Initialize any DOM-related setup
        this.sudokuGridElement = document.getElementById('sudoku-grid');
        this.gridSelectionButtonsElement = document.getElementById('grid-selection-buttons');
    }

    addEventListeners() {
        // Add any necessary event listeners
        document.addEventListener('click', (event) => this.handleDocumentClick(event));
    }

    startNewGame(gridIndex) {
        const selectedGrid = Cell.selectStartingGrid(gridIndex);
        this.clearBoard();
        this.initializeBoard(selectedGrid);
    }

    clearBoard() {
        // Logic to clear the board (reset cells)
        this.sudokuGridElement.innerHTML = '';  // Clear the HTML content
    }

    initializeBoard(selectedGrid) {
        this.clearBoard()
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const index = row * 9 + col;
                const value = parseInt(selectedGrid[index], 10);
                this.board[row][col] = value;

                const cell = new Cell(row, col, value);
                this.sudokuGridElement.appendChild(cell.element);
            }
        }
    }

    handleDocumentClick(event) {
        // Handle document-level click events if needed
    }
}