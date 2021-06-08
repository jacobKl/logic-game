import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class ChessPiece {
  constructor(type, color, group, xPos, zPos) {
    this.type = type;
    this.color = color;
    let x = 8 - (xPos + 4.5);
    let z = 8 - (zPos + 4.5);
    let file;
    switch (x) {
      case 7: file = "a"; break;
      case 6: file = "b"; break;
      case 5: file = "c"; break;
      case 4: file = "d"; break;
      case 3: file = "e"; break;
      case 2: file = "f"; break;
      case 1: file = "g"; break;
      case 0: file = "h"; break;
    }

    let square = file + (z + 1);
    this.square = square;

    const loader = new GLTFLoader();
    const path = `./src/components/assets/chess/${this.color + this.type}.gltf`;

    loader.load(path, (model) => {
      this.model = model.scene;
      this.model.position.y = 0.55;
      this.setPosition(square);
      group.add(this.model);
    });
  }

  update() {
    if (this.square != null)
      this.setPosition(this.square);
  }

  setPosition(square) {
    let file = square[0];
    let rank = parseInt(square[1]);

    this.model.position.z = 8 - rank - 3.5;
    switch (file) {
      case "a": this.model.position.x = 0 - 3.5; break;
      case "b": this.model.position.x = 1 - 3.5; break;
      case "c": this.model.position.x = 2 - 3.5; break;
      case "d": this.model.position.x = 3 - 3.5; break;
      case "e": this.model.position.x = 4 - 3.5; break;
      case "f": this.model.position.x = 5 - 3.5; break;
      case "g": this.model.position.x = 6 - 3.5; break;
      case "h": this.model.position.x = 7 - 3.5; break;
    }
  }

  hide() {
    this.model.visible = false;
  }
}
