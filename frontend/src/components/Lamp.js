import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { SpotLight } from "three";

export default class Lamp {
  constructor(scene) {
    this.scene = scene;

    const loader = new GLTFLoader();
    const path = `./src/components/assets/room/lamp/scene.gltf`;

    loader.load(path, (model) => {
      this.model = model.scene;
      this.model.scale.set(20, 20, 20);
      this.model.position.set(0, 10, 5);
      this.scene.add(this.model);
      this.model.traverse((child) => {
        if (child.isMesh) {
          child.receiveShadow = true;
        }
      });

      this.setLight();
    });
  }

  setLight() {
    this.light = new SpotLight(0xffffee, 0.9, 50, Math.PI / 5);
    this.scene.add(this.light);
    this.light.position.set(0, 45, 0);
  }
}
