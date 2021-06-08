import { Ray, Raycaster, Vector3 } from "three";

export default class Mouse {
  constructor() {
    this.piece = null;
    this.raycaster = new Raycaster();
  }

  getSquare(camera, chessboard) {
    const ray = new Ray(camera.position, camera.getWorldDirection(new Vector3()));
    this.raycaster.ray = ray;

    // COLLISION POINT

    let intersects = this.raycaster.intersectObjects([...chessboard.children[0].children]);
    if (intersects.length > 0) {
      let point = intersects[0].point;
      let { x, y, z } = point;
      x = Math.floor(x / 2) + 4;
      z = Math.floor(z / 2) + 4;

      // CHECK IF ON BOARD
      if (x >= 0 && x <= 7 && z >= 0 && z <= 7) {
        z = 7 - z;

        let file;
        switch (x) {
          case 0:
            file = "a";
            break;
          case 1:
            file = "b";
            break;
          case 2:
            file = "c";
            break;
          case 3:
            file = "d";
            break;
          case 4:
            file = "e";
            break;
          case 5:
            file = "f";
            break;
          case 6:
            file = "g";
            break;
          case 7:
            file = "h";
            break;
        }

        let square = file + (z + 1);

        return square;
      }
    }
  }
}
