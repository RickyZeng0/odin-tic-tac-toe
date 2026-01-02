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
    //if the cell is empty, then it is an valid move to it
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
        return false;
    };
    const checkFull = () => {
        //find a row that contain an empty mark
        let emptyMark = boardArr.find((row) =>  (row.find((mark)=>mark==0)) == 0 ) ;
        if(emptyMark == undefined) return true;
        return false;
    };

    //provide API
    return {getBoard , addMark , printBoard , checkMark , checkValid , checkFull};
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
    let state = "preparing";
    let winner;

    const start = () => {state = "running"};
    const getCurrentPlayer = () => currentPlayer;
    const getWinner = () => winner;
    const getState = () => state;
    const setPlayerName = (index , name) => {players[index].name = name};
    const getPlayerByMark = (mark) => players.find( (player) => player.mark == mark );
    const updateState = () => {
        winner = getPlayerByMark(board.checkMark());
        if(winner != undefined) state = "win";
        else if(winner == undefined && board.checkFull()) state = "tie";
        else state = "running";
    };
    const switchPlayer = () => {currentPlayer = (currentPlayer == players[0]? players[1]: players[0]) };
    const displayNewRound = () => {
        //display the newest board and tell the next one to play
        board.printBoard();
        console.log(`${currentPlayer.name} now is your turn`);
    };
    const playNewRound = (r,c) => {
        //if end , don't do anything
        if(state != "running") return;
        //make sure we don't repeat it
        if(!board.checkValid(r,c)) {
            console.log("Invalid move ! Don't repeat the same step !");
            return;
        }
        console.log(`${currentPlayer.name} put on ${r},${c}`);
        board.addMark(r,c,currentPlayer.mark);
        updateState();
        //check win
        if(state == "win"){
            console.log(`Game end ! winner is ${winner.name}`);
            board.printBoard();
            return;
        }
        else if(state == "tie"){
            console.log(`Game end ! It is a tie`);
            board.printBoard();
            return;
        }
        switchPlayer();
        displayNewRound();
    };

    //init the game at start
    displayNewRound();
    return {getCurrentPlayer , playNewRound , getBoard: board.getBoard ,getWinner , getState , setPlayerName ,start};
}

function ScreenController(){
    const game = GameController();
    const messageDiv = document.querySelector(".message");
    const boardDiv = document.querySelector(".board");
    const form = document.querySelector("form");

    const updateScreen = () => {
        const boardArr = game.getBoard();
        const currentPlayer = game.getCurrentPlayer();

        //clear the old content, remove the child, removing the text content has no effect
        while(boardDiv.firstChild){
            boardDiv.removeChild(boardDiv.firstChild);
        }
        //render the new content
        if(game.getState() == "preparing") messageDiv.textContent = `Please enter both player's name and click start button`;
        else if(game.getState() == "running") messageDiv.textContent = `Now it's ${currentPlayer.name} turn !`;
        else if(game.getState() == "win") messageDiv.textContent = `The game has end, ${game.getWinner().name} win !`;
        else if(game.getState() == "tie") messageDiv.textContent = `The game has end, It is an tie !`;
        boardArr.forEach( (row , r) => {
            row.forEach((mark, c) => {
                const markButton = document.createElement("button");
                markButton.dataset.row = r;
                markButton.dataset.col = c;
                //display empty string but not 0, so it is different from o
                markButton.textContent = mark ? mark : "";
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

    function nameHandler(e){
        e.preventDefault();
        //should put after preventDefault, otherwise reclick it will cause refresh of page
        if(game.getState() != "preparing") return;
        const formData = new FormData(form);
        game.setPlayerName(0, formData.get("p1Name"));
        game.setPlayerName(1, formData.get("p2Name"));
        game.start();
        updateScreen();
    }

    //after the button trigger click effect, the effect will be forward to div and be captured
    form.addEventListener("submit", nameHandler);
    boardDiv.addEventListener("click",clickHandlerBoard);
    updateScreen();
}

ScreenController();
