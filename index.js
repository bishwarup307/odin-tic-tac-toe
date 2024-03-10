const gameBoard = function (dimension = 3, markers = { 1: "X", 2: "O" }) {
  const board = [];
  for (let i = 0; i < dimension * dimension; i++)
    board.push({ index: i, marker: 0 });

  const getAvailableCells = () => {
    return board.filter((cell) => cell.marker === 0).map((cell) => cell.index);
  };

  const mark = (cell, playerIndex) => {
    board[cell].marker = playerIndex;
  };

  const getBoard = () => board;

  const printBoard = () => {
    let boardState = "";
    const drawLine = () => {
      boardState += "\n|";
      for (let i = 0; i < 6 * dimension; i++) boardState += "-";
      boardState += "\n|";
    };

    drawLine();
    for (let cell of board) {
      let marker = markers[cell.marker] || "-";
      marker = "  " + marker + "  ";
      boardState += marker + "|";
      if (cell.index % dimension === dimension - 1) drawLine();
    }
    return boardState.slice(0, -1);
  };

  return { getAvailableCells, mark, getBoard, printBoard };
};

const myBoard = gameBoard();
myBoard.mark(0, 1);
myBoard.mark(3, 2);
myBoard.mark(5, 1);
myBoard.mark(1, 2);
myBoard.mark(4, 1);
myBoard.mark(8, 2);

console.log(myBoard.printBoard());
