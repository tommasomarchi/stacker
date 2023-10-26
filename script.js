const grid = document.querySelector('.grid');
const stackButton = document.querySelector('.stack');
const scoreCounter = document.querySelector('.score-counter');

const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again');

// 0 - cella vuota
// 1 - barra
const gridMatrix = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0],
];

let currentRowIndex = gridMatrix.length - 1;
let barDirection = 'right';
let barSize = 3;
let isGameOver = false;
let score = 0;
let t;

function draw() {
    grid.innerHTML = '';
    gridMatrix.forEach(function (rowContent, rowIndex) {
        rowContent.forEach(function (cellContent, cellIndex) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            const isRowEven = rowIndex % 2 == 0;
            const isCellEven = cellIndex % 2 == 0;
            if ((isCellEven && isRowEven) || (!isCellEven && !isRowEven)) {
                cell.classList.add('cell-dark');
            }
            if (cellContent == 1) {
                cell.classList.add('bar');
            }
            grid.appendChild(cell);
        });
    });
}

function moveRight(row) {
    row.pop();
    row.unshift(0);
}

function moveLeft(row) {
    row.shift();
    row.push(0);
}

function isRightEdge(row) {
    const lastElement = row[row.length - 1];
    return lastElement === 1;
}

function isLeftEdge(row) {
    const firstElement = row[0];
    return firstElement === 1;
}

function moveBar() {
    const row = gridMatrix[currentRowIndex];
    if (barDirection === 'right') {
        moveRight(row);
        if (isRightEdge(row)) {
            barDirection = 'left';
        }
    } else if (barDirection === 'left') {
        moveLeft(row);
        if (isLeftEdge(row)) {
            barDirection = 'right';
        }
    }
}

function checkLost() {
    const currentRow = gridMatrix[currentRowIndex];
    const prevRow = gridMatrix[currentRowIndex + 1];

    if (!prevRow) return;

    for (let i = 0; i < currentRow.length; i++) {
        if (currentRow[i] === 1 && prevRow[i] === 0) {
            currentRow[i] = 0;
            barSize--;
            if (barSize === 0) {
                isGameOver = true;
                clearInterval(t);
                endGame(false);
            }
        }
    }
}

function checkWin() {
    if (currentRowIndex === 0) {
        isGameOver = true;
        clearInterval(t);
        endGame(true);
    }
}

function onStack() {
    checkLost();
    checkWin();

    if (isGameOver) return;

    updateScore();

    // change row
    currentRowIndex--;
    barDirection = 'right';
    for (let i = 0; i < barSize; i++) {
        gridMatrix[currentRowIndex][i] = 1;
    }
    draw();

}

function updateScore() {
    score++;
    scoreCounter.innerHTML = score.toString().padStart(5, '0');
    // const finalBlocks = document.querySelectorAll('.bar');
    // scoreCounter.innerHTML = finalBlocks.length.toString().padStart(5, '0');
}

function endGame(isVicotry) {
    if (isVicotry) {
        endGameText.innerHTML = 'YOU\nWON';
        endGameScreen.classList.add('win');
    }
    endGameScreen.classList.remove('hidden');
}

function onPlayAgain () {
    location.reload();
  }

function main() {
    moveBar();
    draw();
}
stackButton.addEventListener('click', onStack);
playAgainButton.addEventListener('click', function () {
    location.reload();
});

draw();

t = setInterval(main, 600);