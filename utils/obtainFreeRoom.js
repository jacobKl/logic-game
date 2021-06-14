const { RoomsManager } = require("../components/RoomsManager");

// @var object - room
function obtainFreeRoom() {
  const manager = new RoomsManager();
  const freeRoom = manager.searchForFreeRoom();
  if (freeRoom) {
    return freeRoom;
  } else {
    return manager.createRoom();
  }
}

module.exports = {
  obtainFreeRoom: obtainFreeRoom,
};
