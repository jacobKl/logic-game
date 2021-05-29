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
      playersData: [
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
      ],
    });
    return rooms[rooms.length - 1];
  }

  changePlayerData(gameId, playerId, data) {
    rooms[gameId].playersData[playerId] = data;
  }

  getEnemyData(gameId, playerId) {
    let enemyId = 0;
    if (playerId == 2) enemyId = 0;
    if (playerId == 1) enemyId = 1;
    return rooms[gameId].playersData[enemyId];
  }
}

module.exports = {
  RoomsManager: RoomsManager,
};
