class Grid{
    static MAGIC_NUMBER = 9
    static activeGrid = null

    constructor(){
        // Initial setup
        Grid.activeGrid = this;
        this.board = Array.from({ length: Grid.MAGIC_NUMBER }, () => Array(Grid.MAGIC_NUMBER).fill(null));
        this.rowGroups = Array.from({ length: Grid.MAGIC_NUMBER }, () => new Group());
        this.colGroups = Array.from({ length: Grid.MAGIC_NUMBER }, () => new Group());
        this.houseGroups = Array.from({ length: Grid.MAGIC_NUMBER }, () => new Group());
        this.initializeDOM();
        eventBus.subscribe('cellUpdated', updatedCell => this.handleCellUpdate(updatedCell));
    }

    initializeDOM() {
        // Initialize any DOM-related setup
        this.sudokuGridElement = document.getElementById('sudoku-grid');
        this.gridSelectionButtonsElement = document.getElementById('grid-selection-buttons');
    }

    clearBoard() {
        // Logic to clear the board (reset cells)
        this.sudokuGridElement.innerHTML = ''  // Clear the HTML content
        this.board = Array.from({ length: Grid.MAGIC_NUMBER }, () => Array(Grid.MAGIC_NUMBER).fill(null));
        this.rowGroups.forEach(group => group.clear());
        this.colGroups.forEach(group => group.clear());
        this.houseGroups.forEach(group => group.clear());
    }

    initializeBoard(selectedGrid) {
        this.clearBoard()

        for (let row = 0; row < Grid.MAGIC_NUMBER; row++) {
            for (let col = 0; col < Grid.MAGIC_NUMBER; col++) {
                const index = row * Grid.MAGIC_NUMBER + col;
                console.log(`Index: ${index}`)
                const value = parseInt( selectedGrid[index], 10 );
                
                const cell = new Cell(row, col);
                cell.initializeCell(value);
                this.board[row][col] = cell;
                this.rowGroups[row].addCell(cell);
                this.colGroups[col].addCell(cell);
                this.houseGroups[cell.house].addCell(cell);
                this.sudokuGridElement.appendChild(cell.element);
            }
        }
    }

    handleCellUpdate(updatedCell) {
        console.log(`Cell (${updatedCell.row},${updatedCell.col}) House:`)

        const uniqueRowGroups = Array.from(new Set([
            ...this.rowGroups[updatedCell.row].getCells()
        ]))

        let valuesInGroup = uniqueRowGroups
        .map(cell => cell.getValue())
        .filter(value => value !== null)
        .filter((value, index, self) => self.indexOf(value) === index);

        uniqueRowGroups.forEach(cell => cell.updatePossibilities(valuesInGroup));

        const uniqueColGroups = Array.from(new Set([
            ...this.colGroups[updatedCell.col].getCells()
        ]));

        valuesInGroup = uniqueColGroups
        .map(cell => cell.getValue())
        .filter(value => value !== null)
        .filter((value, index, self) => self.indexOf(value) === index);

        uniqueColGroups.forEach(cell => cell.updatePossibilities(valuesInGroup));

        const uniqueHouseGropus = Array.from(new Set([
            ...this.houseGroups[updatedCell.house].getCells()
        ]));

        valuesInGroup = uniqueHouseGropus
        .map(cell => cell.getValue())
        .filter(value => value !== null)
        .filter((value, index, self) => self.indexOf(value) === index);

        uniqueHouseGropus.forEach(cell => cell.updatePossibilities(valuesInGroup));
    }
}