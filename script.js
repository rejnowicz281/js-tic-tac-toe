const Player = (sign) => {
  return { sign, points: 0, bot: false };
};

const Board = () => {
  let table = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  const mark = (row, column, sign) => {
    table[row][column] = sign;
  };

  const clearTable = () => {
    table = [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];
  };

  const printTable = () => {
    console.log();
    for (let i = 0; i < table.length; i++) {
      console.log(table[i]);
    }
    console.log();
  };

  return {
    getTable: () => table,
    getSquare: (row, column) => table[row][column],
    mark,
    clearTable,
    printTable,
  };
};

const Game = (bot = false) => {
  const player1 = Player("X");
  const player2 = Player("O");
  let winHistory = [];
  let currentPlayer = Math.floor(Math.random() * 2) == 0 ? player1 : player2;
  let board = Board();
  const winningPatterns = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [2, 0],
      [1, 1],
      [0, 2],
    ],
  ];

  const winCheck = (player) => {
    let win = (pattern) => pattern.every((square) => square === player.sign);

    for (let i = 0; i < winningPatterns.length; i++) {
      let pattern = [];
      for (let j = 0; j < winningPatterns[i].length; j++) {
        let row = winningPatterns[i][j][0];
        let column = winningPatterns[i][j][1];
        pattern.push(board.getSquare(row, column));
      }

      // if every square in a winning pattern equals the player's sign, then he wins
      if (win(pattern)) return true;
    }
    return false;
  };

  const tieCheck = () => {
    for (let i = 0; i < board.getTable().length; i++) {
      for (let j = 0; j < board.getTable()[i].length; j++) {
        if (board.getSquare(i, j) == " ") return false; // if board isn't full, return false
      }
    }
    return true;
  };

  const playTurn = (row, column) => {
    if (board.getSquare(row, column) == " ") {
      board.mark(row, column, currentPlayer.sign);
    } else {
      return console.log("cant do that.");
    }

    if (winCheck(currentPlayer)) {
      board.clearTable();
      currentPlayer.points++;
      winHistory.push(currentPlayer);
      console.log(`${currentPlayer.sign} wins`);
    } else if (tieCheck()) {
      winHistory.push(null);
      board.clearTable();
      console.log("tis a tie...");
    }

    board.printTable();

    currentPlayer = currentPlayer == player1 ? player2 : player1;

    if (currentPlayer.bot) botMove();
  };

  const botMove = () => {
    let legalMoves = [];

    for (let i = 0; i < board.getTable().length; i++) {
      for (let j = 0; j < board.getTable()[i].length; j++) {
        if (board.getSquare(i, j) == " ") {
          legalMoves.push([i, j]);
        }
      }
    }

    let randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    console.log(`I, the computer, am choosing coordinates (${randomMove}).`);
    playTurn(randomMove[0], randomMove[1]);
  };

  if (bot) {
    Math.floor(Math.random() * 2) == 0
      ? (player1.bot = true)
      : (player2.bot = true); // make random player bot

    if (currentPlayer.bot) {
      botMove(); // let bot start
    }
  }

  return {
    player1,
    player2,
    winCheck,
    tieCheck,
    getWinHistory: () => winHistory,
    getCurrentPlayer: () => currentPlayer,
    getBoard: () => board,
    playTurn,
  };
};

const screenController = (game) => {
  let winHistoryTemp = []; // store previous winners (storing it here aswell as in the game function so that a new winner can be detected)

  const updateSquares = () => {
    const squares = document.querySelectorAll(".square");
    for (let i = 0; i < squares.length; i++) {
      let row = squares[i].dataset.row;
      let column = squares[i].dataset.column;
      squares[i].textContent = game.getBoard().getSquare(row, column);
    }
  };

  const updatePlayerContainers = () => {
    let otherPlayer =
      game.getCurrentPlayer() == game.player1 ? game.player2 : game.player1;
    let otherPlayerContainer = document.getElementById(
      `player${otherPlayer.sign}-container`
    );
    if (otherPlayerContainer.classList.contains("green"))
      otherPlayerContainer.classList.remove("green");

    let otherPlayerPoints = document.getElementById(
      `player${otherPlayer.sign}-points`
    );
    otherPlayerPoints.textContent = otherPlayer.points;

    let currentPlayerContainer = document.getElementById(
      `player${game.getCurrentPlayer().sign}-container`
    );
    let currentPlayerPoints = document.getElementById(
      `player${game.getCurrentPlayer().sign}-points`
    );
    currentPlayerPoints.textContent = game.getCurrentPlayer().points;

    currentPlayerContainer.classList.add("green");
  };

  const updateHeading = (message) => {
    const gameHeading = document.querySelector(".game-heading");
    if (!gameHeading.classList.contains("pulse")) {
      gameHeading.classList.add("pulse");
      gameHeading.textContent = message;

      setTimeout(() => {
        gameHeading.textContent = "Tic Tac Toe";
        gameHeading.classList.remove("pulse");
      }, 2000);
    }
  };

  const updateRoundMessage = () => {
    // if there is a new winner
    if (game.getWinHistory().length != winHistoryTemp.length) {
      const previousWinner =
        game.getWinHistory()[game.getWinHistory().length - 1];
      winHistoryTemp.push(previousWinner);
      if (previousWinner == null) {
        updateHeading("It's a Tie!");
      } else {
        updateHeading(`Player ${previousWinner.sign} wins!`);
      }
    }
  };

  const updateScreen = () => {
    updatePlayerContainers();

    updateRoundMessage();

    updateSquares();
  };

  const board = document.querySelector(".game-board");

  board.onclick = function (e) {
    row = e.target.dataset.row;
    column = e.target.dataset.column;
    if (!row || !column) return;
    game.playTurn(row, column);
    updateScreen();
  };

  document
    .querySelector(".game-heading")
    .classList.remove("game-heading-slide-in"); // prevent game heading sliding in after getting it's 'pulse' class removed

  updateHeading("New Game Initiated");
  updateScreen(); // innitial update
};

let game;

(function () {
  const newGameBot = document.getElementById("new-game-bot");
  const newGameFriend = document.getElementById("new-game-friend");
  newGameFriend.onclick = function () {
    if (newGameBot.classList.contains("new-game-active"))
      newGameBot.classList.remove("new-game-active");

    newGameFriend.classList.add("new-game-active");
    game = Game();
    screenController(game);
  };
  newGameBot.onclick = function () {
    if (newGameFriend.classList.contains("new-game-active"))
      newGameFriend.classList.remove("new-game-active");

    newGameBot.classList.add("new-game-active");
    game = Game(true);
    screenController(game);
  };
})();
