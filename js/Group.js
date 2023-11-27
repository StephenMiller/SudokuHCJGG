class Group{

    static NUM_CELLS = 9

    constructor() {
        this.cells = [];
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
}