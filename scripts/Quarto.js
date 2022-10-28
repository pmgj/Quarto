import CellState from "./CellState.js";
import Player from "./Player.js";
import Shape from "./Shape.js";
import Color from "./Color.js";
import Size from "./Size.js";
import Hole from "./Hole.js";
import MoveResult from "./MoveResult.js";
import Winner from "./Winner.js";
import Cell from "./Cell.js";

export default class Quarto {
    constructor() {
        this.turn = Player.PLAYER1;
        this.board = Array(4).fill().map(() => Array(4).fill(new CellState()));
        this.positions = null;
        this.buffer = [
            [new CellState(Shape.CIRCLE, Color.RED, Size.BIG, Hole.HOLLOW), new CellState(Shape.CIRCLE, Color.RED, Size.BIG, Hole.SOLID), new CellState(Shape.CIRCLE, Color.RED, Size.SMALL, Hole.HOLLOW), new CellState(Shape.CIRCLE, Color.RED, Size.SMALL, Hole.SOLID)],
            [new CellState(Shape.CIRCLE, Color.BLUE, Size.BIG, Hole.HOLLOW), new CellState(Shape.CIRCLE, Color.BLUE, Size.BIG, Hole.SOLID), new CellState(Shape.CIRCLE, Color.BLUE, Size.SMALL, Hole.HOLLOW), new CellState(Shape.CIRCLE, Color.BLUE, Size.SMALL, Hole.SOLID)],
            [new CellState(Shape.SQUARE, Color.RED, Size.BIG, Hole.HOLLOW), new CellState(Shape.SQUARE, Color.RED, Size.BIG, Hole.SOLID), new CellState(Shape.SQUARE, Color.RED, Size.SMALL, Hole.HOLLOW), new CellState(Shape.SQUARE, Color.RED, Size.SMALL, Hole.SOLID)],
            [new CellState(Shape.SQUARE, Color.BLUE, Size.BIG, Hole.HOLLOW), new CellState(Shape.SQUARE, Color.BLUE, Size.BIG, Hole.SOLID), new CellState(Shape.SQUARE, Color.BLUE, Size.SMALL, Hole.HOLLOW), new CellState(Shape.SQUARE, Color.BLUE, Size.SMALL, Hole.SOLID)]
        ];    
    }
    getBoard() {
        return this.board;
    }
    getTurn() {
        return this.turn;
    }
    move(cell, piece) {
        let { x, y } = cell;
        let { x: px, y: py } = piece;
        if (!cell || !piece) {
            throw new Error("Cell or piece is undefined.");
        }
        if (!this.onBoard(cell) || !this.onBoard(piece)) {
            throw new Error("Cell of piece is not on the board.");
        }
        if (!this.buffer[px][py].shape) {
            throw new Error("Origin does not have a piece.");
        }
        if (this.board[x][y].shape) {
            throw new Error("Destination is not empty.");
        }
        this.board[x][y] = this.buffer[px][py];
        this.buffer[px][py] = new CellState();
        this.turn = this.turn === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
        this.positions = null;
        let w = this.endOfGame();
        return new MoveResult(this.positions, w);
    }
    endOfGame() {
        for (let i = 0; i < this.board.length; i++) {
            if (this.testRow(i)) {
                return this.turn === Player.PLAYER2 ? Winner.PLAYER1 : Winner.PLAYER2;
            }
        }
        for (let i = 0; i < this.board[0].length; i++) {
            if (this.testColumn(i)) {
                return this.turn === Player.PLAYER2 ? Winner.PLAYER1 : Winner.PLAYER2;
            }
        }
        if (this.testMainDiagonal() || this.testSecondDiagonal()) {
            return this.turn === Player.PLAYER2 ? Winner.PLAYER1 : Winner.PLAYER2;
        }
        let count = this.board.flat().filter(x => !x.shape).length;
        return count === 0 ? Winner.DRAW : null;
    }
    test(collection, initialValue) {
        let p1 = collection.every(x => x.color && x.color === initialValue.color);
        let p2 = collection.every(x => x.hole && x.hole === initialValue.hole);
        let p3 = collection.every(x => x.shape && x.shape === initialValue.shape);
        let p4 = collection.every(x => x.size && x.size === initialValue.size);
        return p1 || p2 || p3 || p4;
    }
    testRow(row) {
        let t = this.test(this.board[row], this.board[row][0]);
        if (t) {
            this.positions = [new Cell(row, 0), new Cell(row, 1), new Cell(row, 2), new Cell(row, 3)];
        }
        return t;
    }
    testColumn(col) {
        let t = this.test(this.board.map(a => a[col]), this.board[0][col]);
        if (t) {
            this.positions = [new Cell(0, col), new Cell(1, col), new Cell(2, col), new Cell(3, col)];
        }
        return t;
    }
    testMainDiagonal() {
        let cells = [];
        for (let i = 0, max = this.board.length; i < max; i++) {
            cells.push(this.board[i][i]);
        }
        let t = this.test(cells, cells[0]);
        if (t) {
            this.positions = [new Cell(0, 0), new Cell(1, 1), new Cell(2, 2), new Cell(3, 3)];
        }
        return t;
    }
    testSecondDiagonal() {
        let cells = [];
        for (let i = 0, j = this.board.length - 1, max = this.board.length; i < max; i++, j--) {
            cells.push(this.board[i][j]);
        }
        let t = this.test(cells, cells[0]);
        if (t) {
            this.positions = [new Cell(0, 3), new Cell(1, 2), new Cell(2, 1), new Cell(3, 0)];
        }
        return t;
    }
    onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return (inLimit(x, this.board.length) && inLimit(y, this.board[0].length));
    }
}