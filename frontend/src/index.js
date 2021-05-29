import Main from "./components/Main";
import { io } from "socket.io-client";

global.socket = io("http://localhost:3000");

function init() {
  const container = document.getElementById("root");
  const main = new Main(container);

  socket.emit("join");

  socket.on("joined", (data) => {
    console.log(data);
    socket.on("dataFlow", (data) => {
      const enemyData = data;
      main.updateData(enemyData);
    });
  });
}

init();
