import { AVATARS } from "./avatars.js";
import createPlayers from "./players.js";
import gameController from "./game.js";

const BOARD_DIMENSION = 3;

const createPlayerCards = function (player) {
  // const { id, index, name, color, avatar } = player

  const card = document.createElement("div");
  card.classList.add("card");
  card.classList.add("flex");
  card.classList.add("gap1");
  card.id = player.getInfo().id;

  const avatar = document.createElement("div");
  avatar.classList.add("avatar");
  avatar.innerHTML = player.getInfo().avatar;

  const playerName = document.createElement("input");
  playerName.type = "text";
  playerName.value = player.getInfo().name;
  playerName.classList.add("player-name");

  playerName.addEventListener("change", () => {
    console.log(`${player.getInfo().name} is now known as ${playerName.value}`);
    player.editPlayer(playerName.value);
  });

  const playerColor = document.createElement("div");
  playerColor.classList.add("player-color");

  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.value = player.getInfo().color;
  colorPicker.classList.add("color-picker");
  playerColor.appendChild(colorPicker);

  colorPicker.addEventListener("change", () => {
    console.log(
      `${player.getInfo().name} chose a new color ${colorPicker.value}`
    );
    player.editPlayer(colorPicker.value);
  });

  card.appendChild(avatar);
  card.appendChild(playerName);
  card.appendChild(playerColor);

  /*
  Dialog to change the avatar
  */
  const dialog = document.createElement("dialog");
  dialog.classList.add("pick-avatar");

  const chooseAvatar = document.createElement("div");
  chooseAvatar.classList.add("grid");
  chooseAvatar.classList.add("dialog-grid");
  AVATARS.forEach((avt) => {
    let optionWrapper = document.createElement("div");
    optionWrapper.classList.add("option-wrapper");
    optionWrapper.id = avt.id;
    let option = document.createElement("div");
    option.classList.add("dialog-choice");
    option.innerHTML = avt.svg;
    optionWrapper.appendChild(option);
    chooseAvatar.appendChild(optionWrapper);
  });
  dialog.appendChild(chooseAvatar);
  card.appendChild(dialog);

  const parent = document.querySelector(".info");
  parent.appendChild(card);

  avatar.addEventListener("click", () => {
    dialog.showModal();
  });
  /*
  We are returning the dialog, the color picker and the avatar container to attach
  eventlisteners to them later. This is because, we want to render the
  board again whenever a player changes either color or the avatar. Also, we want to
  close the dialog on selection of an avatar. The viewController will be responsible
  for handling these events.
  */
  return { dialog, avatar, chooseAvatar, colorPicker };
};

