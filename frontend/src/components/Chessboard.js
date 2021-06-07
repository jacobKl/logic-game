import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GridHelper, Group } from "three";
import Chess from "chess.js";
import ChessPiece from "./ChessPiece";

export default class Chessboard {
  constructor(scene) {
    this.scene = scene;
    this.group = new Group();
    this.pieces = [];
    this.game = new Chess();
    this.fromSquare = null;
    this.toSquare = null;

    const loader = new GLTFLoader();

    const path = "./src/components/assets/chess/board.gltf";

    loader.load(path, (object) => {
      this.model = object.scene;

      this.spawnPieces();

      this.group.position.y = 18.5;
      this.model.position.y = 18.5;
      this.group.scale.set(2, 2, 2);
      this.model.scale.set(2, 2, 2);

      this.scene.add(this.group);
      this.scene.add(this.model);
    });
  }

  spawnPieces() {
    let board = this.game.board();

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

  moveProxy(mouse, camera) {
    if (this.fromSquare == null) {
      this.fromSquare = mouse.getSquare(camera, this.getChessboardModel());
    } else if (this.toSquare == null) {
      this.toSquare = mouse.getSquare(camera, this.getChessboardModel());
    }
    if (this.fromSquare != null && this.toSquare != null) {
      this.makeMove(this.fromSquare, this.toSquare);
    }
  }

  makeMove(from, to) {
    let selectedPiece = this.pieces.findIndex(piece => {
      return piece.square == from;
    });
    let possible = this.game.moves({ square: from });
    console.log(possible);
    if (possible.some(move => move.includes(to))) {
      this.game.move({ from: from, to: to });
      this.pieces[selectedPiece].square = to;
    }
    this.fromSquare = null;
    this.toSquare = null;
    console.log(this.game.ascii());
    this.updatePieces();
  }

  updatePieces() {
    this.pieces.forEach(piece => {
      piece.update();
    });
  }

  getGroup() {
    return this.group;
  }

  getChessboardModel() {
    return this.model;
  }
}
