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

    if (isWin(x2D)) return 1;
    if (isWin(o2D)) return 2;
    return 0;
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
    console.log(boardState.slice(0, -1));
  };

  return { getAvailableCells, mark, getBoard, evaluateState, printBoard };
};

const gameHandler = () => {
  const firstPlayer = { name: "John", marker: "X", index: 1 };
  const secondPlayer = { name: "Robbie", marker: "O", index: 2 };

  let newBoard;
  let activePlayer;

  const initializeGame = () => {
    activePlayer = firstPlayer;
    newBoard = gameBoard();
    newBoard.printBoard();
  };

  const switchPlayer = () => {
    activePlayer = activePlayer === firstPlayer ? secondPlayer : firstPlayer;
  };

  const askChoice = (cells) => {
    const x = prompt(
      `It's ${activePlayer.name}'s turn. Choose a cell from the list: ${cells}`
    );
    if (!cells.includes(Number(x))) throw new Error("Invalid choice made");
    return Number(x);
  };

  const playNextTurn = () => {
    const playerChoice = askChoice(newBoard.getAvailableCells());
    newBoard.mark(playerChoice, activePlayer.index);
    newBoard.printBoard();
    outcome = newBoard.evaluateState();
    return outcome;
  };

  const playNewGame = () => {
    initializeGame();
    let gameOver = false;

    while (!gameOver && newBoard.getAvailableCells().length > 0) {
      const roundResult = playNextTurn();
      gameOver = roundResult > 0;
      switchPlayer();
    }

    if (gameOver === 0) console.log("It's a TIE");
    else {
      const winner = gameOver === 1 ? firstPlayer : secondPlayer;
      console.log(`WoHoo! ${winner.name} wins this round.`);
    }
  };

  return { playNewGame };
};

const controller = gameHandler();
controller.playNewGame();
