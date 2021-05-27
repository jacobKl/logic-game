const { obtainFreeRoom } = require("../utils/obtainFreeRoom");

function joinRoomHandler(io){
    const socket = this;
    const room = obtainFreeRoom();
    rooms[room.id].inGame++;
    socket.join(room.id)
    socket.request.session.gameId = room.id;
    io.in(room.id).emit("joined", room)
}


module.exports = {
    joinRoomHandler
}