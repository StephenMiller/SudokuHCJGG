// Add a function to handle grid selection
function selectGrid(gridIndex) {
    const selectedGrid = Cell.selectStartingGrid(gridIndex)
    clearBoard()
    initializeBoard(selectedGrid)
}

// Add a function to clear the board
function clearBoard() {
    // Logic to clear the board (reset cells)
    // For each cell in your grid, set value to null, editable to true, and remove the gray background
}

function initializeBoard(selectedGrid) {
    // Assuming you have a 9x9 Sudoku board represented as an array of arrays

    // Initialize the board with empty cells
    const board = Array.from({ length: 9 }, () => Array(9).fill(null))
    const myNode = document.getElementById('sudoku-grid')
    myNode.innerHTML=''

    // Iterate through each character in the selected grid and fill the board
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const index = row * 9 + col
            const value = parseInt(selectedGrid[index], 10)

            // Set the value of the cell
            board[row][col] = value

            // Create a new cell and initialize it with the value from the starting grid
            const cell = new Cell(row, col, value);
            document.getElementById('sudoku-grid').appendChild(cell.element)
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Render the Sudoku grid
    initializeBoard(0)  
});

