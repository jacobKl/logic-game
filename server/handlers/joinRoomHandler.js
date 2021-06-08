const { obtainFreeRoom } = require("../utils/obtainFreeRoom");

function joinRoomHandler(io, data) {
  const socket = this;
  const room = obtainFreeRoom();
  socket.request.session.playerId = rooms[room.id].inGame;
  socket.request.session.gameId = room.id;
  const gameDataPlayerIndex = socket.request.session.playerId;
  rooms[room.id].usernames[gameDataPlayerIndex] = data;
  rooms[room.id].inGame++;
  socket.join(room.id);
  console.log(rooms[room.id]);
  io.in(room.id).emit("joined", room);
}

module.exports = {
  joinRoomHandler,
};
