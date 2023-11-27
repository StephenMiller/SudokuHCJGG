class Cell {

    static activeCell = null;
    
    constructor(row, column, initialValue) {
        this.row = row;
        this.col = column;
        this.house = this.determineHouse(this.row, this.col);
        this.element = this.createDivElement();
        this.editable = true;
        this.possibilities = Array(Cell.MAX_VALUE).fill(true);
        this.numberOfPossiblities = 9;

        // Add a click event listener to the cell element
        this.element.addEventListener( 'click', () => this.handleCellClick() );
    }

    getValue(){
        return this.value;
    }

    handleCellClick() {
        if(Game.activeGame){
            Game.activeGame.handleCellClick(this)
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

    handleValueSelection(selectedValue) {
        // Update the cell's value and remove the overlay
        this.updateCellValue(selectedValue);
        if(Game.activeGame){
            Game.activeGame.removeOverlay()
        }
    }

    initializeCell(initialValue){
        this.updateCellValue(initialValue);
        if(this.value !== null){
            this.editable = false;
            this.element.style.backgroundColor = 'lightgray';
        }
    }

    updateCellValue(newValue){
        // Validate new value
        const isValidInput = /^[1-9]?$/.test(newValue);
        // Set the value of the cell
        if(isValidInput){
            this.value = newValue;
            this.possibilities = Array(Game.MAGIC_NUMBER).fill(false);
            this.possibilities[this.value-1] = true;
        } else {
            this.value = null
            this.possibilities = Array(Game.MAGIC_NUMBER).fill(true);
        }
        this.updateCellDisplay();
        eventBus.publish(`cellUpdated`, this);
    }

    updateCellDisplay() {
        if(Game.hintsEnabled && this.value === null){
            this.showSubCells();
        } else {
            this.hideSubCells();
            // Update the content of the cell element with the current value
            this.element.textContent = this.value;
        }        
    }

    showSubCells(){
         // Create a sub-grid container
         const subGrid = document.createElement('div');
         subGrid.classList.add('sub-grid');
         console.log(`${this.row},${this.col}`)
         console.log(this.numberOfPossibilities)
     
         for (let i = 1; i <= Game.MAGIC_NUMBER; i++) {
             const subCell = document.createElement('div');
             subCell.classList.add('sub-cell');
             
             // Create a span element for each number
             const numberSpan = document.createElement('span');
             numberSpan.textContent = this.possibilities[i - 1] ? i : '';
             
             subCell.appendChild(numberSpan);
             subGrid.appendChild(subCell);
             
             if(this.numberOfPossibilities === 1){
                subCell.classList.add('single-possibility')
             }
         }
     
         this.element.appendChild(subGrid);
    }

    hideSubCells(){
        // Hide subcells
        this.element.innerHTML = '';
    }

    updatePossibilities(valuesInGroup) {
        console.log(`Update Possibilities for Cell: (${this.row}, ${this.col})`);
        console.log(`Values in Group: ${valuesInGroup}`);
        console.log(`Possibilities before logic: ${this.possibilities}`);

        for(const value of valuesInGroup) {
            if(!this.value){
                this.possibilities[value-1] = false;
            }
        }

        this.numberOfPossibilities = 0;
        for(let i=0; i<Grid.MAGIC_NUMBER; i++){
            if(this.possibilities[i]){
                this.numberOfPossibilities++;
            }
        }

        this.hideSubCells()
        this.updateCellDisplay()
        console.log(`Possibilities after logic: ${this.possibilities}`);
    }
}