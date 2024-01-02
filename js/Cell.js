const BACKGROUND_COLOR = 'lightgray';

class Cell {
    static activeCell = null;

    constructor(row, column, grid) {
        // Positional Identity
        this.row = row;
        this.col = column;
        this.house = this.determineHouse(this.row, this.col);

        // Group Contexts
        this.rowGroup = null;
        this.columnGroup = null;
        this.houseGroup = null;

        // Base Attributes
        this.editable = true;
        this.inError = false;
        this.possibilities = Array(Grid.SIZE).fill(true);
        this.numberOfPossibilities = Grid.SIZE;

        // Logical Attributes
        this.value = 0;
        this.solved = false;
        this.singlePossibility = false;
        this.singleGroupPossibility = Array(Grid.SIZE).fill(false);
        this.partOfRowPair = Array(Grid.SIZE).fill(false);
        this.partOfColumnPair = Array(Grid.SIZE).fill(false);
        this.partOfHousePair = Array(Grid.SIZE).fill(false);
        this.partOfDoublePair = Array(Grid.SIZE).fill(false);
        this.pairPartner = Array(Grid.SIZE).fill(null);
        this.inError = false;

        // Display/GUI Mechanics
        this.display = new CellDisplay(this, grid);
    }

    initializeCell(initialValue) {
        console.log(`Initializing Cell: (${this.row}, ${this.col}) with value: ${initialValue}`);
        // Invocation for grid starting cells        
        if (initialValue.value !== null && initialValue !== 0) {
            this.editable = false;
            this.display.element.style.backgroundColor = BACKGROUND_COLOR;
            this.updateCellValue(initialValue);
        }
    }

    updateCellValue(newValue) {
        // Invocation for user input
        const isValidInput = /^[0-9]?$/.test(newValue); 
        if (isValidInput) {
            this.value = newValue;
            this.solved = (this.value != 0);
            if(this.value !== 0) {
                this.possibilities = Array(Grid.SIZE).fill(false);
                this.possibilities[newValue - 1] = true;
            } else {
                this.possibilities = Array(Grid.SIZE).fill(false);
                const values = this.rowGroup.getValues().concat(this.columnGroup.getValues(), this.houseGroup.getValues());
                this.updateLogic(this.rowGroup.getValues().concat(this.columnGroup.getValues(), this.houseGroup.getValues()));
            }
            
            this.display.update();
            Game.eventBus.publish(`houseUpdate${this.house}`, this);
            Game.eventBus.publish(`rowUpdate${this.row}`, this);
            Game.eventBus.publish(`columnUpdate${this.col}`, this);
        } else {
            console.warn(`Invalid input received: ${newValue}`);
        }
        this.display.update();
    }

    // Called when a cell is changed,
    // To update a cells possiblities
    // from the values found in one of its three groups.
    updateLogic(valuesInGroup) {
        valuesInGroup.forEach(value => {
            // If this cell's value is NULL and the current iteration value is in the group...
            if (this.value == 0) {
                // then set possibility to false, 
                // Index is one less than the displayed value (index = value - 1)
                const index = value - 1;
                this.possibilities[index] = false;
                if( this.partOfRowPair[index] || this.partOfColumnPair[index] || this.partOfHousePair[index]) {
                    //Notify pair partner that this cell is no longer a possibility
                    this.pairPartner[index].pairUpdate(index);
                }
            }
        });

        // COUNT possiblities
        this.numberOfPossibilities = this.possibilities.filter(possibility => possibility).length;

        // CHECK if solved
        this.singlePossibility = (this.numberOfPossibilities === 1);

        // UPDATE display
        this.display.update();
    }

