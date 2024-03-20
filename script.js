let gameOver = false;


const X = `<svg id="x-icon" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="0.5in" height="0.5in" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 2.33333 2.33333" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
 <style type="text/css">
   .fil0 {fill:#022A32}
 </style>
</defs>
<g id="Layer_x0020_1">
 <metadata id="CorelCorpID_0Corel-Layer"></metadata>
 <path class="fil0" d="M1.78195 2.01984c-0.0637795,0 -0.123575,-0.0246772 -0.168386,-0.0695l-0.446902 -0.44687 -0.446886 0.446886c-0.0448268,0.0448307 -0.104626,0.0695 -0.168406,0.0695 -0.0637795,0 -0.123591,-0.0246772 -0.168402,-0.0695 -0.0928465,-0.0928583 -0.0928465,-0.243941 0,-0.336803l0.446902 -0.446886 -0.446902 -0.446886c-0.044811,-0.0448268 -0.0695,-0.104634 -0.0695,-0.168402 0,-0.0637717 0.024689,-0.123575 0.0695,-0.168402 0.044811,-0.044815 0.104622,-0.0695 0.168386,-0.0695 0.0637795,0 0.123594,0.024685 0.168406,0.0695l0.446902 0.446886 0.446894 -0.446886c0.044811,-0.044815 0.10461,-0.0695 0.168406,-0.0695 0.0637795,0 0.123575,0.024685 0.168386,0.0695 0.0928622,0.0928583 0.0928622,0.243933 0,0.336787l-0.446882 0.446902 0.446886 0.446886c0.0928622,0.0928622 0.0928622,0.243945 0,0.336803 -0.0448268,0.044815 -0.104638,0.0694843 -0.168402,0.0694843z" id="id_102" style="fill: rgb(64, 255, 208);"></path>
</g>
</svg>`

const O = `<svg id="o-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="0.4in" height="0.4in">
<circle cx="50" cy="50" r="40" fill="none" stroke="#FFA400" stroke-width="20"/>
<!-- #40FFD0 -->
</svg>`

const Board = () => {
    const cellBoard = '<div class="cell" id="{ID}"></div>';
    const BOARD_SIZE = 9;
    const boardContainer = document.getElementById('main-board');

    let board = Array(BOARD_SIZE).fill('');

    // Generate the game board HTML
    const generateBoardHTML = () => {
        let html = '';
        for (let i = 0; i < BOARD_SIZE; i += 3) {
            html += '<div class="row">';
            for (let j = i; j < i + 3; j++) {
                html += cellBoard.replace('{ID}', j);
            }
            html += '</div>';
        }
        return html;
    };
    
    boardContainer.innerHTML = generateBoardHTML();

    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    function displayMove(targetCell, currentPlayer){
        index = targetCell.id

        if(index >= 0 && index < 9 && board[index] === ''){
            board[index] = currentPlayer.mark
            targetCell.innerHTML = currentPlayer.mark === 'X' ? X : O
            return true
        }
    
        return false
    }

    function paintWinCells(combination){
        const cells = document.querySelectorAll('.cell');
        const cellsId = Array.from([...cells]).map(cell => cell.id);

        const cellsToPaintIds = cellsId.filter((cellId) => combination.includes(parseInt(cellId)))

        const cellsToPaint = [];
        cells.forEach(cell => {
            if (cellsToPaintIds.includes(cell.id)) {
                cellsToPaint.push(cell);
            }
        });
        
        cellsToPaint.forEach((cell) => {
            cell.style.backgroundColor = '#348f00';
            cell.style.borderColor = '#5eff00'
        })
    }

    function incrementPlayerScore(currentPlayer){
        const toWhoAddScore = currentPlayer === 'tie' ? 'ties' : currentPlayer.mark.toLowerCase();
        const playerScoreChange = document.getElementById(`${toWhoAddScore}-score`);

        playerScoreChange.textContent = parseInt(playerScoreChange.textContent) + 1;
    }

    function checkTie(){
        return board.every(cell => cell !== '');
    }

    function checkWin(currentPlayer){
        
        for(let combination of winCombinations){
            const [i, j, k] = combination
            
            if (board[i] !== '' && board[i] === board[j] && board[i] === board[k]) {
                gameOver = true;

                paintWinCells(combination)
                incrementPlayerScore(currentPlayer)

                console.log(`Player ${currentPlayer.name} (${currentPlayer.mark}) wins!\nCongratulations`)
                alert(`Player ${currentPlayer.name} (${currentPlayer.mark}) wins!\nCongratulations`)
                return;
            }

            if(checkTie()){
                gameOver = true;
                incrementPlayerScore('tie')
                console.log("TIE")
                alert("TIE")
                return;
            }
        }
    }

    return {  displayMove, checkTie, checkWin }
}

const Players = (() => {
    let players = [];
    let currentPlayerIndex = 0;

    function createPlayer(playerName, playerMark) {
        return {
            name: playerName,
            mark: playerMark,
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
    let gameBoard;
    let currentPlayer;
    let cells;
    let turnDisplay;
    let restartButton;

    function start() {
        gameBoard = Board();
        Players.createPlayers(); // const [ player1, player2 ] = 
        currentPlayer = Players.getCurrentPlayer();
        cells = document.querySelectorAll('.cell');
        turnDisplay = document.getElementById('turn');
        restartButton = document.getElementById('restart');

        turnDisplay.innerHTML = `${currentPlayer.mark} (player ${currentPlayer.name}) Turn`;

        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });

        restartButton.addEventListener('click', restartGame);
    }

    function handleCellClick() {
        if (!gameOver && gameBoard.displayMove(this, currentPlayer)) {
            gameBoard.checkWin(currentPlayer);
            currentPlayer = Players.switchPlayer();
            turnDisplay.innerHTML = `${currentPlayer.mark} Turn (player ${currentPlayer.name})`;
        }
    }

    function restartGame() {
        // Remove event listeners from cells
        cells.forEach(cell => {
            cell.removeEventListener('click', handleCellClick);
        });

        // Reset board state
        gameBoard = Board();

        // Reset game over status
        gameOver = false;

        // Reset turn display
        
        if(currentPlayer.mark === 'O'){
            Players.switchPlayer() 
        }
        currentPlayer = Players.getCurrentPlayer();
        turnDisplay.innerHTML = `${currentPlayer.mark} (player ${currentPlayer.name}) Turn`;

        // Re-attach event listeners to cells
        cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
    }

    return { start };
})();

Game.start();