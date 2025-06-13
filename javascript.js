function Cell() {
    let value = 0;

    const resetCell = () => {
        value = 0;
    }

    const takeSpot = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {takeSpot, getValue, resetCell};
}

function Gameboard () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j].resetCell();
            }
        }
    }
    
    const getBoard = () => board;

    const makeMove = (row, column, player) => {
        const cell = board[row][column];
        cell.takeSpot(player);
    }

    return {getBoard, makeMove, resetBoard};
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();

    const players = [
        {name: playerOneName, token: 1},
        {name: playerTwoName, token: 2}
    ];

    let gameOver = false;
    let activePlayer = players[0];
    let lastMessage= "";

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;
    const getLastMessage = () => lastMessage;

    const playRound = (row, column) => {
        if (gameOver === true) {
            board.resetBoard();
            gameOver = false;
            activePlayer = players[0];
        }
        if (isMoveValid(row, column)) {
            board.makeMove(row, column, getActivePlayer().token);

            if (isWinning(row, column)) {
                lastMessage = `${getActivePlayer().name} wins!`;
                gameOver = true;
            } else {
                switchPlayerTurn();
                lastMessage = `${getActivePlayer().name} takes spot on row ${row}, column ${column}.`;
            }
        } else {
            lastMessage = "Spot is taken. Try again!";
        }
    }

    const isWinning = (row, column) => {
        const curBoard = board.getBoard();
        const winByRow = isThree(curBoard[row][0], curBoard[row][1], curBoard[row][2]);
        const winByColumn = isThree(curBoard[0][column], curBoard[1][column], curBoard[2][column]);
        let winByDiagonal1 = false;
        let winByDiagonal2 = false;

        if (row === column) {
            winByDiagonal1 = isThree(curBoard[0][0], curBoard[1][1], curBoard[2][2]);
        }
        if (row + column === 2) {
            winByDiagonal2 = isThree(curBoard[0][2], curBoard[1][1], curBoard[2][0]);
        }

        return winByRow || winByColumn || winByDiagonal1 || winByDiagonal2;
    }

    const isThree = (cell1, cell2, cell3) => {
        let result;
        return result = (cell1.getValue() === cell2.getValue() && cell1.getValue() === cell3.getValue()) ? true : false;
    }

    const isMoveValid = (row, column) => {
        let moveIsValid;
        return moveIsValid = board.getBoard()[row][column].getValue() === 0 ? true : false;
    }

    return {
        getActivePlayer, 
        playRound, 
        getBoard: board.getBoard,
        getLastMessage
    }
}


function ScreenController () {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const messageDiv = document.querySelector(".message");
    const resetButton = document.querySelector(".reset")

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
        messageDiv.textContent = game.getLastMessage();
        
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add(`cell`);
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    

    const clickHandleBoard = (event) => {
        const selectedColumn = parseInt(event.target.dataset.column);
        const selectedRow = parseInt(event.target.dataset.row);
        
        if (isNaN(selectedColumn) || isNaN(selectedRow)) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener('click', clickHandleBoard);

    updateScreen();
}

ScreenController();
