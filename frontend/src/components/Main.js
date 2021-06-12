import { Scene, Vector3, DirectionalLight, Clock, AxesHelper } from "three";
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
    this.axes = new AxesHelper(500);
    this.prevAnim = undefined;
    this.dataFlowing = false;
    this.mouse = new Mouse();
    this.table = new Table(this.scene);
    this.yourColor = "";

    const firstModel = this.player.loadModel("./src/components/assets/playerModel/scene.gltf");
    const secondModel = this.enemy.loadModel("./src/components/assets/playerModel/scene.gltf");
    Promise.all([firstModel, secondModel]).then(() => {
      this.player.object.position.set(0, 1, 50);
      this.enemy.object.position.set(-100, -100, -100);
      this.init();
      this.render();
    });
  }

  turnCamera() {
    this.fps = new FirstPersonControls(this.camera);
    this.fps.lookSpeed = 0.2;
    this.fps.constrainVertical = true;
    this.fps.verticalMax = (Math.PI * 7) / 8;
    this.fps.verticalMin = Math.PI / 8;
    this.fpsAdded = true;
    this.pauseOverlay = new PauseOverlay(this.fps);
  }

  init() {
    this.scene.add(this.light);

    // MOVE DETECTION
    document.addEventListener("click", (e) => {
      if (this.yourColor == this.nowPlaying) {
        this.chessboard.moveProxy(this.mouse, this.camera);
      }
    });

    // SETTLE PLAYER
    this.scene.add(this.player.object);
    this.player.animate("Armature|Idle");
    // SETTLE "ENEMY"
    this.scene.add(this.enemy.object);
    this.enemy.animate("Armature|Idle");
  }

  updateData(enemyData, yourData) {
    // ENEMY IN X,Y,Z POS
    const { x, y, z, lookAt, animation, username, color: enemyColor } = enemyData;
    const { color, turn } = yourData;
    this.enemy.object.position.set(x, y, z);
    const vector = new Vector3(lookAt.x, 0, lookAt.z);
    this.enemy.object.lookAt(vector);
    if (this.prevAnim != animation && this.prevAnim) {
      this.enemy.animate(animation);
      this.enemy.stopAnimate(this.prevAnim);
    }
    this.prevAnim = animation;
    this.nowPlaying = turn;
    if (!this.yourColor) {
      this.enemyColor = enemyColor;
      this.enemyUsername = username;
      this.yourColor = color;
      if (this.yourColor == "white") this.player.object.position.set(0, 1, 75);
      else {
        this.player.object.position.set(0, 1, -75);
        this.player.object.lookAt(this.enemy.object.position);
      }
    }
  }

  updateChess(moves, turn) {
    this.nowPlaying = turn;
    const lastMove = moves[moves.length - 1];
    const { from, to } = lastMove;
    this.chessboard.fromSquare = from;
    this.chessboard.toSquare = to;
    this.chessboard.moveProxy(this.mouse, this.camera);
  }

  render() {
    const delta = this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);

    if (this.fpsAdded) {
      this.fps.update(delta);
    }
    this.player.updateIntersects(this.room.getRoomObstacles(), this.table.colision);
    this.player.moving(this.camera);
    if (this.dataFlowing) {
      this.player.updateData();
    }

    // ANIMS
    this.player.update(delta);
    this.enemy.update(delta);

    this.checkGameStatus();

    requestAnimationFrame(this.render.bind(this));
  }

  // TODO
  // WHITE COLOR IS SENDING GAME RESULT IN ORDER TO SAVE RECORD ONLY ONCE - SHITTY FIX
  checkGameStatus() {
    if (this.chessboard.gameEnded && this.commitedToDb == undefined && this.yourColor == "white") {
      const game = this.chessboard.storeInDb;

      if (this.chessboard.storeInDb.won == this.yourColor) {
        game.wonUsername = this.yourUsername;
        game.lostUsername = this.enemyUsername;
      } else {
        game.wonUsername = this.enemyUsername;
        game.lostUsername = this.yourUsername;
      }
      socket.emit("saveToDb", game);
      this.commitedToDb = true;
    }
  }
}
