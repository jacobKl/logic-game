import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

export default class MoveHighlight extends Mesh {
  constructor(group, square) {
    let geometry = new PlaneGeometry(1, 1);
    let material = new MeshBasicMaterial({
      transparent: true,
      color: 0x00ff00,
      side: DoubleSide,
      opacity: 0.25,
    });

    super(geometry, material);

    this.group = group;
    this.square = square;
    this.setPosition();

    this.group.add(this);
  }

  setPosition() {
    let file = this.square[0];
    let rank = parseInt(this.square[1]);

    this.position.y = 0.55;
    this.position.z = 8 - rank - 3.5;
    switch (file) {
      case "a": this.position.x = 0 - 3.5; break;
      case "b": this.position.x = 1 - 3.5; break;
      case "c": this.position.x = 2 - 3.5; break;
      case "d": this.position.x = 3 - 3.5; break;
      case "e": this.position.x = 4 - 3.5; break;
      case "f": this.position.x = 5 - 3.5; break;
      case "g": this.position.x = 6 - 3.5; break;
      case "h": this.position.x = 7 - 3.5; break;
    }

    this.rotation.x = Math.PI / 2;
  }
}