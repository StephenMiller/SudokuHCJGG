class Group{

    constructor(index, cells = []) {
        this.index = index;
        this.cells = cells;
        this.type = "Group";
        this.possibilities = Array(Grid.SIZE).fill(true);
        this.numberOfPossiblities = Array(Grid.SIZE).fill(Grid.SIZE);
        this.eventName = ''; // to be overridden in subclasses
        this.hasRowPair = Array(Grid.SIZE).fill(false);
        this.hasColumnPair = Array(Grid.SIZE).fill(false);
        this.hasHousePair = Array(Grid.SIZE).fill(false);
    }

    getCells() {
        return this.cells;
    }

    clear() {
        this.cells = [];
    }

    getValues() {
        let array = Array(0);
        for(const cell of this.cells){
            if(cell.value)
                array.push(cell.value);
        }
        return array;
    }

    getLength() {
        return this.cells.length
    }

    checkForPairsInSubGroups() {    
        const setPair = (cell1, cell2, index, pairProperty, hasPairProperty) => {
            cell1[pairProperty][index] = true;
            cell2[pairProperty][index] = true;
            this[hasPairProperty][index] = true;
        };

        // Keep track of pairs that have been found
        const pairs = [];

        for (let index = 0; index < Grid.SIZE; index++) {
            if (this.hasRowPair[index] || this.hasColumnPair[index] || this.hasHousePair[index]) continue;

            if (this.numberOfPossiblities[index] === 2) {
                const possibleCells = this.cells.filter(cell => cell.possibilities[index]);

                if (possibleCells.length !== 2) {
                    console.error(`Expected 2 possible cells, but got ${possibleCells.length}`);
                    continue;
                }

                const [cell1, cell2] = possibleCells;

                if (cell1.house === cell2.house) {
                    cell1.pairPartner[index] = cell2;
                    cell2.pairPartner[index] = cell1;

                    if (cell1.col === cell2.col) {
                        setPair(cell1, cell2, index, 'partOfColumnPair', 'hasColumnPair');
                    }

                    if (cell1.row === cell2.row) {
                        setPair(cell1, cell2, index, 'partOfRowPair', 'hasRowPair');
                    }

                    if (cell1.row !== cell2.row && cell1.col !== cell2.col) {
                        setPair(cell1, cell2, index, 'partOfHousePair', 'hasHousePair');
                    }

                    // Add the pair to the pairs array
                    pairs.push({ cell1, cell2 });
                }
            }
        }

        // Check for double pairs
        for (let i = 0; i < pairs.length; i++) {
            for (let j = i + 1; j < pairs.length; j++) {
                if (pairs[i].cell1 === pairs[j].cell1 && pairs[i].cell2 === pairs[j].cell2) {
                    console.log(`Double pair found at cells ${pairs[i].cell1.index} and ${pairs[i].cell2.index}`);
                }
            }
        }
    }

    applyPairConsequences() {
        for(let index = 0; index < Grid.SIZE; index++) {
            if(this.hasRowPair[index] && this.type == "Row") {
                console.log(`There is a pair for value ${index + 1} in this row`);
                this.cells.forEach( cell => {
                    if(!cell.partOfRowPair[index])
                        cell.possibilities[index] = false;
                });
            }

            if(this.hasColumnPair[index] && this.type == "Column"){
                console.log(`There is a pair for value ${index + 1} in this column`);
                this.cells.forEach( cell => {   
                    if(!cell.partOfColumnPair[index])
                        cell.possibilities[index] = false;
                });
            }                
        }
    }

    updateLogic() {
        this.baseLogic();

        if(this.type == "House")
            this.checkForPairsInSubGroups();

        //this.applyPairConsequences();

        this.interactiveGroups.forEach( group => {
            group.baseLogic();
            group.checkForPairsInSubGroups();
            group.applyPairConsequences();
        });
    }

    baseLogic() {
        console.log(`Updating ${this.type} ${this.index}`);

        // Get the unique values in the group
        const valuesInGroup = this.getValues()
            .filter((value, index, self) => self.indexOf(value) == index);

        // Update the possibilities for each cell in the group
        this.cells.forEach( c => { c.updateLogic(valuesInGroup); } );

        // Count the number of possibilities for each value over the whole group
        this.numberOfPossiblities = new Array(Grid.SIZE).fill(0);
        this.cells.forEach(c => {
            c.possibilities.forEach((possibility, index) => {
                if(possibility) { this.numberOfPossiblities[index]++; }
            });
        });

        // For every value that is unsolved but only has one possible cell in the group,
        // mark that subcell as the only possible cell for that value
        this.numberOfPossiblities.forEach((count, index) => {
            if (count === 1) {
                this.cells.forEach(c => {
                    if (c.possibilities[index] && !c.solved) {
                        c.singleGroupPossibility[index] = true;
                    }
                });
            }
        });
    }
}

class RowGroup extends Group{
    constructor(index, cells = []) {
        super(index, cells);
        this.eventName = `rowUpdate${index}`;
        this.type = "Row";
        this.interactiveGroups = [];
        Game.eventBus.subscribe( this.eventName, cell => this.updateLogic(cell) );
    }

    setGroups(houseGroups) {
        this.interactiveGroups = houseGroups.filter( house => house.index >= Math.floor(this.index / 3) * 3 && house.index < Math.floor(this.index / 3) * 3 + 3 && house.index != this.index );    }
}

class ColumnGroup extends Group{
    constructor(index, cells = []) {
        super(index, cells);
        this.eventName = `columnUpdate${index}`;
        this.type = "Column";
        this.interactiveGroups = [];
        Game.eventBus.subscribe(this.eventName, cell => this.updateLogic(cell));
    }

    setGroups(houseGroups) {
        this.interactiveGroups = houseGroups.filter( house => house.index % 3 == this.index % 3 && house.index != this.index);
    }
}

class HouseGroup extends Group{
    constructor(index, cells = []) {
        super(index, cells);
        this.eventName = `houseUpdate${index}`;
        this.type = "House";
        this.interactiveGroups = [];
        Game.eventBus.subscribe( this.eventName, cell => this.updateLogic(cell) );
    }

    setGroups(rowGroups, columnGroups) {
        const verticalSection = Math.floor(this.index / 3) * 3;
        const horizontalSection = this.index % 3 * 3;

        this.interactiveGroups = rowGroups.filter(row => row.index >= verticalSection && row.index < verticalSection + 3)
            .concat(columnGroups.filter(column => column.index >= horizontalSection && column.index < horizontalSection + 3));
    }
}