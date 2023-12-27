class Grid{
    static MAGIC_NUMBER = 9
    static activeGrid = null

    constructor(){
        // Initial setup
        Grid.activeGrid = this;
        this.board = Array.from({ length: Grid.MAGIC_NUMBER }, () => Array(Grid.MAGIC_NUMBER).fill(null));
        this.initializeDOM();
    }

    initializeDOM() {
        // Initialize any DOM-related setup
        this.sudokuGridElement = document.getElementById('sudoku-grid');
        this.gridSelectionButtonsElement = document.getElementById('grid-selection-buttons');
    }

    //Create a new game based on the input grid (numeric string identifier code)
    initializeBoard(gridCode) {
        // Clear the board of everything so we can start from scratch
        this.clearBoard()

        // Create a fresh collection of cells in a 9x9 grid
        for (let row = 0; row < Grid.MAGIC_NUMBER; row++) {
            for (let col = 0; col < Grid.MAGIC_NUMBER; col++) {    
                // Construct board of cells          
                const cell = new Cell(row, col);
                // Append new display elements to this grid
                this.sudokuGridElement.appendChild(cell.display.element);
                // Assign cell to the Grid board
                this.board[row][col] = cell;
            }
        }

        // Create the groups with complete and existing cells
        this.rowGroups = Array.from({ length: Grid.MAGIC_NUMBER }, (element, index) => new RowGroup(index, this.board[index]));
        this.columnGroups = Array.from({ length: Grid.MAGIC_NUMBER }, (element, index) => new ColumnGroup(index, this.board.map(row => row[index])));
        this.houseGroups = Array.from({ length: Grid.MAGIC_NUMBER }, (element, index) => new HouseGroup(index, this.board
            .slice(Math.floor(index / 3) * 3, Math.floor(index / 3) * 3 + 3)
            .flatMap(row => row.slice((index % 3) * 3, (index % 3) * 3 + 3))));

        // Assign the groups to each cell
        for (let row = 0; row < Grid.MAGIC_NUMBER; row++) {
            for (let col = 0; col < Grid.MAGIC_NUMBER; col++) {    
                const cell = this.board[row][col];
                cell.setGroups(this.rowGroups[row], this.columnGroups[col], this.houseGroups[Math.floor(row / 3) * 3 + Math.floor(col / 3)]);
            }
        }

        // After the entire board is made and the groups are assigned, then start assigning values
        for (let row = 0; row < Grid.MAGIC_NUMBER; row++) {
            for (let col = 0; col < Grid.MAGIC_NUMBER; col++) {
                const index = row * Grid.MAGIC_NUMBER + col;
                const value = parseInt(gridCode[index], 10);
                this.board[row][col].initializeCell(value);
            }
        }
    }
    
    clearBoard() {
        // Logic to clear the board (reset cells)
        this.sudokuGridElement.innerHTML = ''  // Clear the HTML content
        this.board = Array.from({ length: Grid.MAGIC_NUMBER }, () => Array(Grid.MAGIC_NUMBER).fill(null));
    }
}