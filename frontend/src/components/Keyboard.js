import Config from "./Config";

const KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  w: 87,
  d: 68,
  a: 65,
  s: 83,
};

export default class Keyboard {
  constructor(domElement, modelMesh) {
    this.domElement = domElement;
    this.modelMesh = modelMesh;

    // events
    this.domElement.addEventListener("keydown", (event) => this.onKeyDown(event), false);
    this.domElement.addEventListener("keyup", (event) => this.onKeyUp(event), false);
  }

  onKeyUp(event) {
    switch (event.keyCode) {
      case KEYS.up:
      case KEYS.w:
        Config.moveForward = false;
        break;
    }
  }

  onKeyDown(event) {
    switch (event.keyCode) {
      case KEYS.up:
      case KEYS.w:
        Config.moveForward = true;
        break;
    }
  }
}
