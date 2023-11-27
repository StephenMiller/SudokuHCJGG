class Cell {

    static activeCell = null
    static MAX_VALUE = 9
    static startingGrids = [
        // ... (existing starting grids)
        "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
        "000000805000030000000700000120000000000045700000020000000600000034058000091000000",
        "007090060030000007010000400000700008000030000200008000005000010900000020080040300",
        "100007090030020008009600500005300900010000080002005400001000700700030010080900004",
        "600008500070060100380000006500004000020000070000800003900000045007010020004600007"
    ]
    
    constructor(row, column, initialValue) {
        this.row = row;
        this.col = column;
        this.house = this.determineHouse(this.row, this.col);
        this.element = this.createDivElement();
        this.editable = true;
        this.overlay = null;

        // Add a click event listener to the cell element
        this.element.addEventListener(
            'click', () => this.handleCellClick()
        );

        console.log(this.value)
        this.initializeCell(initialValue)
    }

    static selectStartingGrid(gridIndex) {
        if (gridIndex >= 0 && gridIndex < Cell.startingGrids.length) {
            const selectedGrid = Cell.startingGrids[gridIndex];
            return selectedGrid;
        } else {
            console.error("Invalid grid index");
            return Cell.startingGrids[0]; // Default to the first grid
        }
    }

    determineHouse(row, col) {
        // Determine the house (3x3 subgrid) index based on row and column
        const houseRow = Math.floor(row / 3);
        const houseCol = Math.floor(col / 3);
        return houseRow * 3 + houseCol;
    }

    createDivElement() {
        // Create a new div element for the cell
        const cellElement = document.createElement('div');
        cellElement.classList.add('sudoku-cell');
        return cellElement;
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        // Values including blank (0) are added to the overlay
        for (let value = 1; value <= Cell.MAX_VALUE + 1; value++) {
            const valueButton = document.createElement('button');
            valueButton.textContent = value === Cell.MAX_VALUE + 1 ? 'Blank' : value;
            valueButton.addEventListener('click', () => this.handleValueSelection(value));
            overlay.appendChild(valueButton);
        }

        return overlay;
    }

    removeOverlay() {
        if (this.overlay) {
            document.body.removeChild(this.overlay);
            this.overlay = null;
        }
        Cell.activeCell = null;
    }

    handleCellClick() {
        if (this.editable) {
            // Remove the overlay of the previously clicked cell
            if (Cell.activeCell && Cell.activeCell !== this) {
                Cell.activeCell.removeOverlay();
            }
    
            // Create the overlay
            this.overlay = this.createOverlay();
            document.body.appendChild(this.overlay);
    
            // Position the overlay with the corner in the middle of the cell
            const rect = this.element.getBoundingClientRect()
            const cellSize = this.element.offsetWidth
            const halfCellSize = (1/2) * cellSize
            this.overlay.style.width = `${ 2.04 * cellSize }px`
            this.overlay.style.top = `${rect.bottom - halfCellSize }px`
            this.overlay.style.left = `${rect.left + halfCellSize}px`

            // Set the active cell to this cell
            Cell.activeCell = this;
        } else {
            Cell.activeCell.removeOverlay()
        }
    }

    handleValueSelection(selectedValue) {
        // Update the cell's value and remove the overlay
        this.updateCellValue(selectedValue);
        document.body.removeChild(this.overlay);
        this.overlay = null;
    }

    initializeCell(initialValue){
        this.updateCellValue(initialValue)
        if(this.value !== null){
            this.editable = false
            this.element.style.backgroundColor = 'lightgray'
        }
    }

    updateCellValue(newValue){
        // Validate new value
        const isValidInput = /^[1-9]?$/.test(newValue);
        // Set the value of the cell
        this.value = ( isValidInput ? newValue : null );
        this.updateCellDisplay()
    }

    updateCellDisplay() {
        // Update the content of the cell element with the current value
        this.element.textContent = this.value;
    }
}