function Gameboard(){
    //set up the data
    const board = [];
    const row = 3;
    const col = 3;

    for(let i=0; i<row; i++){
        board[i] = [];
        for(let j=0; j<col; j++){
            board[i].push(0);
        }
    }
    //set up the method
    const getBoard = () => board;
    const addMark = (r , c, mark) => { board[r][c] = mark};
    const printBoard = () => {console.log(board)};
    //if the cell is empty, then it is an empty to it
    const checkValid = (r , c) => board[r][c] == 0 ;
    //check if there any winning mark, if so return that mark, if no return 0
    const checkMark = () => {
        for(let i=0; i<row; i++){
            if(board[i][0] == board[i][1] && board[i][1] == board[i][2]) return board[i][0];
        }
        for(let i=0; i<col; i++){
            if(board[0][i] == board[1][i] && board[1][i] == board[2][i]) return board[0][i];
        }
        if(board[0][0] == board[1][1] && board[1][1] == board[2][2]) return board[0][0];
        if(board[0][2] == board[1][1] && board[1][1] == board[2][0]) return board[0][2];
        return 0;
    };

    //provide API
    return {getBoard , addMark , printBoard , checkMark , checkValid};
}

function Player(name , mark){
    //here is the private variable
    let score = 0;
    //here is the public API
    const getScore = () => score;
    const addScore = () => {++score};
    return {name, mark, getScore , addScore};
}

function GameController(){
    const board = Gameboard();
    const players = [ Player("Player 1" , "X") , Player("Player 2" , "O")];
    let currentPlayer = players[0];

    const getCurrentPlayer = () => currentPlayer;
    const getPlayerByMark = (mark) => players.find( (player) => player.mark == mark );
    const switchPlayer = () => {currentPlayer = (currentPlayer == players[0]? players[1]: players[0]) };
    const displayNewRound = () => {
        //display the newest board and tell the next one to play
        board.printBoard();
        console.log(`${currentPlayer.name} now is your turn`);
    };
    const playNewRound = (r,c) => {
        //make sure we don't repeat it
        if(!board.checkValid(r,c)) {
            console.log("Invalid move ! Don't repeat the same step !");
            return;
        }
        console.log(`${currentPlayer.name} put on ${r},${c}`);
        board.addMark(r,c,currentPlayer.mark);
        //check win
        let winner = getPlayerByMark(board.checkMark());
        if(winner != undefined){
            console.log(`Game end ! winner is ${winner.name}`);
            board.printBoard();
            return;
        }
        switchPlayer();
        displayNewRound();
    };

    //init the game at start
    displayNewRound();
    return {getCurrentPlayer , playNewRound};
}

let game = GameController();
