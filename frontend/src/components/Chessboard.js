import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Group, AudioLoader, Audio } from "three";
import Chess from "chess.js";
import ChessPiece from "./ChessPiece";
import MoveHighlight from "./MoveHighlight";
import CustomPopUp from "./CustomPopUp";

export default class Chessboard {
  constructor(scene, fen, listener) {
    this.scene = scene;
    this.group = new Group();
    this.pieces = [];
    this.fen = fen;
    this.game = new Chess(fen);
    this.fromSquare = null;
    this.toSquare = null;
    this.possible = null;
    this.highlights = [];
    this.audio = new Audio(listener);
    this.audioLoader = new AudioLoader();
    this.getSoundsAsync().then((buffer) => {
      this.audio.setBuffer(buffer);
    });

    this.customPopUp = new CustomPopUp(".end-game-notifier", ".close-notifier");

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
  }

  highlightPossible() {
    this.possible.forEach((square) => {
      if (square == "O-O" && this.game.turn() == "w") this.highlights.push(new MoveHighlight(this.group, "g1"));
      else if (square == "O-O-O" && this.game.turn() == "w") this.highlights.push(new MoveHighlight(this.group, "c1"));
      else if (square == "O-O" && this.game.turn() == "b") this.highlights.push(new MoveHighlight(this.group, "g8"));
      else if (square == "O-O-O" && this.game.turn() == "b") this.highlights.push(new MoveHighlight(this.group, "c8"));
      if (square.includes("+") || square.includes("#")) square = square.slice(0, -1);
      if (square.includes("=")) square = square.slice(-4);
      else square = square.slice(-2);
      this.highlights.push(new MoveHighlight(this.group, square));
    });
  }

  removeHighlights() {
    this.highlights.forEach((highlight) => {
      this.group.remove(highlight);
    });
    this.highlights = [];
  }

  moveProxy(mouse, camera) {
    if (this.fromSquare == null) {
      this.fromSquare = mouse.getSquare(camera, this.getChessboardModel());
      if (this.game.get(this.fromSquare) == null) {
        this.fromSquare = null;
      } else {
        this.possible = this.game.moves({ square: this.fromSquare });
        this.highlightPossible(this.possible);
      }
    } else if (this.toSquare == null) {
      this.toSquare = mouse.getSquare(camera, this.getChessboardModel());
    }
    if (this.fromSquare != null && this.toSquare != null) {
      this.possible = this.game.moves({ square: this.fromSquare });
      let moveIsCastle = this.possible.some((move) => {
        return move.includes("O-O") && (this.toSquare == "g1" || this.toSquare == "c1" || this.toSquare == "g8" || this.toSquare == "c8");
      });
      let moveIsPromotion = this.possible.some((move) => {
        return move.includes("=") && /[abcdefgh][18]/.test(this.toSquare);
      });
      let isPossible = this.possible.some((move) => move.includes(this.toSquare));
      if (isPossible && !moveIsCastle && !moveIsPromotion) {
        this.makeMove(this.fromSquare, this.toSquare);
        this.removeHighlights();
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
        this.removeHighlights();
        this.fromSquare = null;
        this.toSquare = null;
        this.possible = null;
      }
    }
  }

