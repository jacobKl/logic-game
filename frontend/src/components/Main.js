import { GridHelper, Scene, AmbientLight, Vector3 } from "three";
import Renderer from "./Renderer";
import Camera from "./Camera";
import Keyboard from "./Keyboard";
import Player from "./Player";
import ChessBoard from "./Chessboard";

export default class Main {
  constructor(container) {
    // Constructors only.
    this.gridHelper = new GridHelper(1000, 10);
    this.container = container;
    this.scene = new Scene();
    this.light = new AmbientLight(0xffffff);
    this.renderer = new Renderer(container);
    this.camera = new Camera(90, window.screen.width, window.screen.height);
    this.gridHelper = new GridHelper(5000);
    this.player = new Player();
    this.enemy = new Player();
    this.keyboard = new Keyboard(window, this.player);
    this.chessboard = new ChessBoard(this.scene);

    const firstModel = this.player.loadModel("./src/components/assets/playerModel/scene.gltf");
    const secondModel = this.enemy.loadModel("./src/components/assets/playerModel/scene.gltf");
    Promise.all([firstModel, secondModel]).then(() => {
      this.init();
      this.render();
    });
  }

  init() {
    this.scene.add(this.light);
    this.scene.add(this.gridHelper);
    // SETTLE PLAYER
    this.scene.add(this.player.object);
    this.player.object.position.set(0, 10, 0);

    // SETTLE "ENEMY"
    this.scene.add(this.enemy.object);
    this.enemy.object.position.set(0, 10, 30);

    // INITIAL CAM POSITION
    this.camera.position.set(0, 10, 10);
    this.camera.lookAt(new Vector3(0, 10, 100));
  }

  updateData(data) {
    // ENEMY IN X,Y,Z POS
    const { x, y, z } = data;
    this.enemy.object.position.set(x, y, z);
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    this.player.moving(this.camera);

    requestAnimationFrame(this.render.bind(this));
  }
}
