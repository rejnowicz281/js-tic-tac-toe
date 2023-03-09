const Player = (sign) => {
  return { sign, points: 0 };
};

const Board = () => {
  const table = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];
  const mark = (row, column, sign) => {
    table[row][column] = sign;
  };

  return { table, mark };
};

const game = (() => {
  const player1 = Player("X");
  const player2 = Player("O");

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

  const clearSquares = () => {
    const squares = document.querySelectorAll(".square");

    for (let i = 0; i < squares.length; i++) {
      squares[i].textContent = "";
    }
  };

  const playTurn = (player) => {
    const playerContainer = document.getElementById(
      `player${player.sign}-container`
    );
    playerContainer.classList.add("green");
    const squares = document.querySelectorAll(".square");

    for (let j = 0; j < squares.length; j++) {
      squares[j].onclick = function () {
        if (squares[j].textContent == "") {
          squares[j].textContent = player.sign;
          board.mark(
            squares[j].dataset.row,
            squares[j].dataset.column,
            player.sign
          );
          if (winCheck(player)) {
            clearSquares();
            board = Board();
            player.points++;
            document.getElementById(`player${player.sign}-points`)
              .textContent++;
          } else if (tieCheck()) {
            clearSquares();
            board = Board();
          } else {
            playerContainer.classList.remove("green");
            playTurn(player == player1 ? player2 : player1);
          }
        }
      };
    }
  };

  const play = () => {
    let startingPlayer = Math.floor(Math.random() * 2) == 0 ? player1 : player2;
    playTurn(startingPlayer);
  };

  return { player1, player2, board, play };
})();

(function () {
  const newGameFriend = document.getElementById("new-game-friend");

  newGameFriend.addEventListener("click", game.play);
})();
