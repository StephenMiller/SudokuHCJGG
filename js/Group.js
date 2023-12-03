class Group{

    constructor() {
        this.cells = [];
        eventBus.subscribe('possibilitiesUpdated', updatedCell => this.updatePossibilities(updatedCell));
    }

    addCell(cell) {
        this.cells.push(cell);
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
            array.push(cell.value);
        }
        return array;
    }

    getLength() {
        return this.cells.length
    }

    updatePossibilities(updatedCell) {
        const possibilitiesCount = Array(Grid.MAGIC_NUMBER).fill(0);

        for (let value = 1; value <= Grid.MAGIC_NUMBER; value++) {
            this.cells.forEach(cell => {
                if (cell.possibilities[value - 1]) {
                    possibilitiesCount[value - 1]++;
                }
            });
        }

        this.cells.forEach(cell => {
            for (let value = 1; value <= Grid.MAGIC_NUMBER; value++) {
                if (cell.possibilities[value - 1]) {
                    if (possibilitiesCount[value - 1] === 1) {
                        cell.markSinglePossibility(value);
                    } else {
                        cell.removeSinglePossibilityMark();
                    }
                }
            }
        });
    }
}