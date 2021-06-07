// function init() {
//   const usernameRef = document.querySelector(".username");
//   const submitRef = document.querySelector(".submit");
//   let nickname = "";

//   usernameRef.addEventListener("input", (e) => {
//     nickname = e.target.value;
//   });

//   submitRef.addEventListener("click", () => {
//     socket.emit("join", nickname);
//   });

//   socket.on("joined", (data) => {
//     document.location.href = "/game";
//   });
// }

// init();