    pairUpdate(index) {
        console.log(`Updating Pair in Cell: (${this.row}, ${this.col}) with index: ${index}`);
        console.log(`Pair Update: ${this.partOfRowPair[index]}, ${this.partOfColumnPair[index]}, ${this.partOfHousePair[index]}`);
        if (this.partOfRowPair[index] || this.partOfColumnPair[index] || this.partOfHousePair[index]) {
            console.log(`Pair Update: ${this}, ${this.pairPartner[index]}, and ${this.pairPartner[index].singleGroupPossibility[index]}`);
            this.pairPartner[index].singleGroupPossibility = Array(Grid.SIZE).fill(false);
            this.pairPartner[index].singleGroupPossibility[index] = true;
            this.pairPartner[index].partOfRowPair = Array(Grid.SIZE).fill(false);
            this.pairPartner[index].partOfColumnPair = Array(Grid.SIZE).fill(false);
            this.pairPartner[index].partOfHousePair = Array(Grid.SIZE).fill(false);
            this.pairPartner[index].partOfDoublePair = Array(Grid.SIZE).fill(false);
            this.pairPartner[index].pairPartner[index] = null;
            console.log(`Pair Update: ${this}, ${this.pairPartner[index]}, and ${this.pairPartner[index].singleGroupPossibility[index]}`);
        }
        this.display.updateCell(this.pairPartner[index]);
    }

    setGroups(rowGroup,columnGroup,houseGroup) {
        this.rowGroup = rowGroup;
        this.columnGroup = columnGroup;
        this.houseGroup = houseGroup;
    }

    determineHouse(row, col) {
        const houseRow = Math.floor(row / 3);
        const houseCol = Math.floor(col / 3);
        return houseRow * 3 + houseCol;
    }
  
    handleCellClick() {
        if (Game.activeGame) {
            if (this.editable) {
                // Play beep sound
                const beep = new Audio('beep.mp3'); // replace 'beep.mp3' with the path to your beep sound file
                beep.play();

                // Add glow animation
                this.display.addGlow();
                
                // Remove glow animation after 1 second and add yellow frame
                setTimeout(() => {
                    this.display.removeGlow();
                    this.display.addFrame();
                }, 1000);

                console.log(`*-- Some clicked this cell: ${this.row}, ${this.col}`);
                //Set Game's active cell
                const activeCell = Game.activeGame.activeCell;
                if (activeCell && activeCell !== this) {
                    activeCell.display.removeFrame(); // Remove the border from the previously active cell
                    Game.selector.removeOverlay();
                }
                Game.activeGame.activeCell = this;
                const printString = activeCell ? `${activeCell.row}, ${activeCell.col}` : 'null';
                console.log(`This previous active cell was: ${printString}`);
                // Remove the overlay of the previously clicked cell
                if (activeCell && activeCell !== this) {
                    Game.selector.removeOverlay();
                }
        
                // Create the overlay
                const overlay = Game.selector.createOverlay(this);
                document.body.appendChild(overlay);
        
                // Position the overlay with the corner in the middle of the cell
                const rect = this.display.element.getBoundingClientRect();
                const cellSize = this.display.element.offsetWidth;
                const halfCellSize = (1/2) * cellSize;
                overlay.style.width = `${ 2.05 * cellSize }px`;
                overlay.style.top = `${rect.bottom - halfCellSize }px`;
                overlay.style.left = `${rect.left + halfCellSize}px`;
    
                // Set the active cell clicked cell
                this.activeCell = this;
            } else {
                Game.selector.removeOverlay();
                this.activeCell = null;
            }
        }
    }

    handleValueSelection(selectedValue) {
        if( selectedValue === 10) {
            selectedValue = 0;
        }
        console.log(`Value selected: ${selectedValue}`);
        this.updateCellValue(selectedValue);
        if (Game.selector) {
            Game.selector.removeOverlay();
        }
    }
}

class CellDisplay {
    static MIN_VALUE = 1;

    constructor(cell, grid) {
        this.cell = cell;
        this.element = this.createDivElement();
        this.valueElement = this.createValueElement();
        this.subGrid = this.createSubCells();
        this.element.appendChild(this.valueElement);
        this.element.appendChild(this.subGrid);
        grid.sudokuGridElement.appendChild(this.element);
    }

    createDivElement() {
        const element = document.createElement('div');
        element.classList.add('sudoku-cell');
        element.addEventListener('click', () => this.cell.handleCellClick());
        return element;
    }

    createValueElement() {
        const valueElement = document.createElement('div');
        valueElement.classList.add('cell-value');
        return valueElement;
    }

    update() {
        this.updateCell(this.cell);
    }