  makeMove(from, to) {
    let selectedPiece = this.pieces.findIndex((piece) => {
      return piece.square == from;
    });
    this.game.move({ from: from, to: to });
    let history = this.game.history();
    let lastMove = history[history.length - 1];
    if (lastMove.includes("x")) {
      let takenPiece = this.pieces.findIndex((piece) => {
        return piece.square == to;
      });
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
        takenPiece = this.pieces.findIndex((piece) => {
          return piece.square == enpassant;
        });
      }
      this.pieces[takenPiece].hide();
    }
    this.pieces[selectedPiece].square = to;
    this.commitMove();
  }

  promotePawn(from, to, pieceToPromoteTo) {
    let selectedPiece = this.pieces.findIndex((piece) => {
      return piece.square == from;
    });
    let promotionSquare = this.pieces.findIndex((piece) => {
      return piece.square == to;
    });

    let color = this.game.turn();
    if (this.pieces[promotionSquare] == null) {
      this.game.move(`${to}=${pieceToPromoteTo}`);
      this.pieces[selectedPiece].hide();
      let newPiece = new ChessPiece(pieceToPromoteTo, color, this.group, 0, 0);
      newPiece
        .loadModel()
        .then(() => {
          newPiece.square = to;
          this.pieces.push(newPiece);
          this.commitMove();
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      this.pieces[selectedPiece].hide();
      this.pieces[promotionSquare].hide();
      this.game.move(`${from[0]}x${to}=${pieceToPromoteTo}`);
      let newPiece = new ChessPiece(pieceToPromoteTo, color, this.group, 0, 0);
      newPiece
        .loadModel()
        .then(() => {
          newPiece.square = to;
          this.pieces.push(newPiece);
          this.commitMove();
        })
        .catch((err) => {
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
        kingIndex = this.pieces.findIndex((piece) => {
          return piece.square == "e1";
        });
        rookIndex = this.pieces.findIndex((piece) => {
          return piece.square == "h1";
        });
        this.pieces[kingIndex].square = "g1";
        this.pieces[rookIndex].square = "f1";
        break;

      case "b":
        kingIndex = this.pieces.findIndex((piece) => {
          return piece.square == "e8";
        });
        rookIndex = this.pieces.findIndex((piece) => {
          return piece.square == "h8";
        });
        this.pieces[kingIndex].square = "g8";
        this.pieces[rookIndex].square = "f8";
        break;
    }
    this.commitMove();
  }

  longCastle() {
    let turn = this.game.turn();
    this.game.move("O-O-O");
    let kingIndex;
    let rookIndex;
    switch (turn) {
      case "w":
        kingIndex = this.pieces.findIndex((piece) => {
          return piece.square == "e1";
        });
        rookIndex = this.pieces.findIndex((piece) => {
          return piece.square == "a1";
        });
        this.pieces[kingIndex].square = "c1";
        this.pieces[rookIndex].square = "d1";
        break;

      case "b":
        kingIndex = this.pieces.findIndex((piece) => {
          return piece.square == "e8";
        });
        rookIndex = this.pieces.findIndex((piece) => {
          return piece.square == "a8";
        });
        this.pieces[kingIndex].square = "c8";
        this.pieces[rookIndex].square = "d8";
        break;
    }
    this.commitMove();
  }

  commitMove() {
    socket.emit("makeMove", { move: { from: this.fromSquare, to: this.toSquare }, turn: this.getTurn() });
    this.fromSquare = null;
    this.toSquare = null;
    this.possible = null;
    console.log(this.game.ascii());
    this.updatePieces();
    this.playMoveSound();
    if (this.game.game_over()) this.getGameResult();
  }

  getGameResult() {
    if (this.game.in_checkmate()) {
      let lost = this.game.turn();
      switch (lost) {
        case "w":
          this.won = "black";
          this.lost = "white";
          break;

        case "b":
          this.won = "white";
          this.lost = "black";

          break;
      }
      this.customPopUp.setPopUpField(".won-by", this.won);
      this.customPopUp.setPopUpField(".game-status", "MAT");
    } else {
      this.won = "draw";

      this.customPopUp.setPopUpField(".game-status", "REMIS");
    }
    this.customPopUp.showPopUp();
    this.gameEnded = true;
    this.storeInDb = { ago: new Date(), moves: this.game.history({ verbose: true }), fen: this.game.fen(), won: this.won, lost: this.lost };
  }

  updatePieces() {
    this.pieces.forEach((piece) => {
      piece.update();
    });
  }

  getGroup() {
    return this.group;
  }

  getChessboardModel() {
    return this.model;
  }

  getTurn() {
    return this.game.turn();
  }

  getHistory() {
    return this.game.history();
  }

  getSoundsAsync() {
    // LOAD SOUND AS IN #1 EXAMPLE AND RETURN AS ARRAY OF PROMISES, LATER IN CONSTRUCTOR HANDLE
    // AS PROMISE.ALL CREATE UNIVERSAL METHOD TO PLAY SOUNDS
    // 13.06 ONLY MOVE SOUND ADDED !TODO

    // #1
    const move = new Promise((resolve, reject) => {
      this.audioLoader.load("./src/components/assets/chess/move.mp3", (buffer) => {
        resolve(buffer);
      });
    });

    // ...
    // const mate = new Promise((resolve, reject) => {
    //   this.audioLoader.load();
    // });

    return move;
    // ...
    // return [move, mate]
  }

  playMoveSound() {
    this.audio.play();
  }
}
