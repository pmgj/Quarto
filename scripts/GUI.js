import Quarto from "./Quarto.js";
import Cell from "./Cell.js";

class GUI {
    constructor() {
        this.game = new Quarto();
        this.origin = null;    
    }
    coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
    play(evt) {
        let td = evt.currentTarget;
        if (this.origin) {
            try {
                let mr = this.game.move(this.coordinates(td), this.coordinates(this.origin));
                td.appendChild(this.origin.firstChild);
                this.unselect();
                this.origin = null;
                this.changeMessage(mr);
            } catch (ex) {
                this.setMessage(ex.message);
            }
        }
    }
    printAnswer(cells) {
        let board = document.querySelector("#board");
        for (let c of cells) {
            board.rows[c.getX()].cells[c.getY()].className = "selecionado";
        }
    }
    select(evt) {
        let td = evt.currentTarget;
        if (td.firstChild && !this.origin) {
            this.unselect();
            this.origin = td;
            td.className = "selecionado";
            this.changeMessage();
        }
    }
    unselect() {
        let cells = document.querySelectorAll("#buffer td");
        for (let td of cells) {
            td.className = "";
        }
    }
    setMessage(message) {
        let msg = document.getElementById("message");
        msg.textContent = message;
    }
    changeMessage(m) {
        let objs = { DRAW: "Draw!", PLAYER2: "Player 2 win!", PLAYER1: "Player 1 win!" };
        if (m && objs[m.getWinner()]) {
            this.setMessage(`Game Over! ${objs[m.getWinner()]}`);
            let cells = document.querySelectorAll("#buffer td");
            for (let td of cells) {
                td.onclick = undefined;
            }
            this.printAnswer(m.getPositions());
        } else {
            if (this.origin) {
                let msgs = { PLAYER1: "Player 1 turn.", PLAYER2: "Player 2 turn." };
                this.setMessage(msgs[this.game.getTurn()]);
            } else {
                let msgs = { PLAYER1: "Player 2 must choose piece for Player 1.", PLAYER2: "Player 1 must choose piece for Player 2." };
                this.setMessage(msgs[this.game.getTurn()]);
            }
        }
    }
    init() {
        let board = this.game.getBoard();
        let tbody = document.querySelector("#board tbody");
        for (let i = 0; i < board.length; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < board[0].length; j++) {
                let td = document.createElement("td");
                td.onclick = this.play.bind(this);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        let cells = document.querySelectorAll("#buffer td");
        for (let td of cells) {
            td.onclick = this.select.bind(this);
        }
        this.changeMessage();
    }
}
let gui = new GUI();
gui.init();