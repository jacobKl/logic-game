import { Scene, DirectionalLight, AxesHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Renderer from "./Renderer";
import Camera from "./Camera";
import ChessBoard from "./Chessboard";

export default class MainAnalize {
  constructor(container) {
    this.container = container;
    this.scene = new Scene();
    this.light = new DirectionalLight(0xffffff);
    this.renderer = new Renderer(container);
    this.camera = new Camera(90, window.screen.width, window.screen.height);
    this.aHelper = new AxesHelper(500);
    this.history = [];
    this.historyIndex = null;

    this.init();
    this.render();
  }

  init() {
    this.camera.position.set(15, 45, 10);
    this.scene.add(this.light);
    new OrbitControls(this.camera, this.renderer.domElement);

    const id = this.getGameId();

    fetch(`http://localhost:3000/getGameData?gameId=${id}`, {
      mode: "cors",
    })
      .then((res) => res.json())
      .then((res) => {
        this.chessData = res;
        console.log(this.chessData);
        this.chessboard = new ChessBoard(this.scene, undefined, true, this.chessData.pgn);
        this.history = this.chessData.moves;
        this.historyIndex = this.history.length - 1;
        this.startAnalysis();
      });
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }

  getGameId() {
    const url = new URLSearchParams(window.location.search);
    const gameId = url.get("gameId");
    return gameId;
  }

  startAnalysis() {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          console.log(this.history[this.historyIndex]);
          this.undoMove(this.historyIndex);
          break;

        case "ArrowRight":
          console.log(this.history[this.historyIndex]);
          this.forwardMove(this.historyIndex);
          break;
      }
    });
  }

  undoMove(lastIndex) {
    if (this.historyIndex >= 0) this.historyIndex--;
    if (lastIndex != this.historyIndex) {
      let lastMove = this.history[this.historyIndex + 1];
      if (lastMove.san == "O-O")
        this.chessboard.undoMove(true, false);
      else if (lastMove.san == "O-O-O")
        this.chessboard.undoMove(false, true);
      else
        this.chessboard.undoMove(false, false);

    }
  }

  forwardMove(lastIndex) {
    if (this.historyIndex < this.history.length - 1) this.historyIndex++;
    if (lastIndex != this.historyIndex) {
      const { from, to } = this.history[this.historyIndex];
      this.chessboard.fromSquare = from;
      this.chessboard.toSquare = to;
      this.chessboard.moveProxy(this.mouse, this.camera);
      this.chessboard.updatePieces();
    }
  }
}
