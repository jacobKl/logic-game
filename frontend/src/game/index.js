import Main from "../components/Main";
import { io } from "socket.io-client";

global.socket = io("http://localhost:3000");

function init() {
  const container = document.getElementById("root");
  const main = new Main(container);
  const usernameForm = document.querySelector(".form-popup");
  const usernameInputRef = document.querySelector(".username");
  const buttonRef = document.querySelector(".submit");
  const valid = document.querySelector(".validation");
  let username = "";
  usernameForm.classList.add("block");

  usernameInputRef.addEventListener("input", (e) => {
    username = e.target.value;
  });

  buttonRef.addEventListener("click", () => {
    if (username.length > 3) {
      socket.emit("join", username);
      socket.on("joined", (data) => {
        main.turnCamera();

        socket.on("dataFlow", (data) => {
          main.dataFlowing = true;
          const enemyData = data;
          main.updateData(enemyData);
        });
      });
      usernameForm.classList.remove("block");
    } else {
      valid.innerHTML = "Nick musi mieć co najmniej 3 znaki.";
    }
  });
}

init();