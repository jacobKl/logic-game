import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class ChessPiece {
  constructor(type, color, group, xPos, zPos) {
    this.type = type;
    this.color = color;

    const loader = new GLTFLoader();
    const path = `./src/components/assets/chess/${this.color + this.type}.gltf`;

    loader.load(path, (model) => {
      this.model = model.scene;
      this.model.position.y = 0.55;
      this.model.position.x = xPos;
      this.model.position.z = zPos;

      group.add(this.model);
    });
  }
}