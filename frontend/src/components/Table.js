import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Box3, Mesh, BoxGeometry, MeshBasicMaterial } from "three";

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
      this.model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
      this.setBoundingBox();
    });
  }

  setBoundingBox() {
    const boundingBox = new Box3().setFromObject(this.model);
    const size = boundingBox.getSize();
    const { x, y, z } = size;
    this.colision = new Mesh(new BoxGeometry(x, 100, z), new MeshBasicMaterial({ color: 0x00ff00, visible: false }));
    this.colision.gameType = "wall";
    this.scene.add(this.colision);
  }
}
