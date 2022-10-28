export default class MoveResult {
    constructor(positions, winner) {
        this.positions = positions;
        this.winner = winner;
    }
    setPositions(pos) {
        this.positions = pos;
    }
    getPositions() {
        return this.positions;
    }
    setWinner(win) {
        this.winner = win;
    }
    getWinner() {
        return this.winner;
    }
}