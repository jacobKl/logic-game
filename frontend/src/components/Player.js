import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Config from "./Config";
export default class Player {
  constructor() {
    this.loader = new GLTFLoader();
  }

  updateData() {
    socket.emit("changePlayerData", this.object.position);
  }

  moving(camera) {
    if (this.object) {
      const { x, y, z } = this.object.position;

      if (Config.moveLeft) {
        this.object.translateX(3);
        camera.position.set(x, y, z + 10);
      }
      if (Config.moveRight) {
        this.object.translateX(-3);
        camera.position.set(x, y, z + 10);
      }
      if (Config.moveForward) {
        this.object.translateZ(3);
        camera.position.set(x, y, z + 10);
      }
      if (Config.moveBackward) {
        this.object.translateZ(-3);
        camera.position.set(x, y, z + 10);
      }

      if (Config.moveLeft || Config.moveRight || Config.moveForward || Config.moveBackward) {
        this.updateData();
      }
    }
  }

  loadModel(path) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (model) => {
          this.object = model.scene;
          resolve(this.object);
        },
        () => {},
        () => {
          reject(new Error("Error while loading model 1"));
        }
      );
    });
  }
}
