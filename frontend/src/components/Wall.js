import { DoubleSide, Mesh, MeshPhongMaterial, PlaneGeometry, RepeatWrapping, TextureLoader } from "three";
import wallTexture from "./assets/room/wallTexture.jpg";
import floorTexture from "./assets/room/floorTexture.jpg";

export default class Wall extends Mesh {
  constructor(scene, posX, posZ, isFloor) {
    const loader = new TextureLoader();
    let texture;
    if (isFloor) texture = loader.load(floorTexture);
    else texture = loader.load(wallTexture);

    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(4, 1);

    let geometry;
    if (isFloor) geometry = new PlaneGeometry(200, 200);
    else geometry = new PlaneGeometry(200, 75);
    let material = new MeshPhongMaterial({
      side: DoubleSide,
      map: texture,
    });

    super(geometry, material);
    this.receiveShadow = true;
    if (posX != 0) {
      this.rotation.y = Math.PI / 2;
    }
    this.position.set(posX, 0, posZ);

    this.gameType = "wall";

    if (isFloor) {
      this.rotation.x = Math.PI / 2;
      this.position.set(posX, -37.5, posZ);
      this.gameType = "floor";
    }

    scene.add(this);
  }
}
