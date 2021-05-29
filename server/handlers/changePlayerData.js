const { RoomsManager } = require("../components/RoomsManager");

const manager = new RoomsManager();

function changePlayerData(io, data) {
  const socket = this;
  const gameId = socket.request.session.gameId;
  const playerId = socket.request.session.playerId;
  manager.changePlayerData(gameId, playerId, data);
  const response = manager.getEnemyData(gameId, playerId);
  socket.broadcast.to(gameId).emit("dataFlow", response);
}

module.exports = {
  changePlayerData,
};
