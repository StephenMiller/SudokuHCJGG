const BACKGROUND_COLOR = 'lightgray';

class Cell {
    static activeCell = null;
    static MAX_VALUE = 9;

    constructor(row, column) {
        this.row = row;
        this.col = column;
        this.house = this.determineHouse(this.row, this.col);
        this.rowGroup = null;
        this.columnGroup = null;
        this.houseGroup = null;
        this.editable = true;
        this.inError = false;
        this.possibilities = Array(Cell.MAX_VALUE).fill(true);
        this.numberOfPossibilities = Cell.MAX_VALUE;
        this.display = new CellDisplay(this);
    }

    initializeCell(initialValue) {
        // Invocation for grid starting cells
        this.updateCellValue(initialValue);
        if (this.value !== null) {
            this.editable = false;
            this.display.element.style.backgroundColor = BACKGROUND_COLOR;
        }
    }

    updateCellValue(newValue) {
        /* Validate that newValue is numeric value between 1 and 9
            only when newValue is valid will it be applied
           Regex: ^ means anchor to start of string, 
                  [1-9] means any digit one through nine,
                  ? means 1 or more of the previous character,
                  $ means anchor to end of string
        */
        const isValidInput = /^[1-9]?$/.test(newValue); 
        if (isValidInput) {
            this.value = newValue;
            this.possibilities = Array(Game.MAGIC_NUMBER).fill(false);
            this.possibilities[this.value - 1] = true;
            console.log(`Cell value updated to: ${this.value}, publishing to rowUpdate${this.row}`);
            Game.eventBus.publish(`rowUpdate${this.row}`, this);
            console.log(`Cell value updated to: ${this.value}, publishing to columnUpdate${this.col}`);
            Game.eventBus.publish(`columnUpdate${this.col}`, this);
            console.log(`Cell value updated to: ${this.value}, publishing to houseUpdate${this.house}`);
            Game.eventBus.publish(`houseUpdate${this.house}`, this);
            this.rowGroup.update(this);
            this.columnGroup.update(this);
            this.houseGroup.update(this);
        } else {
            this.value = null;
            if(newValue !== 0)
                console.warn(`Invalid input received: ${newValue}`);
        }
        this.display.update();
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
                console.log(`Some clicked this cell: ${this.row}, ${this.col}`);
                //Set Game's active cell
                const activeCell = Game.activeGame.activeCell;
                Game.activeGame.activeCell = this;
                const printString = activeCell ? `${activeCell.row}, ${activeCell.col}` : 'null';
                console.log(`This was the active cell before the one just clicked: ${printString}`);
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
                this.removeOverlay();
                this.activeCell = null;
            }
        
        }
    }

    handleValueSelection(selectedValue) {
        this.updateCellValue(selectedValue);
        if (Game.selector) {
            Game.selector.removeOverlay();
        }
    }

    getValue() {
        return this.value;
    }
    
    
    // Called when a cell is changed,
    // To update a cells possiblities
    // from the values found in one of its three groups.
    updatePossibilities(valuesInGroup) {
        // RESET possibilities to FALSE
        //this.possibilities.fill(true);

        valuesInGroup.forEach(value => {
            // If this cell's value is NULL and the current iteration value is in the group...
            if (this.value == null) {
                // then set possibility to false, 
                // Index is one less than the displayed value (index = value - 1)
                this.possibilities[value - 1] = false;
            }
        });

        // COUNT possiblities
        this.numberOfPossibilities = this.possibilities.filter(possibility => possibility).length;

        // Trigger <DisplayUpdate> event
        this.display.update();
        //Game.eventBus.publish('possibilitiesUpdated', this);

        // After updating possibilities, check if there's only one possibility left
        this.display.highlight(this.numberOfPossibilities === 1);
    }
}

class CellDisplay {
    static MIN_VALUE = 1;
    static MAX_VALUE = 9;

    constructor(cell) {
        this.cell = cell;
        this.element = this.createDivElement();
        this.subGrid = this.createSubCells();
    }

    createDivElement() {
        const element = document.createElement('div');
        element.classList.add('sudoku-cell');
        element.addEventListener('click', () => this.cell.handleCellClick());
        return element;
    }

    update() {
        this.showSubCells(Game.hintsEnabled && !this.cell.value);
        if(this.cell.value) {
            this.element.textContent = this.cell.value;
            this.element.style.visibility = 'visible';
        }
    }
   
    createSubCells() {
        const subGrid = document.createElement('div');
        subGrid.classList.add('sub-grid');

        for (let i = CellDisplay.MIN_VALUE; i <= CellDisplay.MAX_VALUE; i++) {
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

    showSubCells(visible) {
        const subCells = this.subGrid.querySelectorAll('.sub-cell');
        
        if (visible) {
            this.cell.possibilities.forEach((possibility, index) => {
                // Update the visibility of the subcell that corresponds to this possibility
                const subCell = subCells[index];
                subCell.style.visibility = possibility ? 'visible' : 'hidden';
            });
        } else {
            this.cell.possibilities.forEach((possibility, index) => {
                // Update the visibility of the subcell that corresponds to this possibility
                const subCell = subCells[index];
                subCell.style.visibility = 'hidden';
            })
        }
    }
    
    highlight(highlight) {
        const subCells = this.subGrid.querySelectorAll('.sub-cell');
        if (highlight) {
            subCells.forEach((subCell, index) => {
                if (!subCell.classList.contains('single-cell-possibility')) {
                    subCell.classList.add('single-cell-possibility');
                }
            });
        } else {
            subCells.forEach((subCell, index) => {
                subCell.classList.remove('single-cell-possibility');
            });
        }
    }

    markSinglePossibility(value, shouldMark) {
        const subCells = this.subGrid.querySelectorAll('.sub-cell');
        subCells.forEach((subCell, index) => {
            if (index === value) {
                if (shouldMark && !subCell.classList.contains('single-cell-possibility')) {
                    subCell.classList.add('single-group-possibility');
                } else {
                    subCell.classList.remove('single-group-possibility');
                }
            }
        });
    }

    markRowPair(value, shouldMark) {
        const subCells = this.subGrid.querySelectorAll('.sub-cell');
        subCells.forEach((subCell, index) => {
            if (index === value) {
                if (shouldMark && !subCell.classList.contains('single-cell-possibility') && !subCell.classList.contains('single-group-possibility')) {
                    subCell.classList.add('row-pair');
                } else {
                    subCell.classList.remove('row-pair');
                }
            }
        });
    }

    markColumnPair(value, shouldMark) {
        const subCells = this.subGrid.querySelectorAll('.sub-cell');
        subCells.forEach((subCell, index) => {
            if (index === value) {
                if (shouldMark && !subCell.classList.contains('single-cell-possibility') && !subCell.classList.contains('single-group-possibility')) {
                    subCell.classList.add('column-pair');
                } else {
                    subCell.classList.remove('column-pair');
                }
            }
        });
    }

    markError() {
        this.element.classList.add('error');
    }
}
