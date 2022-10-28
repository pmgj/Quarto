export default class Cell {
    constructor(row, col) {
        this.x = row;
        this.y = col;
    }
    equals(cell) {
        return (cell.x === this.x && cell.y === this.y);
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
}