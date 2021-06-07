import { GridHelper, Scene, Vector3, AmbientLight, DirectionalLight, Clock, AxesHelper, CameraHelper } from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import Renderer from "./Renderer";
import Camera from "./Camera";
import Keyboard from "./Keyboard";
import Player from "./Player";
import ChessBoard from "./Chessboard";
import Room from "./Room";
import PauseOverlay from "./PauseOverlay";
import Table from "./Table";
import Mouse from "./Mouse";

export default class Main {
  constructor(container) {
    this.container = container;
    this.scene = new Scene();
    this.light = new DirectionalLight(0xffffff);
    this.renderer = new Renderer(container);
    this.camera = new Camera(90, window.screen.width, window.screen.height);
    this.chessboard = new ChessBoard(this.scene);
    this.player = new Player();
    this.enemy = new Player();
    this.room = new Room(this.scene);
    this.clock = new Clock();
    this.keyboard = new Keyboard(window, this.player);
    this.mouse = new Mouse();
    this.table = new Table(this.scene);
    this.fps = new FirstPersonControls(this.camera, this.renderer.domElement);
    this.fps.lookSpeed = 0.3;
    this.fps.constrainVertical = true;
    this.fps.verticalMax = Math.PI * 7 / 8;
    this.fps.verticalMin = Math.PI / 8;
    this.pauseOverlay = new PauseOverlay(this.fps);
    this.prevAnim = undefined;

    const firstModel = this.player.loadModel("./src/components/assets/playerModel/scene.gltf");
    const secondModel = this.enemy.loadModel("./src/components/assets/playerModel/scene.gltf");
    Promise.all([firstModel, secondModel]).then(() => {
      this.init();
      this.render();
    });
  }

  init() {
    this.scene.add(this.light);

    // MOVE DETECTION
    document.addEventListener("click", (e) => {
      this.chessboard.moveProxy(this.mouse, this.camera);
    });

    // SETTLE PLAYER
    this.scene.add(this.player.object);
    this.player.object.position.set(0, 1, 75);
    this.player.animate("Armature|Idle");
    // SETTLE "ENEMY"
    this.scene.add(this.enemy.object);
    this.enemy.object.position.set(0, 1, -75);
    this.enemy.animate("Armature|Idle");
  }

  updateData(data) {
    // ENEMY IN X,Y,Z POS
    const { x, y, z, lookAt, animation } = data;
    this.enemy.object.position.set(x, y, z);
    const vector = new Vector3(lookAt.x, 30, lookAt.z);
    this.enemy.object.lookAt(vector);
    if (this.prevAnim != animation && this.prevAnim) {
      this.enemy.animate(animation);
      this.enemy.stopAnimate(this.prevAnim);
    }
    this.prevAnim = animation;
  }

  render() {
    const delta = this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);

    this.fps.update(delta);

    this.player.updateIntersects(this.camera, this.room.getRoomObstacles());
    this.player.moving(this.camera);
    this.player.updateData();
    this.player.update(delta);

    this.enemy.update(delta);

    requestAnimationFrame(this.render.bind(this));
  }
}
