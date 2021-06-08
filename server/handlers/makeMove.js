function makeMove(io, data) {
  const socket = this;

  const { move, turn } = data;

  const gameId = socket.request.session.gameId;

  let newTurn = "";
  if (turn == "b") {
    newTurn = "black";
  } else {
    newTurn = "white";
  }

  rooms[gameId].turn = newTurn;
  rooms[gameId].moves.push(move);

  socket.broadcast.to(gameId).emit("chessChange", { moves: rooms[gameId].moves, turn: rooms[gameId].turn });
}

module.exports = {
  makeMove,
};