    updateCell(cell) {
        // When starting to check logic
        this.startCheckingLogic();
        
        if(cell.value) {
            this.valueElement.textContent = cell.value;
            const subCells = this.subGrid.querySelectorAll('.sub-cell');
            subCells.forEach(subCell => this.showSubCells(false, subCell));
        } else {
            this.valueElement.textContent = '';
            const subCells = this.subGrid.querySelectorAll('.sub-cell');
            subCells.forEach((subCell, index) => {
                this.showSubCells(Game.hintsEnabled && this.cell.possibilities[index], subCell);
                this.highlight(cell.singlePossibility, subCell);
                this.markSingleGroupPossibility(
                    cell.singleGroupPossibility[index] && !cell.singlePossibility,
                    subCell
                );

                this.markRowPair(
                    cell.partOfRowPair[index] && !this.cell.singlePossibility && !this.cell.singleGroupPossibility[index], 
                    subCell);
            

                this.markColumnPair(
                    cell.partOfColumnPair[index] && !this.cell.singlePossibility && !this.cell.singleGroupPossibility[index], 
                    subCell);
       

                this.markHousePair(
                    cell.partOfHousePair[index] && !this.cell.singlePossibility && !this.cell.singleGroupPossibility[index], 
                    subCell);

                this.markRowAndColumnPair(
                    cell.partOfRowPair[index] && cell.partOfColumnPair[index] && !this.cell.singlePossibility && !this.cell.singleGroupPossibility[index], 
                    subCell);
            });       
        }

        // When done checking logic
        this.stopCheckingLogic();
    }

    startCheckingLogic() {
        this.element.classList.add('cell-checking-logic');
    }

    stopCheckingLogic() {
        this.element.classList.remove('cell-checking-logic');
    }
   
    createSubCells() {
        const subGrid = document.createElement('div');
        subGrid.classList.add('sub-grid');

        for (let i = CellDisplay.MIN_VALUE; i <= Grid.SIZE; i++) {
            const subCell = document.createElement('div');
            subCell.classList.add('sub-cell');
            
            const numberSpan = document.createElement('span');
            numberSpan.textContent = this.cell.possibilities[i - 1] ? i : '';

            subCell.appendChild(numberSpan);
            subGrid.appendChild(subCell);
        }

        this.element.appendChild(subGrid);
        return(subGrid);
    }

    showSubCells(visible, subCell) {        
        if (visible) {
            subCell.style.visibility = 'visible';
        } else {
            subCell.style.visibility = 'hidden';
        }
    }
    
    highlight(highlight, subCell) {
        if (highlight) {
            if (!subCell.classList.contains('single-cell-possibility'))
                subCell.classList.add('single-cell-possibility');            
        } else {
            subCell.classList.remove('single-cell-possibility');
        }
    }

    markSingleGroupPossibility(shouldMark, subCell) {
        if (shouldMark) {
            subCell.classList.add('single-group-possibility');
            subCell.classList.remove('row-pair');
            subCell.classList.remove('column-pair');
            subCell.classList.remove('house-pair');
        } else {
            subCell.classList.remove('single-group-possibility');
        }           
    }

    markRowPair(shouldMark, subCell) {
        if (shouldMark) {
            subCell.classList.add('row-pair');
        } else {
            subCell.classList.remove('row-pair');
        }
    }
    

    markColumnPair(shouldMark, subCell) {
        if (shouldMark && !this.cell.singlePossibility) {
            subCell.classList.add('column-pair');
        } else {
            subCell.classList.remove('column-pair');
        }
    }

    markHousePair(shouldMark, subCell) {     
        if (shouldMark) {
            subCell.classList.add('house-pair');
        } else {
            subCell.classList.remove('house-pair');
        }
    }

    markRowAndColumnPair(shouldMark, subCell) {
        if (shouldMark) {
            subCell.classList.add('row-column-pair');
        } else {
            subCell.classList.remove('row-column-pair');
        }
    }

    markError() {
        this.element.classList.add('error');
    }

    addGlow() {
        this.element.classList.add('cell-glow');
    }

    removeGlow() {
        this.element.classList.remove('cell-glow');
    }

    addFrame() {
        this.element.classList.add('cell-frame');
    }   

    removeFrame() {
        this.element.classList.remove('cell-frame');
    }   
}
