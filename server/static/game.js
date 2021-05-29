const socket = io();

socket.emit("join");

socket.on("joined", (data) => {
  socket.on("dataFlow", (data) => {
    alert("DATA FROM SERVERS EMIT");
  });
});

const button = document.querySelector("#button");

button.addEventListener("click", () => {
  socket.emit("changePlayerData");
});
