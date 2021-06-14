class RoomsManager {
  searchForFreeRoom() {
    let freeRoom;
    rooms.forEach((room, j) => {
      if (room.inGame < 2) {
        freeRoom = room;
      }
    });
    return freeRoom;
  }

  createRoom() {
    rooms.push({
      id: rooms.length,
      inGame: 0,
      moves: [],
      turn: "white",
      usernames: [],
      colors: [],
      gameData: [
        { x: 0, y: 0, z: 0, lookAt: { x: 0, y: 0, z: 0 }, animation: "" },
        { x: 0, y: 0, z: 0, lookAt: { x: 0, y: 0, z: 0 }, animation: "" },
      ],
    });
    return rooms[rooms.length - 1];
  }

  changePlayerData(gameId, playerId, data) {
    rooms[gameId].gameData[playerId] = data;
  }

  getGameData(gameId, playerId) {
    let enemyId = 0;
    if (playerId == 2) enemyId = 0;
    if (playerId == 1) enemyId = 1;
    const enemyData = { ...rooms[gameId].gameData[enemyId], username: rooms[gameId].usernames[enemyId] };
    const yourData = { color: rooms[gameId].colors[playerId], turn: rooms[gameId].turn };
    const moves = rooms[gameId].moves;
    return { enemyData, yourData, moves };
  }
}

module.exports = {
  RoomsManager,
};
