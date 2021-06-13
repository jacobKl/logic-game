import { Scene, DirectionalLight, AxesHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Renderer from "./Renderer";
import Camera from "./Camera";
import Keyboard from "./Keyboard";
import ChessBoard from "./Chessboard";

export default class MainAnalize {
  constructor(container) {
    this.container = container;
    this.scene = new Scene();
    this.light = new DirectionalLight(0xffffff);
    this.renderer = new Renderer(container);
    this.camera = new Camera(90, window.screen.width, window.screen.height);
    this.aHelper = new AxesHelper(500);

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
        this.chessboard = new ChessBoard(this.scene, this.chessData.fen, undefined, true);
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
}
