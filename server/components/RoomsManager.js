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
      usernames: [],
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

  getEnemyData(gameId, playerId) {
    let enemyId = 0;
    if (playerId == 2) enemyId = 0;
    if (playerId == 1) enemyId = 1;
    const enemyData = { ...rooms[gameId].gameData[enemyId], username: rooms[gameId].usernames[enemyId] };
    return enemyData;
  }
}

module.exports = {
  RoomsManager: RoomsManager,
};
