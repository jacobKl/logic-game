function changePlayerData(io) {
  const socket = this;
  const gameId = socket.request.session.gameId;
  io.to(gameId).emit("receiveData");
}

module.exports = {
  changePlayerData,
};
