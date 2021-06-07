import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class Table {
  constructor(scene) {
    this.scene = scene;

    const loader = new GLTFLoader();
    const path = `./src/components/assets/room/table/table.gltf`;

    loader.load(path, (model) => {
      this.model = model.scene;
      this.model.position.y = 0.55;
      this.model.scale.set(0.4, 0.4, 0.4);
      this.scene.add(this.model);
    });
  }
};