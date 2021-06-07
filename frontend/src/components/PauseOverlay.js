import Config from "./Config";

export default class PauseOverlay {
  constructor(fps) {
    this.locked = false;
    this.overlayRef = document.querySelector(".pause");
    this.keycode = 27;
    this.controls = fps;
    this.init();
  }

  init() {
    document.addEventListener("keydown", (e) => {
      console.log(e.keyCode);
      if (e.keyCode == this.keycode) {
        if (this.locked) {
          Config.locked = false;
          this.locked = false;
          this.controls.enabled = true;
        } else {
          Config.locked = true;
          this.locked = true;
          this.controls.enabled = false;
        }

        this.overlayRef.classList.toggle("block");
      }
    });
  }
}
