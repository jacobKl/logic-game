const express = require("express");
const app = express();
const socket = require("socket.io");
const session = require("express-session");
const server = app.listen(3000);
const io = socket(server);
const { joinRoomHandler } = require("./handlers/joinRoomHandler");
const { changePlayerData } = require("./handlers/changePlayerData");
const { makeMove } = require("./handlers/makeMove");
const { saveToDb } = require("./handlers/saveToDb");
const { Database } = require("./components/Database");
const Datastore = require("nedb");
const DB_1 = new Datastore({
  filename: "db",
  autoload: true,
});
global.DB = new Database(DB_1);

const sessionMiddleware = session({
  secret: "WFXO1",
  resave: true,
  saveUninitialized: true,
});

app.use(express.static("static"));
app.use(sessionMiddleware);
app.set("view engine", "ejs");

global.rooms = [];

app.get("/", (req, res) => {
  res.render("lobby");
});

app.get("/history", (req, res) => {
  DB.getAllGames().then((games) => {
    games.sort((a, b) => new Date(b.ago) - new Date(a.ago));
    res.render("analize", { games: games });
  });
});

app.get("/getGameData", (req, res) => {
  const gameId = req.query.gameId;
  DB.getGameById(gameId).then((game) => {
    res.end(JSON.stringify(game));
  });
});

const connection = (socket) => {
  // GAME HANDLERS
  socket.on("join", joinRoomHandler.bind(socket, io));
  socket.on("changePlayerData", changePlayerData.bind(socket, io));
  socket.on("makeMove", makeMove.bind(socket, io));
  socket.on("saveToDb", saveToDb.bind(socket, io));
};

// EXPRESS SESSION AVAILABLE IN SOCKET.IO
// ACCESSIBLE VIA socket.request.session
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

io.on("connection", connection);
