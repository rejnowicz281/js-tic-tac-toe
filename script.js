const Player = (sign) => {
  return { sign, points: 0 };
};

const Board = () => {
  let table = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  function mark(row, column, sign) {
    this.table[row][column] = sign;
  }

  function clearTable() {
    this.table = [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];
  }

  return { table, clearTable, mark };
};

const Game = () => {
  const player1 = Player("X");
  const player2 = Player("O");
  let winHistory = [];
  let currentPlayer = Math.floor(Math.random() * 2) == 0 ? player1 : player2;

  let board = Board();

  const winCheck = (player) => {
    return (
      (board.table[0][0] == player.sign &&
        board.table[0][1] == player.sign &&
        board.table[0][2] == player.sign) ||
      (board.table[1][0] == player.sign &&
        board.table[1][1] == player.sign &&
        board.table[1][2] == player.sign) ||
      (board.table[2][0] == player.sign &&
        board.table[2][1] == player.sign &&
        board.table[2][2] == player.sign) ||
      (board.table[0][0] == player.sign &&
        board.table[1][0] == player.sign &&
        board.table[2][0] == player.sign) ||
      (board.table[0][1] == player.sign &&
        board.table[1][1] == player.sign &&
        board.table[2][1] == player.sign) ||
      (board.table[0][2] == player.sign &&
        board.table[1][2] == player.sign &&
        board.table[2][2] == player.sign) ||
      (board.table[0][0] == player.sign &&
        board.table[1][1] == player.sign &&
        board.table[2][2] == player.sign) ||
      (board.table[2][0] == player.sign &&
        board.table[1][1] == player.sign &&
        board.table[0][2] == player.sign)
    );
  };

  const tieCheck = () => {
    for (let i = 0; i < board.table.length; i++) {
      for (let j = 0; j < board.table[i].length; j++) {
        if (board.table[i][j] == " ") return false;
      }
    }
    return true;
  };

  function playTurn(row, column) {
    if (board.table[row][column] == " ") {
      board.mark(row, column, this.currentPlayer.sign);
    } else {
      return console.log("cant do that.");
    }

    if (winCheck(this.currentPlayer)) {
      board.clearTable();
      this.currentPlayer.points++;
      this.winHistory.push(this.currentPlayer);
      console.log(`${this.currentPlayer.sign} wins`);
    } else if (tieCheck()) {
      this.winHistory.push(null);
      board.clearTable();
      console.log("tis a tie...");
    }

    for (let i = 0; i < board.table.length; i++) {
      console.log(board.table[i]);
    }
    this.currentPlayer = this.currentPlayer == player1 ? player2 : player1;
  }

  return {
    player1,
    player2,
    winCheck,
    tieCheck,
    winHistory,
    currentPlayer,
    board,
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
      squares[i].textContent = game.board.table[row][column];
    }
  };

  const updatePlayerContainers = () => {
    let otherPlayer =
      game.currentPlayer == game.player1 ? game.player2 : game.player1;
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
      `player${game.currentPlayer.sign}-container`
    );
    let currentPlayerPoints = document.getElementById(
      `player${game.currentPlayer.sign}-points`
    );
    currentPlayerPoints.textContent = game.currentPlayer.points;

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
    if (game.winHistory.length != winHistoryTemp.length) {
      const previousWinner = game.winHistory[game.winHistory.length - 1];
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

  updateHeading("New Game Initiated");
  updateScreen(); // innitial update
};

let game;

(function () {
  const newGameFriend = document.getElementById("new-game-friend");
  newGameFriend.onclick = function () {
    newGameFriend.classList.add("new-game-active");
    document
      .querySelector(".game-heading")
      .classList.remove("game-heading-slide-in");
    game = Game();
    screenController(game);
  };
})();
