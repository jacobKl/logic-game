// @gameId - if room isnt created by current player

function getColor(gameId) {
  const colors = ["white", "black"];

  const colorsInRoom = rooms[gameId].colors;

  if (!colorsInRoom.length) {
    return colors[Math.round(Math.random())];
  } else {
    const alreadyExisting = colorsInRoom[0];
    if (alreadyExisting == "white") {
      return "black";
    } else {
      return "white";
    }
  }
}

module.exports = {
  getColor,
};
