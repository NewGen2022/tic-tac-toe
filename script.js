const BOARD_SIZE = 9;

let gameBoard = Array(BOARD_SIZE).fill('');
let currentPlayer = null;
let gameOver = false;

const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]              // Diagonals
];

function createPlayer(playerName, playerOption){
    let name = playerName;
    let option = playerOption;

    const setName = (newName) => playerName = newName;
    const getName = () => playerName;

    const setOption = (newOption) => playerOption = newOption;
    const getOption = () => playerOption;

    return {getName, setName, getOption, setOption}
}

function createPlayers(){
    const playerName1 = prompt('Enter player 1 name');
    const playerName2 = prompt('Enter player 2 name');

    const playerOption = prompt('Enter 1 for X OR 0 for O');

    const playerOption1 = (playerOption === '1' ? 'X' : 'O')
    const playerOption2 = (playerOption1 === 'O' || playerOption1 === '' ? 'X' : 'O')

    const player1 = createPlayer(playerName1, playerOption1)
    const player2 = createPlayer(playerName2, playerOption2)

    return {player1, player2}
}

function handleMove(index){
    if(index >= 0 && index < 9 && gameBoard[index] === ''){
        gameBoard[index] = currentPlayer.getOption()
        return true
    }

    return false
}

function checkTie() {
    return gameBoard.every(cell => cell !== '');
}

function checkWin(){
    if(checkTie()){
        gameOver = true;
        console.log("TIE")
        alert("TIE")
        return;
    }

    for(let combination of winCombinations){
        const [i, j, k] = combination

        if (gameBoard[i] !== '' && gameBoard[i] === gameBoard[j] && gameBoard[i] === gameBoard[k]) {
            gameOver = true;
            console.log(`Player ${currentPlayer.getName()} (${currentPlayer.getOption()}) wins!\nCongratulations`)
            alert(`Player ${currentPlayer.getName()} (${currentPlayer.getOption()}) wins!\nCongratulations`)
            return;
        }
    }
}

function displayBoard() {
    const rows = [];
    for (let i = 0; i < 9; i += 3) {
        const row = gameBoard.slice(i, i + 3).join(' | ');
        rows.push(row);
    }
    const board = rows.join('\n---------\n');
    console.log(board);
}

(function game(){
    const {player1, player2} = createPlayers()

    console.log(player1.getName())
    console.log(player2.getName())

    console.log(gameBoard)

    currentPlayer = player1.getOption() === "X" ? player1 : player2;

    console.log(currentPlayer.getName())

    while(!gameOver){
        const move = parseInt(prompt(`Enter cell you want to put a X/O
        [1 2 3]
        [4 5 6]
        [7 8 9]`))

        if(handleMove(move-1)){
            checkWin()
            currentPlayer = currentPlayer === player1 ? player2 : player1;
        }

        alert(`
        ${gameBoard[0]} | ${gameBoard[1]} | ${gameBoard[2]}
        -----------
        ${gameBoard[3]} | ${gameBoard[4]} | ${gameBoard[5]}
        -----------
        ${gameBoard[6]} | ${gameBoard[7]} | ${gameBoard[8]}
        `)
        
        displayBoard();
    }
})()