let gameOver = false;

function toggleIcon(selectedIcon) {
    if (selectedIcon === 'x') {
        document.getElementById('choose-x').classList.add('selected');
        document.getElementById('choose-o').classList.remove('selected');
    } else {
        document.getElementById('choose-o').classList.add('selected');
        document.getElementById('choose-x').classList.remove('selected');
    }
};

const X = `<svg id="x-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="70" height="70">
<path d="M 20 20 L 80 80" stroke="#40ffd0" stroke-width="20" stroke-linecap="round"/>
<path d="M 80 20 L 20 80" stroke="#40ffd0" stroke-width="20" stroke-linecap="round"/>
</svg>`;

const O = `<svg id="o-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="70" height="70">
<circle cx="50" cy="50" r="35" fill="none" stroke="#FFA400" stroke-width="20"/>
</svg>`;

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
        index = targetCell.id;

        if(index >= 0 && index < 9 && board[index] === ''){
            board[index] = currentPlayer.mark;
            targetCell.innerHTML = currentPlayer.mark === 'X' ? X : O;
            return true;
        }
    
        return false;
    }

    function paintWinCells(combination, color='#348f00'){
        const cells = document.querySelectorAll('.cell');
        const cellsId = Array.from([...cells]).map(cell => cell.id);

        const cellsToPaintIds = cellsId.filter((cellId) => combination.includes(parseInt(cellId)));

        const cellsToPaint = [];
        cells.forEach(cell => {
            if (cellsToPaintIds.includes(cell.id)) {
                cellsToPaint.push(cell);
            }
        });
        
        cellsToPaint.forEach((cell) => {
            cell.style.backgroundColor = color;
            cell.style.borderColor = color;
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
            const [i, j, k] = combination;
            
            if (board[i] !== '' && board[i] === board[j] && board[i] === board[k]) {
                gameOver = true;

                paintWinCells(combination);
                incrementPlayerScore(currentPlayer);
                return;
            }
        }

        if(checkTie() && !gameOver){
            gameOver = true;
            paintWinCells([0, 1, 2, 3, 4, 5, 6, 7, 8], backgroundColor='#515151');
            incrementPlayerScore('tie');
            return;
        }
    }

    return {  displayMove, checkTie, checkWin };
};

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
        const selectedMark = document.querySelector('#choose-mark .selected');

        for (let i = 0; i < 2; i++) {
            const playerNameHtml = document.getElementById(`player${i+1}-name`);
            const playerName = playerNameHtml.value === '' ? i + 1 : playerNameHtml.value;
            const playerMark = i === 0 ? (selectedMark.id === 'choose-x' ? 'X' : 'O') : (players[0].mark === 'X' ? 'O' : 'X');

            players.push(createPlayer(playerName, playerMark));
        }

        currentPlayerIndex = players[1].mark === 'X' ? 1 : 0;
        return players;
    }

    function deletePlayers(){
        players = [];
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

    return { createPlayers, switchPlayer, getCurrentPlayer, deletePlayers };
})();

const Game = (() => {
    let gameBoard;
    let currentPlayer;
    let cells;
    let turnDisplay;
    let restartButton;

    const createPlayersForm = document.getElementById('players-creation');
    const mainContainer = document.getElementById('main');

    const playerXName = document.getElementById('player-x-name') 
    const playerOName = document.getElementById('player-o-name') 

    function start() {
        createPlayersForm.style.display = 'none';
        mainContainer.style.display = 'flex';
        Players.deletePlayers();
        gameBoard = Board();
        const [player1, player2] = Players.createPlayers();
        currentPlayer = Players.getCurrentPlayer();
        cells = document.querySelectorAll('.cell');
        turnDisplay = document.getElementById('turn');
        restartButton = document.getElementById('restart');

        turnDisplay.innerHTML = `${currentPlayer.mark} (player ${currentPlayer.name}) Turn`;

        playerXName.innerHTML = `Name: ${player1.name}` 
        playerOName.innerHTML = `Name: ${player2.name}` 

        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });

        restartButton.addEventListener('click', startNewRound);
    };

    function handleCellClick() {
        if (!gameOver && gameBoard.displayMove(this, currentPlayer)) {
            gameBoard.checkWin(currentPlayer);
            currentPlayer = Players.switchPlayer();
            turnDisplay.innerHTML = `${currentPlayer.mark} Turn (player ${currentPlayer.name})`;
        }
    };

    function startNewRound() {
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
            Players.switchPlayer() ;
        }
        currentPlayer = Players.getCurrentPlayer();
        turnDisplay.innerHTML = `${currentPlayer.mark} (player ${currentPlayer.name}) Turn`;

        // Re-attach event listeners to cells
        cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
    };

    function quitGame(){
        createPlayersForm.style.display = 'flex';
        mainContainer.style.display = 'none';
    };

    return { start, quitGame };
})();

const startGame = document.getElementById('start');
startGame.addEventListener('click', function(event) {
    event.preventDefault();
    Game.start();
});

const quitGame = document.getElementById('quit');
quitGame.addEventListener('click', function() {
    Game.quitGame();
});