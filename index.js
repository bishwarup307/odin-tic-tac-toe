const gameBoard = function (dimension = 3, markers = { 1: "X", 2: "O" }) {
  const board = [];

  // Each position holds an object containing the
  // cell position and the marker. The marker is an integer
  // indicating the player index (e.g. 1 or 2). All unoccupied
  // cells have marker 0.
  for (let i = 0; i < dimension * dimension; i++)
    board.push({ index: i, marker: 0 });

  const getAvailableCells = () => {
    return board.filter((cell) => cell.marker === 0).map((cell) => cell.index);
  };

  const mark = (cell, playerIndex) => {
    board[cell].marker = playerIndex;
  };

  const getBoard = () => board;

  const get2dIndex = (indices) => {
    const rowIndices = indices.map((index) =>
      Math.floor(index.index / dimension)
    );
    const columnIndices = indices.map((index) => index.index % dimension);
    return { rowIndices, columnIndices };
  };

  function findUniques(arr) {
    return arr.filter((element, index) => arr.indexOf(element) === index);
  }

  const isDiagonalStreak = (indices2D) => {
    let primaryDiagonalStreak = 0;
    let secondaryDiagnoalStreak = 0;

    for (let i = 0; i < indices2D.rowIndices.length; i++) {
      primaryDiagonalStreak +=
        indices2D.rowIndices[i] === indices2D.columnIndices[i];
      secondaryDiagnoalStreak +=
        indices2D.rowIndices[i] === dimension - indices2D.columnIndices[i] - 1;
    }

    return (
      Math.max(primaryDiagonalStreak, secondaryDiagnoalStreak) >= dimension
    );
  };

  const isWin = (indices2d) => {
    const rowUniques = findUniques(indices2d.rowIndices);
    const columnUniques = findUniques(indices2d.columnIndices);

    windCondtition1 =
      rowUniques.length === 1 && columnUniques.length === dimension; // horizontal streak
    windCondtition2 =
      rowUniques.length === dimension && columnUniques.length === 1; // vertical streak
    windCondtition3 = isDiagonalStreak(indices2d);

    return windCondtition1 || windCondtition2 || windCondtition3;
  };

  const evaluateState = () => {
    xCells = board.filter((cell) => cell.marker == 1);
    oCells = board.filter((cell) => cell.marker == 2);

    x2D = get2dIndex(xCells);
    o2D = get2dIndex(oCells);

    if (isWin(x2D)) console.log("first player wins");
    if (isWin(o2D)) console.log("second player wins");
  };

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

  return { getAvailableCells, mark, getBoard, evaluateState, printBoard };
};

const myBoard = gameBoard();
myBoard.mark(0, 1);
myBoard.mark(4, 1);
myBoard.mark(8, 1);

console.log(myBoard.printBoard());
console.log(myBoard.evaluateState());
