const { obtainFreeRoom } = require("../utils/obtainFreeRoom");
const { getColor } = require("../utils/getColor");

function joinRoomHandler(io, data) {
  const socket = this;
  const room = obtainFreeRoom();

  socket.request.session.playerId = rooms[room.id].inGame;
  socket.request.session.gameId = room.id;
  const gameDataPlayerIndex = socket.request.session.playerId;
  rooms[room.id].usernames[gameDataPlayerIndex] = data;
  rooms[room.id].inGame++;

  const color = getColor(room.id, socket.request.session.playerId);
  rooms[room.id].colors[socket.request.session.playerId] = color;

  socket.join(room.id);
}

module.exports = {
  joinRoomHandler,
};
