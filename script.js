function Gameboard(){
    //set up the data
    const boardArr = [];
    const row = 3;
    const col = 3;

    for(let i=0; i<row; i++){
        boardArr[i] = [];
        for(let j=0; j<col; j++){
            boardArr[i].push(0);
        }
    }
    //set up the method
    const getBoard = () => boardArr;
    const addMark = (r , c, mark) => { boardArr[r][c] = mark};
    const printBoard = () => {console.log(boardArr)};
    //if the cell is empty, then it is an empty to it
    const checkValid = (r , c) => boardArr[r][c] == 0 ;
    //check if there any winning mark, if so return that mark, if no return 0
    const checkMark = () => {
        for(let i=0; i<row; i++){
            if(boardArr[i][0] == boardArr[i][1] && boardArr[i][1] == boardArr[i][2]) return boardArr[i][0];
        }
        for(let i=0; i<col; i++){
            if(boardArr[0][i] == boardArr[1][i] && boardArr[1][i] == boardArr[2][i]) return boardArr[0][i];
        }
        if(boardArr[0][0] == boardArr[1][1] && boardArr[1][1] == boardArr[2][2]) return boardArr[0][0];
        if(boardArr[0][2] == boardArr[1][1] && boardArr[1][1] == boardArr[2][0]) return boardArr[0][2];
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
    return {getCurrentPlayer , playNewRound , getBoard: board.getBoard};
}

function ScreenController(){
    const game = GameController();
    const messageDiv = document.querySelector(".message");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        const boardArr = game.getBoard();
        const currentPlayer = game.getCurrentPlayer();

        //clear the old content, remove the child, removing the text content has no effect
        while(boardDiv.firstChild){
            boardDiv.removeChild(boardDiv.firstChild);
        }
        //render the new content
        messageDiv.textContent = `Now it's ${currentPlayer.name} turn !`;
        boardArr.forEach( (row , r) => {
            row.forEach((mark, c) => {
                const markButton = document.createElement("button");
                markButton.dataset.row = r;
                markButton.dataset.col = c;
                //display empty string but not 0, so it is different from o
                markButton.textContent = boardArr[r][c] ? boardArr[r][c] : "";
                boardDiv.appendChild(markButton);
            } );
        } );
    };

    function clickHandlerBoard(e){
        const r = e.target.dataset.row;
        const c = e.target.dataset.col;
        if(r === undefined || c === undefined) return;
        game.playNewRound(r,c);
        updateScreen();
    }

    boardDiv.addEventListener("click",clickHandlerBoard);
    updateScreen();
}

ScreenController();
