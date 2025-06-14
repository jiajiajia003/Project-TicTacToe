function Cell() {
    let value = "";

    const takeSpot = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {takeSpot, getValue};
}

function Gameboard () {
    const rows = 3;
    const columns = 3;
    const board = [];

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    }
    
    const getBoard = () => board;

    const makeMove = (row, column, playerToken) => {
        const cell = board[row][column];
        cell.takeSpot(playerToken);
    }

    return {getBoard, makeMove, resetBoard};
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();
    let gameOver ;
    let activePlayer;
    let lastMessage;
    const players = [
        {name: playerOneName, token: "X"},
        {name: playerTwoName, token: "O"}
    ];

    const startNewGame = () => {
        board.resetBoard();
        gameOver = false;
        activePlayer = players[0];
        lastMessage = "";
    }
    
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;
    const getLastMessage = () => lastMessage;

    const playRound = (row, column) => {
        lastMessage = "";
        if (gameOver === true) {
            startNewGame();            
        }
        if (isMoveValid(row, column)) {
            board.makeMove(row, column, getActivePlayer().token);
            const curBoard = board.getBoard(); 
            if (isWinning(curBoard, row, column)) {
                lastMessage = `${getActivePlayer().name} wins!`;
                gameOver = true;
            } else if (isTie(curBoard)) {
                lastMessage = "Game Ties"
                gameOver = true;
            } else {
                switchPlayerTurn();
            }
        }
    }

    const isTie = (curBoard) => {
        for (let row of curBoard) {
            for (let cell of row) {
                if (cell.getValue() === "") {
                    return false;
                }
            }
        }
        return true;
    }

    const isWinning = (curBoard, row, column) => {
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
        return moveIsValid = board.getBoard()[row][column].getValue() === "" ? true : false;
    }

    startNewGame();

    return {
        getActivePlayer, 
        playRound, 
        getBoard: board.getBoard,
        getLastMessage,
        startNewGame
    }
}


function ScreenController () {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const messageDiv = document.querySelector(".message");
    const restartButtons = document.querySelectorAll(".restart");
    const popupDiv = document.querySelector(".popup");

    const showPopup = () => {
        popupDiv.style.display = "flex";
        messageDiv.textContent = game.getLastMessage();
    }

    const hidePopup = () => {
        popupDiv.style.display = "none";
        messageDiv.textContent = "";
    }

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
        
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

        if (game.getLastMessage().length) {
            showPopup();
        }
    }
    
    const resetScreen= () => {
        game.startNewGame();
        hidePopup();
        updateScreen();
    }

    const clickHandleBoard = (event) => {
        const selectedColumn = parseInt(event.target.dataset.column);
        const selectedRow = parseInt(event.target.dataset.row);
        
        if (isNaN(selectedColumn) || isNaN(selectedRow)) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener('click', clickHandleBoard);
    restartButtons.forEach(restartButton => {
        restartButton.addEventListener("click", resetScreen);
    })

    updateScreen();
}

ScreenController();