const viewController = () => {
  let controller;
  let player1;
  let player2;

  const load = () => {
    [player1, player2] = createPlayers(); // Create new players or load them from the cache

    const p1Widgets = createPlayerCards(player1); // Render the player1 widgets - avatar, name and color
    const p2Widgets = createPlayerCards(player2); // Render the player2 widgets - avatar, name and color

    newGame();

    p1Widgets.chooseAvatar.addEventListener("click", (e) => {
      handleChangeAvatar(e, player1, p1Widgets.avatar);
      p1Widgets.dialog.close();
    });

    p1Widgets.colorPicker.addEventListener("change", (e) => {
      renderBoard();
    });

    p2Widgets.chooseAvatar.addEventListener("click", (e) => {
      handleChangeAvatar(e, player2, p2Widgets.avatar);
      p2Widgets.dialog.close();
    });

    p2Widgets.colorPicker.addEventListener("change", (e) => {
      renderBoard();
    });
  };

  const newGame = () => {
    controller = gameController(player1, player2, BOARD_DIMENSION); // Get a new board controller
    controller.startGame(); // start a new game
    getBlankBoard();
  };

  const getBlankBoard = () => {
    const boardDiv = document.querySelector(".board");

    // Remove everything from before for a new game;
    while (boardDiv.firstChild) {
      boardDiv.removeChild(boardDiv.firstChild);
    }

    for (let i = 0; i < BOARD_DIMENSION * BOARD_DIMENSION; i++) {
      const cell = document.createElement("div");
      cell.classList.add("board-cell");
      cell.id = `cell-${i}`;
      boardDiv.appendChild(cell);

      cell.addEventListener("click", (e) => {
        const result = handleUserInput(e);
        handleResult(result);
      });
    }

    /* 
      Game over screen (hidden initially)
    */
    const curtain = document.createElement("div");
    curtain.classList.add("curtain");

    const celebration = document.createElement("img");
    celebration.src = "./assets/images/celebration2.gif";
    celebration.alt = "celebration";
    celebration.classList.add("celebration");
    const winningPlayer = document.createElement("p");
    winningPlayer.classList.add("gameover-message");

    const btnNewGame = document.createElement("button");
    btnNewGame.classList.add("new-game");
    btnNewGame.textContent = "New Game";

    btnNewGame.addEventListener("click", newGame);

    curtain.appendChild(celebration);
    curtain.appendChild(winningPlayer);
    curtain.appendChild(btnNewGame);

    boardDiv.appendChild(curtain);
  };

  const renderBoard = () => {
    const boardState = controller.getBoardState();
    for (let i = 0; i < BOARD_DIMENSION * BOARD_DIMENSION; i++) {
      /* 
      If the board cell is occupied fill it with the respective
      player's avatar
       */
      if (boardState[i].value > 0) {
        const cell = document.querySelector(`#cell-${i}`);
        cell.innerHTML =
          boardState[i].value === 1
            ? player1.getInfo().avatar
            : player2.getInfo().avatar;
        cell.firstChild.style.fill =
          boardState[i].value === 1
            ? player1.getInfo().color
            : player2.getInfo().color;
        cell.firstChild.style.stroke =
          boardState[i].value === 1
            ? player1.getInfo().color
            : player2.getInfo().color;
        cell.classList.add("occupied");
      }
    }
  };

  const handleUserInput = (e) => {
    let cellIndex = Number(e.target.closest(".board-cell").id.split("-")[1]);
    const outcome = controller.playNextTurn(cellIndex);
    renderBoard();
    return outcome;
  };

  const handleResult = (result) => {
    if (result.result === 0 && result.remaining > 0) return;
    else {
      // disable board cells for click
      document
        .querySelectorAll(".board-cell")
        .forEach((cell) => cell.classList.add("disabled"));
    }
    // let animationDelay = 0;

    for (let cellIndex of result.streak) {
      const winningCell = document.querySelector(`#cell-${cellIndex}`);
      setTimeout(() => winningCell.classList.add("win"), `{animationDelay}`);
      // animationDelay += 3000;
    }

    const curtain = document.querySelector(".curtain");
    const gameOverMessage = document.querySelector(".gameover-message");

    let message;
    if (result.result == 0) message = "It's a tie!";
    else if (result.result === 1) message = `${player1.getInfo().name} won!`;
    else if (result.result === 2) message = `${player2.getInfo().name} won!`;

    gameOverMessage.textContent = message;
    setTimeout(() => (curtain.style.display = "flex"), "1500");
  };

  const handleChangeAvatar = (e, player, avatar) => {
    const newAvatar = AVATARS.find(
      (item) => item.id === e.target.closest(".option-wrapper").id
    ).svg;
    player.editPlayer(newAvatar);
    avatar.innerHTML = newAvatar;
    renderBoard();
  };

  return { load };
};

const view = viewController();
view.load();

// const gameHandler = (firstPlayer, secondPlayer) => {
//   let newBoard;
//   let activePlayer;
//   let gameOver = false;

//   const makeBoard = () => {
//     const boardDiv = document.querySelector(".board");

//     // Remove everything from before for a new game;
//     while (boardDiv.firstChild) {
//       boardDiv.removeChild(boardDiv.firstChild);
//     }

//     const curtain = document.createElement("div");
//     curtain.classList.add("curtain");

//     // const gameOverMessage = document.createElement("p");
//     // gameOverMessage.classList.add("gameover-message");
//     // gameOverMessage.textContent = "game over";

