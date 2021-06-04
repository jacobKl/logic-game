import Config from "./Config";

export default class Mouse {
  constructor(object, dom) {
    this.object = object;
    this.domEntity = dom;

    this.init();
  }

  init() {
    this.domEntity.addEventListener("mousemove", (e) => {
      this.clientWidth = this.domEntity.innerWidth;
      this.clientHeight = this.domEntity.innerHeight;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      // FROM LEFT
      this.xPercentage = (this.mouseX / this.clientWidth) * 100;
      // FROM TOP
      this.yPercentage = (this.mouseY / this.clientHeight) * 100;

      if (this.xPercentage < 48) {
        Config.rotateLeft = true;
      } else if (this.xPercentage > 52) {
        Config.rotateRight = true;
      } else {
        Config.rotateLeft = false;
        Config.rotateRight = false;
      }

      if (this.yPercentage < 48) {
        Config.rotateUp = true;
      } else if (this.yPercentage > 52) {
        Config.rotateDown = true;
      } else {
        Config.rotateUp = false;
        Config.rotateDown = false;
      }
    });
  }

  moving(mesh, camera) {
    const player = mesh.object;
    if (Config.rotateLeft) {
      camera.rotation.y -= 0.01;
      player.rotation.y += 0.01;
    }

    if (Config.rotateRight) {
      camera.rotation.y += 0.01;
      player.rotation.y -= 0.01;
    }

    if (Config.rotateUp && camera.rotation.x > -3.5) {
      camera.rotation.x -= 0.01;
    }

    if (Config.rotateDown && camera.rotation.x < -2) {
      camera.rotation.x += 0.01;
    }
  }
}
