const gridElement = document.getElementById("grid");

const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

const rowsSlider = document.getElementById("rowsSlider");
const columnsSlider = document.getElementById("columnsSlider");
const speedSlider = document.getElementById("speedSlider");

rowsSlider.addEventListener("input", () => {
  const newRows = parseInt(rowsSlider.value);
  const newColumns = parseInt(columnsSlider.value);
  if (newRows > 0 && newColumns > 0) {
    initBoard(newRows, newColumns);
  }
});

columnsSlider.addEventListener("input", () => {
  const newRows = parseInt(rowsSlider.value);
  const newColumns = parseInt(columnsSlider.value);
  if (newRows > 0 && newColumns > 0) {
    initBoard(newRows, newColumns);
  }
});

speedSlider.addEventListener("input", () => {
  document.getElementById("speedLabel").textContent = `${speedSlider.value} ms`;
  simulationSpeed = parseInt(speedSlider.value);
});

let arr = [];
let simulationSpeed = 200;

function drawGrid(arr) {
  for (let i = 0; i < arr.length; i++) {
    const newRow = document.createElement("div");
    newRow.classList.add("row");
    for (let j = 0; j < arr[i].length; j++) {
      const newCell = document.createElement("div");
      newCell.classList.add("cell");
      if (arr[i][j] == 1) {
        newCell.classList.add("alive");
      } else {
        newCell.classList.add("dead");
      }

      newCell.addEventListener("click", () => {
        toggleCellState(newCell, i, j);
      });

      newRow.appendChild(newCell);
    }
    gridElement.appendChild(newRow);
  }
}

function toggleCellState(cell, i, j) {
  arr[i][j] = 1 - arr[i][j];
  if (cell.classList.contains("alive")) {
    cell.classList.remove("alive");
    cell.classList.add("dead");
  } else {
    cell.classList.remove("dead");
    cell.classList.add("alive");
  }
}

function initArray(rows, columns) {
  return Array(rows)
    .fill()
    .map(() => Array(columns).fill(0));
}

function countNeighbors(arr, x, y) {
  let neighbors = 0;
  for (let i = Math.max(x - 1, 0); i < Math.min(x + 2, arr.length); i++) {
    for (let j = Math.max(y - 1, 0); j < Math.min(y + 2, arr[i].length); j++) {
      if (i !== x || j !== y) {
        // Exclude the cell itself
        if (arr[i][j] === 1) {
          neighbors++;
        }
      }
    }
  }
  return neighbors;
}

let intervalId;

function startGameOfLife(arr) {
  if (!intervalId) {
    intervalId = setInterval(() => updateGrid(arr), simulationSpeed);
    startButton.textContent = "Stop";
  } else {
    clearInterval(intervalId);
    intervalId = null;
    startButton.textContent = "Start";
  }
}

function updateGrid(arr) {
  const arrCopy = JSON.parse(JSON.stringify(arr));

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      const neighbors = countNeighbors(arr, i, j);
      if (
        (arr[i][j] == 1 && neighbors < 2) ||
        (arr[i][j] == 1 && neighbors > 3)
      ) {
        arrCopy[i][j] = 0;
      } else if (arr[i][j] == 0 && neighbors == 3) {
        arrCopy[i][j] = 1;
      }
    }
  }

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = arrCopy[i][j]; // Update the original arr
    }
  }

  gridElement.innerHTML = ""; // Clear the grid
  drawGrid(arr); // Redraw the updated grid
}

function initBoard(rows, columns, isInitialLoad = false) {
  startButton.textContent = "Start";

  arr = initArray(rows, columns);

  if (isInitialLoad) {
    // Add a plus sign in the middle of the grid on initial load
    const midRow = Math.floor(rows / 2);
    const midCol = Math.floor(columns / 2);
    for (let i = -1; i <= 1; i++) {
      arr[midRow + i][midCol] = 1;
      arr[midRow][midCol + i] = 1;
    }
  }

  gridElement.innerHTML = "";
  clearInterval(intervalId);
  drawGrid(arr);
}

startButton.addEventListener("click", () => startGameOfLife(arr));
resetButton.addEventListener("click", () => initBoard(15, 20));

initBoard(15, 21, true);
