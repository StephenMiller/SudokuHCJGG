class Group{

    constructor(index, cells = []) {
        this.index = index;
        this.cells = cells;
        this.type = "Group";
        this.possibilities = Array(9).fill(true);
        this.numberOfPossiblities = Array(9).fill(9);
        this.eventName = ''; // to be overridden in subclasses
    }

    getCells() {
        return this.cells;
    }

    clear() {
        this.cells = [];
    }

    unsubscribe() {
        Game.eventBus.unSubscribe(this.eventName, this.update);
    }

    getValues() {
        let array = Array(0);
        for(const cell of this.cells){
            array.push(cell.value);
        }
        return array;
    }

    getLength() {
        return this.cells.length
    }

    ugroupUpdate(){

    }

    update(cell){
        console.log(`Update triggered by cell: ${cell.value}`);

        // Get the unique values in the group
        const valuesInGroup = this.getValues()
        .filter((value, index, self) => self.indexOf(value) === index);

        // Update the possibilities for each cell in the group
        this.cells.forEach(c => {
            if (c !== cell) { // Don't update the cell that triggered the update
                c.updatePossibilities(valuesInGroup);
            }
        });

        // Count the number of possibilities for each value over the whole group
        this.numberOfPossiblities = new Array(9).fill(0);
        this.cells.forEach(c => {
            c.possibilities.forEach((possibility, index) => {
                if (possibility) {
                    this.numberOfPossiblities[index]++;
                }
            });
        });

        // For every value that is unsolved but only has one possible cell in the group, mark that subcell
        this.numberOfPossiblities.forEach((count, value) => {
            if (count === 1) {
                this.cells.forEach(c => {
                    if (c.possibilities[value]) {
                        c.display.markSinglePossibility(value, true);
                    }
                });
            }
        });

        this.checkForPairsInSubGroups();
    }

    checkForPairsInSubGroups() {
        console.log(`Checking for pairs in ${this.type} ${this.index}`);
        // Define the sub-columns and sub-rows
        const subColumns = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
        const subRows = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
    
        // Check each value
        for (let value = 0; value < 9; value++) {
            // If there are exactly two possibilities for this value
            if (this.numberOfPossiblities[value] === 2) {
                console.log(`Found a pair for value ${value + 1}`);
                // Get the cells that have this value as a possibility
                const possibleCells = this.cells.filter(cell => cell.possibilities[value]);
    
                // Check if the two cells are in the same house
                if (possibleCells[0].house === possibleCells[1].house) {
                    // Check if the two cells are in the same sub-row or sub-column
                    const sameSubColumn = possibleCells[0].col == possibleCells[1].col;
                    const sameSubRow = possibleCells[0].row == possibleCells[1].row;
    
                    // If the two cells are in the same sub-row or sub-column, mark them
                    possibleCells.forEach(cell => cell.display.markRowPair(value,sameSubRow));
                    possibleCells.forEach(cell => cell.display.markColumnPair(value,sameSubColumn));

                }
            } else {
                const possibleCells = this.cells;
                possibleCells.forEach(cell => cell.display.markRowPair(value, false));
                possibleCells.forEach(cell => cell.display.markColumnPair(value, false));
            }
        }
    }

    unmarkPair(value) {
        console.log(`Unmarking pair for value ${value + 1}`);
        // Get the cells that have this value as a possibility
        const possibleCells = this.cells.filter(cell => cell.possibilities[value]);
    
        // If there is only one cell left with this value as a possibility, unmark it
        if (possibleCells.length === 1) {
            possibleCells[0].display.markPair(value, false);
        }
    }

    processGroupCellsUpdate(cell, groupCells) {
        const uniqueGroups = Array.from(new Set(groupCells));

        const valuesInGroup = uniqueGroups.map(cell => cell.getValue())
            .filter(value => value != null)
            .filter((value, index, self) => self.indexOf(value) == index);

        if(valuesInGroup.length > 0)
            uniqueGroups.forEach(cell => cell.updatePossibilities(valuesInGroup));
    }
}

class RowGroup extends Group{
    constructor(index, cells = []) {
        super(index, cells);
        console.log(`Createing a new row group with index: ${index}`);
        this.eventName = `rowUpdate${index}`;
        this.type = "Row";
        Game.eventBus.subscribe(this.eventName, cell => this.processGroupCellsUpdate(cell, cells));
    }
}

class ColumnGroup extends Group{
    constructor(index, cells = []) {
        super(index, cells);
        console.log(`Createing a new column group with index: ${index}`);
        this.eventName = `columnUpdate${index}`;
        this.type = "Column";
        Game.eventBus.subscribe(this.eventName, cell => this.processGroupCellsUpdate(cell, cells));
    }
}

class HouseGroup extends Group{
    constructor(index, cells = []) {
        super(index, cells);
        console.log(`Createing a new house group with index: ${index}`);
        this.eventName = `houseUpdate${index}`;
        this.type = "House";
        Game.eventBus.subscribe(this.eventName, cell => this.processGroupCellsUpdate(cell, cells));
    }
}