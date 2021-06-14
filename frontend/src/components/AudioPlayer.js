import { AudioLoader } from "three";

export default class AudioPlayer {
  constructor(path) {
    this.loader = new AudioLoader();

    this.load(path);
  }

  load(path) {
    this.loader.load(path, (buffer) => {
      this.sound.setBuffer(sound);
      this.sound.setVolume(0.5);
    });
  }

  playSound() {
    this.sound.play();
  }
}
