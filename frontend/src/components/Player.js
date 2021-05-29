import { Mesh } from "three";

export default class Player {
  constructor(geometry, material) {
    this.geometry = geometry;
    this.material = material;
    this.object = new Mesh(this.geometry, this.material);
  }

  updateData() {
    socket.emit("changePlayerData", this.object.position);
  }
}
