class Cell {
    constructor(row, column, initialValue) {
        this.row = row;
        this.col = column;
        this.house = this.determineHouse(this.row, this.col);
        this.element = this.createDivElement();
        this.editable = true;

        // Add a click event listener to the cell element
        this.element.addEventListener(
            'click', () => this.handleCellClick()
        );

        console.log(this.value)
        this.initializeCell(initialValue)
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

    handleCellClick() {
        if(this.editable){
            // Prompt the user for input
            const userInput = prompt('Enter a value (1-9) or leave it blank:');
            this.updateCellValue(userInput)
        }
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

        if (isValidInput) {
            // Set the value of the cell
            this.value = newValue;
        } else {
            // Clear the cell if input is not valid
            this.value = null;
        }

        this.updateCellDisplay()
    }

    updateCellDisplay() {
        // Update the content of the cell element with the current value
        this.element.textContent = this.value;
    }
}