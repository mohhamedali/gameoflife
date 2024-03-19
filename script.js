document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.querySelector('.grid-container');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    let grid = [];
    let numRows = 50;
    let numCols = 50;
    let isRunning = false;
    let intervalId;

    // Create grid
    function createGrid() {
        for (let i = 0; i < numRows; i++) {
            grid[i] = [];
            for (let j = 0; j < numCols; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', toggleCellState);
                gridContainer.appendChild(cell);
                grid[i][j] = 0;
            }
        }
    }

    // Toggle cell state
    function toggleCellState() {
        const row = parseInt(this.dataset.row);
        const col = parseInt(this.dataset.col);
        if (!isRunning) {
            this.classList.toggle('alive');
            grid[row][col] = grid[row][col] ? 0 : 1;
        }
    }

    // Start simulation
    function startSimulation() {
        isRunning = true;
        startBtn.disabled = true;
        intervalId = setInterval(updateGrid, 100);
    }

    // Update grid based on rules
    function updateGrid() {
        let newGrid = [];
        for (let i = 0; i < numRows; i++) {
            newGrid[i] = [];
            for (let j = 0; j < numCols; j++) {
                const neighbors = countNeighbors(i, j);
                if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                    newGrid[i][j] = 0;
                } else if (grid[i][j] === 0 && neighbors === 3) {
                    newGrid[i][j] = 1;
                } else {
                    newGrid[i][j] = grid[i][j];
                }
            }
        }
        grid = newGrid;
        renderGrid();
    }

    // Count live neighbors of a cell
    function countNeighbors(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (!(i === 0 && j === 0)) {
                    const neighborRow = row + i;
                    const neighborCol = col + j;
                    if (neighborRow >= 0 && neighborRow < numRows && neighborCol >= 0 && neighborCol < numCols) {
                        count += grid[neighborRow][neighborCol];
                    }
                }
            }
        }
        return count;
    }

    // Render grid
    function renderGrid() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            if (grid[row][col] === 1) {
                cell.classList.add('alive');
            } else {
                cell.classList.remove('alive');
            }
        });
    }

    // Reset grid
    function resetGrid() {
        clearInterval(intervalId);
        isRunning = false;
        startBtn.disabled = false;
        grid = grid.map(row => row.fill(0));
        renderGrid();
    }

    // Initialize grid
    createGrid();

    // Event listeners
    startBtn.addEventListener('click', startSimulation);
    resetBtn.addEventListener('click', resetGrid);
});
