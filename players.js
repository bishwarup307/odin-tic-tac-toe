import { AVATARS } from "./avatars.js";

const makePlayer = (id, index, name, color, avatar) => {
  let score = 0;

  const incrementScore = () => score++;
  const getScore = () => score;

  const getInfo = () => {
    return { id, index, name, color, avatar };
  };

  const save = () => {
    localStorage.setItem(id, JSON.stringify(getInfo()));
  };

  const editName = (newName) => {
    name = newName;
  };

  const editColor = (newColor) => {
    color = newColor;
  };

  const editAvatar = (newAvatar) => {
    avatar = newAvatar;
  };

  const editPlayer = (attr) => {
    if (attr) {
      if (attr.startsWith("#")) editColor(attr);
      else if (attr.startsWith("<svg")) editAvatar(attr);
      else editName(attr);
      save();
    }
  };

  return { getInfo, editPlayer, getScore, incrementScore };
};

const createPlayers = () => {
  // Try to load the players from cache
  let player1 = JSON.parse(localStorage.getItem("p1"));
  let player2 = JSON.parse(localStorage.getItem("p2"));

  if (player1)
    player1 = makePlayer(
      player1.id,
      player1.index,
      player1.name,
      player1.color,
      player1.avatar
    );
  else
    player1 = makePlayer(
      "p1",
      1,
      "Player 1",
      "#db154a",
      AVATARS.find((item) => item.id === "default-1").svg
    );

  if (player2)
    player2 = makePlayer(
      player2.id,
      player2.index,
      player2.name,
      player2.color,
      player2.avatar
    );
  else
    player2 = makePlayer(
      "p2",
      2,
      "Player 2",
      "#15dbb3",
      AVATARS.find((item) => item.id === "default-2").svg
    );

  return [player1, player2];
};

export default createPlayers;
