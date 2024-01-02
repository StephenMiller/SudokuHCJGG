class Grid{
    static SIZE = 9
    static activeGrid = null

    constructor(){
        // Initial setup
        Grid.activeGrid = this;
        this.board = Array.from({ length: Grid.SIZE }, () => Array(Grid.SIZE).fill(null));
        this.rowGroups = null;
        this.columnGroups = null;
        this.houseGroups = null;
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

        // Create a cells for the board
        //  Generate a fresh collection of cells in a 9x9 grid
        for (let row = 0; row < Grid.SIZE; row++) {
            for (let col = 0; col < Grid.SIZE; col++) {    
                const cell = new Cell(row, col, this);
                this.board[row][col] = cell;
            }
        }

        // Assign cells to groups
        //  Create the groups, and assign cells to
        //  them based on their row, column, and house.
        //  This has to happen after the board is created
        this.rowGroups = Array.from({ length: Grid.SIZE }, (element, index) => new RowGroup(index, this.board[index]));
        this.columnGroups = Array.from({ length: Grid.SIZE }, (element, index) => new ColumnGroup(index, this.board.map(row => row[index])));
        this.houseGroups = Array.from({ length: Grid.SIZE }, (element, index) => new HouseGroup(index, this.board
            .slice(Math.floor(index / 3) * 3, Math.floor(index / 3) * 3 + 3)
            .flatMap(row => row.slice((index % 3) * 3, (index % 3) * 3 + 3))));

        // Assign the groups to each cell
        for (let row = 0; row < Grid.SIZE; row++) {
            for (let col = 0; col < Grid.SIZE; col++) {    
                const cell = this.board[row][col];
                cell.setGroups(this.rowGroups[row], this.columnGroups[col], this.houseGroups[Math.floor(row / 3) * 3 + Math.floor(col / 3)]);
            }
        }

        // Assign the groups to each group
        this.rowGroups.forEach( row => row.setGroups(this.houseGroups) );
        this.columnGroups.forEach( col => col.setGroups(this.houseGroups) );
        this.houseGroups.forEach( house => house.setGroups(this.rowGroups, this.columnGroups) );

        // After the entire board is made and the groups are assigned, then start assigning values
        for (let row = 0; row < Grid.SIZE; row++) {
            for (let col = 0; col < Grid.SIZE; col++) {
                const index = row * Grid.SIZE + col;
                const value = parseInt(gridCode[index], 10);
                this.board[row][col].initializeCell(value);
            }
        }
    }
    
    clearBoard() {
        // Logic to clear the board (reset cells)
        this.sudokuGridElement.innerHTML = ''  // Clear the HTML content
        this.board = Array.from({ length: Grid.SIZE }, () => Array(Grid.SIZE).fill(null));
    }
}