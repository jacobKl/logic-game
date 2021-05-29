const express = require("express");
const app = express();
const socket = require("socket.io");
const session = require("express-session");
const server = app.listen(3000);
const io = socket(server, {
  cors: {
    origin: "http://localhost:8080",
    credentials: true,
  },
});
const { joinRoomHandler } = require("./handlers/joinRoomHandler");
const { changePlayerData } = require("./handlers/changePlayerData");

const sessionMiddleware = session({
  secret: "WFXO1",
  resave: false,
  saveUninitialized: false,
});

app.use(express.static("static"));
app.use(sessionMiddleware);

global.rooms = [];

const connection = (socket) => {
  socket.on("join", joinRoomHandler.bind(socket, io));
  socket.on("changePlayerData", changePlayerData.bind(socket, io));
};

// EXPRESS SESSION AVAILABLE IN SOCKET.IO
// ACCESSIBLE VIA socket.request.session
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

io.on("connection", connection);
