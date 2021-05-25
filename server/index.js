const express = require('express');
const app = express();
const socket = require('socket.io');

app.use(express.static("static"))

const server = app.listen(3000, () => {
    console.log("listening on 3000")
})

const io = socket(server);

io.on('connection', () => {
    console.log("Client connected")
})