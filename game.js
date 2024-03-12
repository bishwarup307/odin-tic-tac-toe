const gameBoard = function (dimension = 3, markers = { 1: "X", 2: "O" }) {
  const board = [];

  //   playerMarkers = markers;
  /*
    Each position holds an object containing the
    cell position and the value. The value is an integer
    indicating the player index (e.g. 1 or 2). All unoccupied
    cells have value 0.
    */
  for (let i = 0; i < dimension * dimension; i++)
    board.push({ index: i, value: 0 });

  /* 
    Returns an array of indices from 0 to dimension - 1 that are empty or
    unoccupied
    */
  const getAvailableCells = () => {
    return board.filter((cell) => cell.value === 0).map((cell) => cell.index);
  };

  //   const updateMarkers = (markers) => {
  //     playerMarkers = markers;
  //   };

  /* 
    Updates the board state by marking a cell (updating its value) with a player index
    */
  const mark = (cell, playerIndex) => {
    if (board[cell].value > 0) {
      alert("This cell is already occupied, choose a different cell");
      return;
    }
    board[cell].value = playerIndex;
  };

  const getBoard = () => board;

  const get2dIndex = (indices) => {
    const rowIndices = indices.map((index) =>
      Math.floor(index.index / dimension)
    );
    const columnIndices = indices.map((index) => index.index % dimension);
    return { rowIndices, columnIndices };
  };

  /* 
    Calculates whether the current board state reflect a diagonal streak.
    The win could either come from the primary (\) or secondary (/) diagonal.
    */
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

  /* 
    Calculates if there's a streak either horizontally or vertically.
    In a 2D board, if a row index (or column index) has all the column
    indices (or row indices, respectively) - then there is a horizontal 
    (or vertical) streak.
    */
  const isHorizontalOrVerticalStreak = (indices2d) => {
    let { rowIndices, columnIndices } = indices2d;

    let rowCounter = {};
    let columnCounter = {};

    for (let i = 0; i < indices2d.rowIndices.length; i++) {
      if (rowCounter[rowIndices[i]])
        rowCounter[rowIndices[i]].push(columnIndices[i]);
      else rowCounter[rowIndices[i]] = [columnIndices[i]];

      if (columnCounter[columnIndices[i]])
        columnCounter[columnIndices[i]].push(rowIndices[i]);
      else columnCounter[columnIndices[i]] = [rowIndices[i]];
    }

    for (rowIndex in rowCounter) {
      if (rowCounter[rowIndex].length === dimension) return true;
    }
    for (colIndex in columnCounter) {
      if (columnCounter[colIndex].length === dimension) return true;
    }
    return false;
  };

  /* Checks for all the win conditions */
  const isWin = (indices2d) => {
    const winCondition1 = isHorizontalOrVerticalStreak(indices2d);
    const winCondition2 = isDiagonalStreak(indices2d);

    return winCondition1 || winCondition2;
  };

  /* Checks for a win given a specific board state */
  const evaluateState = () => {
    const xCells = board.filter((cell) => cell.marker == 1); // first player marks
    const oCells = board.filter((cell) => cell.marker == 2); // second player marks

    const x2D = get2dIndex(xCells);
    const o2D = get2dIndex(oCells);

    if (isWin(x2D)) return 1; // first player wins
    if (isWin(o2D)) return 2; // second player wins
    return 0;
  };

  const printBoard = () => {
    for (let i = 0; i < dimension * dimension; i++) {
      if (board[i].marker > 0) {
        const cell = document.querySelector(`#cell-${i}`);
        cell.innerHTML = markers[board[i].marker];
        cell.classList.add("occupied");
        cell.classList.add(`p${board[i].marker}`);
      }
    }
  };

  return {
    dimension,
    getAvailableCells,
    mark,
    getBoard,
    evaluateState,
    printBoard,
  };
};

const gameController = (firstPlayer, secondPlayer, boardDimension = 3) => {
  let newBoard;
  let activePlayer;
  /* 
      1. Assigns active player to first player
      2. Initiates a new blank board
      3. Prints the board // optional
    */
  const startGame = () => {
    activePlayer = firstPlayer;
    newBoard = gameBoard(boardDimension);
    newBoard.printBoard();
  };

  const getBoardState = () => newBoard.getBoard();

  /* Switches turns between players */
  const switchPlayer = () => {
    activePlayer = activePlayer === firstPlayer ? secondPlayer : firstPlayer;
  };

  const playNextTurn = (cellIndex) => {
    newBoard.mark(cellIndex, activePlayer.getInfo().index);
    const outcome = newBoard.evaluateState();
    switchPlayer();
    return outcome;
  };

  return { startGame, getBoardState, switchPlayer, playNextTurn };
};

export default gameController;