//     // const winnerDiv = document.createElement("div");
//     const celebration = document.createElement("img");
//     celebration.src = "./assets/images/celebration.gif";
//     celebration.alt = "celebration";
//     celebration.classList.add("celebration");
//     const winningPlayer = document.createElement("p");
//     winningPlayer.classList.add("gameover-message");

//     const btnNewGame = document.createElement("button");
//     btnNewGame.classList.add("new-game");
//     btnNewGame.textContent = "New Game";

//     btnNewGame.addEventListener("click", startNewGame);

//     // winnerDiv.appendChild(celebration);
//     // winnerDiv.appendChild(winningPlayer);

//     curtain.appendChild(celebration);
//     curtain.appendChild(winningPlayer);
//     curtain.appendChild(btnNewGame);

//     boardDiv.appendChild(curtain);

//     for (let i = 0; i < newBoard.dimension * newBoard.dimension; i++) {
//       const cell = document.createElement("div");
//       cell.classList.add("board-cell");
//       cell.id = `cell-${i}`;
//       boardDiv.appendChild(cell);

//       cell.addEventListener("click", (event) => {
//         if (!gameOver && newBoard.getAvailableCells().length > 0) {
//           let cellIndex = Number(
//             event.target.closest(".board-cell").id.split("-")[1]
//           );
//           outcome = playNextTurn(cellIndex);
//           gameOver = outcome > 0;

//           if (outcome === 0) console.log("It's a TIE");
//           else {
//             const winner = outcome === 1 ? firstPlayer : secondPlayer;
//             console.log(`WoHoo! ${winner.name} wins this round.`);
//             winningPlayer.textContent = `${winner.name} won!`;
//             setTimeout(() => (curtain.style.display = "flex"), "700");
//           }

//           switchPlayer();
//         } else {
//           return false;
//         }
//       });
//     }
//   };

//   const initializeGame = () => {
//     activePlayer = firstPlayer;
//     newBoard = gameBoard(3, { 1: firstPlayer.marker, 2: secondPlayer.marker });
//     makeBoard();
//     newBoard.printBoard();
//   };

//   const switchPlayer = () => {
//     activePlayer = activePlayer === firstPlayer ? secondPlayer : firstPlayer;
//   };

//   const askChoice = (cells) => {
//     const x = prompt(
//       `It's ${activePlayer.name}'s turn. Choose a cell from the list: ${cells}`
//     );
//     if (!cells.includes(Number(x))) throw new Error("Invalid choice made");
//     return Number(x);
//   };

//   const playNextTurn = (playerChoice) => {
//     // const playerChoice = askChoice(newBoard.getAvailableCells());
//     newBoard.mark(playerChoice, activePlayer.index);
//     newBoard.printBoard();
//     outcome = newBoard.evaluateState();
//     return outcome;
//   };

//   const playNewGame = () => {
//     initializeGame();
//     // let gameOver = false;

//     // while (!gameOver && newBoard.getAvailableCells().length > 0) {
//     //   const roundResult = playNextTurn();
//     //   gameOver = roundResult > 0;
//     //   switchPlayer();
//     // }

//     // if (gameOver === 0) console.log("It's a TIE");
//     // else {
//     //   const winner = gameOver === 1 ? firstPlayer : secondPlayer;
//     //   console.log(`WoHoo! ${winner.name} wins this round.`);
//     // }
//   };

//   return { playNewGame };
// };

// // const controller = gameHandler();
// // controller.playNewGame();

// // const player1 = makePlayer("p1", 1, "Player 1", "#db154a", DEFAULT_MARKER_1);
// // const player2 = makePlayer("p2", 2, "Player 2", "#15dbb3", DEFAULT_MARKER_2);

// // localStorage.setItem(player1.id, JSON.stringify(player1));
// // localStorage.setItem(player2.id, JSON.stringify(player2));

// let [player1, player2] = createPlayers();
// createPlayerCards(player1);
// createPlayerCards(player2);

// const startNewGame = () => {
//   const controller = gameHandler(player1, player2);
//   controller.playNewGame();
// };

// startNewGame();

// // const gb = gameBoard();
// // gb.makeBoard();
