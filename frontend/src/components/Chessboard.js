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
    this.fromSquare = null;
    this.toSquare = null;
    this.possible = null;

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
          piece.loadModel();
          this.pieces.push(piece);
        }
      }
    }
    console.log(this.pieces);
  }

  moveProxy(mouse, camera) {
    if (this.fromSquare == null) {
      this.fromSquare = mouse.getSquare(camera, this.getChessboardModel());
      this.possible = this.game.moves({ square: this.fromSquare });
      console.log(this.possible);
    } else if (this.toSquare == null) {
      this.toSquare = mouse.getSquare(camera, this.getChessboardModel());
    }
    if (this.fromSquare != null && this.toSquare != null) {
      let moveIsCastle = this.possible.some(move => {
        return move.includes("O-O") && (this.toSquare == "g1" || this.toSquare == "c1" || this.toSquare == "g8" || this.toSquare == "c8");
      });
      let moveIsPromotion = this.possible.some(move => {
        return move.includes("=") && /[abcdefgh][18]/.test(this.toSquare);
      });
      let isPossible = this.possible.some(move => move.includes(this.toSquare));
      if (isPossible && !moveIsCastle && !moveIsPromotion) {
        console.log(`ruch z ${this.fromSquare} na ${this.toSquare}`);
        this.makeMove(this.fromSquare, this.toSquare);
      } else if (moveIsCastle) {
        switch (this.toSquare) {
          case "g1":
          case "g8":
            this.shortCastle();
            break;

          case "c1":
          case "c8":
            this.longCastle();
            break;
        }
      } else if (moveIsPromotion && isPossible) {
        let selectedPiece;
        while (!/^[QRBNqrbn]$/.test(selectedPiece)) {
          selectedPiece = prompt("Q - hetman, R - wieża, B - goniec, N - skoczek", "Q").toUpperCase();
        }
        this.promotePawn(this.fromSquare, this.toSquare, selectedPiece);
      } else {
        this.fromSquare = null;
        this.toSquare = null;
        this.possible = null;
      }
    }
  }

  makeMove(from, to) {
    let selectedPiece = this.pieces.findIndex(piece => { return piece.square == from; });
    this.game.move({ from: from, to: to });
    let history = this.game.history();
    let lastMove = history[history.length - 1];
    if (lastMove.includes("x")) {
      let takenPiece = this.pieces.findIndex(piece => { return piece.square == to; });
      console.log(this.pieces[takenPiece]);
      if (!this.pieces[takenPiece]) {
        let enpassant;
        switch (this.game.turn()) {
          case "w":
            enpassant = to[0] + (parseInt(to[1]) + 1);
            break;

          case "b":
            enpassant = to[0] + (parseInt(to[1]) - 1);
            break;
        }
        takenPiece = this.pieces.findIndex(piece => { return piece.square == enpassant; });
      }
      this.pieces[takenPiece].hide();
    }
    this.pieces[selectedPiece].square = to;
    this.fromSquare = null;
    this.toSquare = null;
    this.possible = null;
    console.log(this.game.ascii());
    this.updatePieces();
  }

  promotePawn(from, to, pieceToPromoteTo) {
    let selectedPiece = this.pieces.findIndex(piece => { return piece.square == from; });
    let promotionSquare = this.pieces.findIndex(piece => { return piece.square == to; });

    let color = this.game.turn();
    if (this.pieces[promotionSquare] == null) {
      this.game.move(`${to}=${pieceToPromoteTo}`);
      this.pieces[selectedPiece].hide();
      let newPiece = new ChessPiece(pieceToPromoteTo, color, this.group, 0, 0);
      newPiece.loadModel().then(() => {
        newPiece.square = to;
        this.pieces.push(newPiece);
        this.fromSquare = null;
        this.toSquare = null;
        this.possible = null;
        console.log(this.game.ascii());
        this.updatePieces();
      })
        .catch(err => {
          console.error(err);
        });
    } else {
      this.pieces[selectedPiece].hide();
      this.pieces[promotionSquare].hide();
      this.game.move(`${from[0]}x${to}=${pieceToPromoteTo}`);
      let newPiece = new ChessPiece(pieceToPromoteTo, color, this.group, 0, 0);
      newPiece.loadModel().then(() => {
        newPiece.square = to;
        this.pieces.push(newPiece);
        this.fromSquare = null;
        this.toSquare = null;
        this.possible = null;
        console.log(this.game.ascii());
        this.updatePieces();
      })
        .catch(err => {
          console.error(err);
        });
    }
  }

  shortCastle() {
    let turn = this.game.turn();
    this.game.move("O-O");
    let kingIndex;
    let rookIndex;
    switch (turn) {
      case "w":
        kingIndex = this.pieces.findIndex(piece => {
          return piece.square == "e1";
        });
        rookIndex = this.pieces.findIndex(piece => {
          return piece.square == "h1";
        });
        this.pieces[kingIndex].square = "g1";
        this.pieces[rookIndex].square = "f1";
        break;

      case "b":
        kingIndex = this.pieces.findIndex(piece => {
          return piece.square == "e8";
        });
        rookIndex = this.pieces.findIndex(piece => {
          return piece.square == "h8";
        });
        this.pieces[kingIndex].square = "g8";
        this.pieces[rookIndex].square = "f8";
        break;
    }
    this.fromSquare = null;
    this.toSquare = null;
    this.possible = null;
    console.log(this.game.ascii());
    this.updatePieces();
  }

  longCastle() {
    let turn = this.game.turn();
    this.game.move("O-O-O");
    let kingIndex;
    let rookIndex;
    switch (turn) {
      case "w":
        kingIndex = this.pieces.findIndex(piece => {
          return piece.square == "e1";
        });
        rookIndex = this.pieces.findIndex(piece => {
          return piece.square == "a1";
        });
        this.pieces[kingIndex].square = "c1";
        this.pieces[rookIndex].square = "d1";
        break;

      case "b":
        kingIndex = this.pieces.findIndex(piece => {
          return piece.square == "e8";
        });
        rookIndex = this.pieces.findIndex(piece => {
          return piece.square == "a8";
        });
        this.pieces[kingIndex].square = "c8";
        this.pieces[rookIndex].square = "d8";
        break;
    }
    this.fromSquare = null;
    this.toSquare = null;
    this.possible = null;
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
