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
    rooms.push({ id: rooms.length, inGame: 0 });
    return rooms[rooms.length - 1];
  }
}

module.exports = {
  RoomsManager: RoomsManager,
};
