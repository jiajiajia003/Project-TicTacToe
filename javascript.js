const gameController = () => {
    let board, activePlayer, gameOver;
    const playerOneName = prompt("Player one's Name", "Player one");
    const playerTwoName = prompt("Player two's Name", "Player two");
    const players = [
        {name: playerOneName, marker: "X"},
        {name: playerTwoName, marker: "O"}
    ];

    const resetBoard = () => {
        board = new Array(9).fill("");
        activePlayer = players[0];
        gameOver = false;
    }

    const makeMove = (index) => {
        if (board[index] !== "" || gameOver !== false) return;
        board[index] = activePlayer;
        
        isGameOver();
        if (gameOver === true) {
            return
        } else if (gameOver === "tie") {
            return
        }

        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const isGameOver = () => {
        if (
            (board[0] !=="" && board[0] === board[1] && board[1] === board[2]) || 
            (board[3] !=="" && board[3] === board[4] && board[4] === board[5]) || //[3,4,5]
            (board[6] !=="" && board[6] === board[7] && board[7] === board[8]) || //[6,7,8]
            (board[0] !=="" && board[0] === board[3] && board[3] === board[6]) || //[0,3,6]
            (board[1] !=="" && board[1] === board[4] && board[4] === board[7]) || //[1,4,7]
            (board[2] !=="" && board[2] === board[5] && board[5] === board[8]) || //[2,5,8]
            (board[0] !=="" && board[0] === board[4] && board[4] === board[8]) || //[0,4,8]
            (board[2] !=="" && board[2] === board[4] && board[4] === board[6]) //[2,4,6]
        ) {
            gameOver = true;
        } else if (!board.includes("")){
            gameOver = "tie";
        }
    }

    const getBoard = () => board;
    const getActivePlayer = () => activePlayer;
    const getResult = () => gameOver;

    resetBoard();

    return {getBoard, makeMove, resetBoard, getActivePlayer, getResult}
};

const screenController = () => {
    const game = gameController();
    const boardDiv = document.querySelector(".board");
    const statusDiv = document.querySelector(".status");
    const restartButton = document.querySelector(".restart")
    
    const render = () => {
        //Render game board
        boardDiv.textContent = "";
        const board = game.getBoard();
        board.forEach((cell, index) => {
            const cellDiv = document.createElement("button");
            cellDiv.classList.add("cell");
            cellDiv.dataset.index = index;
            cellDiv.textContent = cell.marker;
            boardDiv.appendChild(cellDiv);
        })

        // Render status
        const result = game.getResult();
        const activePlayer = game.getActivePlayer().name;
        if (result === true) {
            statusDiv.textContent = `${activePlayer} wins!`;
        } else if (result === "tie") {
            statusDiv.textContent = "It's a tie!";
        } else {
            statusDiv.textContent = `${activePlayer}'s turn`;
        }
    }
   
    boardDiv.addEventListener("click", (event) => {
        if (!event.target.classList.contains("cell")) return;
        const index = event.target.dataset.index;
        game.makeMove(index);
        render();
    })

    restartButton.addEventListener("click", () => {
        game.resetBoard();
        render();
    })
    
    render();
}

screenController();