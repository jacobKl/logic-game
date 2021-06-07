import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Group } from "three";
import Chess from "chess.js";
import ChessPiece from "./ChessPiece";

export default class Chessboard {
  constructor(scene) {
    this.scene = scene;
    this.group = new Group();
    this.pieces = [];
    this.game = new Chess();

    const loader = new GLTFLoader();

    const path = "./src/components/assets/chess/board.gltf";

    loader.load(path, (object) => {
      this.model = object.scene;

      this.spawnPieces();

      this.group.position.y = 5;
      this.model.position.y = 5;

      this.scene.add(this.group);
      this.scene.add(this.model);
    });
  }

  spawnPieces() {
    let board = this.game.board();
    console.log(board);

    // 1, 2, 3, 4, 5, 6, 7, 8
    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
      // a, b, c, d, e, f, g, h
      for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
        const square = board[rankIndex][fileIndex];

        if (square !== null) {
          let xPos = fileIndex - 4 + 0.5;
          let zPos = rankIndex - 4 + 0.5;

          let piece = new ChessPiece(square.type, square.color, this.group, xPos, zPos);
          this.pieces.push(piece);
        }
      }
    }
  }

  getGroup() {
    return this.group;
  }
}
