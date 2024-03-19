let gameOver = false;

const Board = () => {
    const BOARD_SIZE = 9;
    let board = Array(BOARD_SIZE).fill('');

    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    function getBoard(){
        return board
    }

    function displayBoard(){
        const divider = "\n-----------\n";
        const rows = board.reduce((acc, cell, index) => {
            const separator = index % 3 === 0 && index !== 0 ? divider : "";
            return acc + separator + (cell || " ") + (index % 3 === 2 ? "" : " | ");
        }, "");
        console.log(rows);
    }

    function displayMove(index, currentPlayer){
        if(index >= 0 && index < 9 && board[index] === ''){
            board[index] = currentPlayer.mark
            return true
        }
    
        return false
    }

    function checkTie(){
        return board.every(cell => cell !== '');
    }

    function checkWin(currentPlayer){
        
        for(let combination of winCombinations){
            const [i, j, k] = combination
            
            if (board[i] !== '' && board[i] === board[j] && board[i] === board[k]) {
                gameOver = true;
                console.log(`Player ${currentPlayer.name} (${currentPlayer.mark}) wins!\nCongratulations`)
                alert(`Player ${currentPlayer.name} (${currentPlayer.mark}) wins!\nCongratulations`)
                return;
            }

            if(checkTie()){
                gameOver = true;
                console.log("TIE")
                alert("TIE")
                return;
            }
        }
    }

    return { displayBoard, displayMove, checkTie, checkWin, getBoard }
}

const Players = (() => {
    let players = [];
    let currentPlayerIndex = 0;

    function createPlayer(playerName, playerMark) {
        return {
            name: playerName,
            mark: playerMark
        };
    }

    // Function to create players
    function createPlayers() {
        for (let i = 0; i < 2; i++) {
            const playerName = prompt(`Enter player ${i + 1} name`);
            const playerMark = i === 0 ? prompt(`Enter mark for Player ${playerName} (X or O)`).toUpperCase() : players[0].mark === 'X' ? 'O' : 'X';
            players.push(createPlayer(playerName, playerMark));
        }
        currentPlayerIndex = players[1].mark === 'X' ? 1 : 0;
        return players;
    }

    // Function to switch the current player
    function switchPlayer() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        return players[currentPlayerIndex];
    }

    // Function to get the current player
    function getCurrentPlayer() {
        return players[currentPlayerIndex];
    }

    return { createPlayers, switchPlayer, getCurrentPlayer };
})();

const Game = (() => {
    function start(){
        const gameBoard = Board();
        const [ player1, player2 ] = Players.createPlayers();
    
        let currentPlayer = Players.getCurrentPlayer()
    
        console.log("Player 1 name:", player1.name)
        console.log("Player 2 name:", player2.name)
        gameBoard.displayBoard()
        console.log("Current player name:", currentPlayer.name)
    
        while(!gameOver){
            const move = parseInt(prompt(`Enter cell you want to put ${currentPlayer.mark}
            [1 2 3]
            [4 5 6]
            [7 8 9]
            ${gameBoard.getBoard()[0]} | ${gameBoard.getBoard()[1]} | ${gameBoard.getBoard()[2]}
            -----------
            ${gameBoard.getBoard()[3]} | ${gameBoard.getBoard()[4]} | ${gameBoard.getBoard()[5]}
            -----------
            ${gameBoard.getBoard()[6]} | ${gameBoard.getBoard()[7]} | ${gameBoard.getBoard()[8]}
            `))
    
            if(gameBoard.displayMove(move - 1, currentPlayer)){
                gameBoard.checkWin(currentPlayer)
                currentPlayer = Players.switchPlayer()
            }
            
            gameBoard.displayBoard();
        }
    }

    return { start };
})()

Game.start()