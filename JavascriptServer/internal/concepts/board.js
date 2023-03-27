import Piece from './piece.js'
import { oppositeColor, PIECE_COLOR } from '#types/piece_consts';
import { PIECES } from '#types/piece_types'
import { PIECE_TYPES } from '../types/piece_consts.js';

export default class Board {
    board = [];
    width = 8;
    height = 8;
    turn = 0;
    history = [];

    get colorToMove() {
        return this.turn % 2 == 0 ? PIECE_COLOR.White : PIECE_COLOR.Black;
    }

    constructor() {
        // an 8x8 2D array of null's
        for(let y = 0; y < this.height; y++) {
            let row = new Array(this.width).fill(null);
            this.board.push(row);
        }

        // sPAWN
        for(let i = 0; i < this.width; i++) {
            new PIECES.Pawn(this, i, 1, PIECE_COLOR.White);
            new PIECES.Pawn(this, i, 6, PIECE_COLOR.Black);
        }

        // The misc pieces
        ['Rook', 'Knight', 'Bishop'].forEach((piece, pi) => {
            new PIECES[piece](this, pi, 0, PIECE_COLOR.White);
            new PIECES[piece](this, this.width-pi-1, 0, PIECE_COLOR.White);

            new PIECES[piece](this, pi, 7, PIECE_COLOR.Black);
            new PIECES[piece](this, this.width-pi-1, 7, PIECE_COLOR.Black);
        });

        // The Kings
        new PIECES.King(this, 4, 0, PIECE_COLOR.White);
        new PIECES.King(this, 4, 7, PIECE_COLOR.Black);

        // The Queens
        new PIECES.Queen(this, 3, 0, PIECE_COLOR.White);
        new PIECES.Queen(this, 3, 7, PIECE_COLOR.Black);

        // // CHECK the output
        // console.log(this.toString());
        // console.log('########')
    }

    getAll(color = null) {
        return this.board.flat().filter(p => p !== null && (color === null || p.color == color));
    }

    getKing(color) {
        return this.getAll(color).find(p => p.type == PIECE_TYPES.King);
    }

    isValidMove(x1, y1, x2, y2) {
        if (!this.isInside(x1, y1) || !this.isInside(x2, y2))
            return false;

        let p1 = this.get(x1, y1);
        let p2 = this.get(x2, y2);

        if (p1 === null)
            return false;
        
        if (p2 !== null && p1.color == p2.color)
            return false;

        if (this.withMove(x1, y1, x2, y2, (board) => board.isChecked(p1.color)))
            return false;

        return true;
    }

    isPossibleMove(x1, y1, x2, y2) {
        return this.isInside(x1, y1) && this.get(x1, y1) !== null && this.get(x1, y1).validMoves().some(_move => _move.x == x2 && _move.y == y2)
    }

    move(x1, y1, x2, y2) {
        let p1 = this.get(x1, y1);
        let p2 = this.get(x2, y2);

        this.set(x2, y2, p1);
        this.set(x1, y1, null);
        p1.x = x2;
        p1.y = y2;

        if (p1.type == PIECE_TYPES.King) {
            if (x2 - x1 == 2) { // short castles
                this.move(7, y1, x2-1, y2);
                this.turn--;
            }
            if (x2 - x1 == -2) { // long castles
                this.move(0, y1, x2+1, y2);
                this.turn--;
            }
        }

        p1.moved = true;
        this.history.push({ x1, y1, x2, y2, p: p2?.toString() });
        this.turn++;
    }

    withMove(x1, y1, x2, y2, cb) {
        let p1 = this.get(x1, y1);
        let p2 = this.get(x2, y2);

        this.set(x2, y2, p1);
        this.set(x1, y1, null);
        p1.x = x2;
        p1.y = y2;

        let res = cb(this);

        this.set(x1, y1, p1);
        this.set(x2, y2, p2);
        p1.x = x1;
        p1.y = y1;

        return res;
    }

    // if any of the opposining pieces can hit the king, then it's checked
    isChecked(color) {
        let king = this.getKing(color);
        return this.getAll(oppositeColor(color)).some(p => p.moves(true).some(_move => _move.x == king.x && _move.y == king.y));
    }

    hasNoMoves(color) {
        return this.getAll(color).every(p => p.validMoves().length == 0);
    }

    isStalemated(color) {
        return !this.isChecked(color) && this.hasNoMoves(color);
    }

    isCheckmated(color) {
        return this.isChecked(color) && this.hasNoMoves(color);
    }

    isInsufficientMaterial() {
        // TODO: implement draw by InsufficientMaterial
        return false;
    }



    isInside(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    get(x, y) {
        if (!this.isInside(x, y))
            return undefined;

        return this.board[y][x];
    }

    set(x, y, value) {
        this.board[y][x] = value;
    }

    getByS(s) {
        let {x, y} = this.notationToCoords(s);
        return this.get(x, y);
    }

    static xToLetter(x) {
        return String.fromCharCode('A'.charCodeAt(0) + x);
    }

    static xFromLetter(l) {
        return l.charCodeAt(0) - 'A'.charCodeAt(0);
    }

    static yToNumber(y) { return y + 1; }
    static yFromNumber(n) { return n - 1; }

    static notationToCoords(s) { return { x: this.xFromLetter(s[0]), y: this.yFromNumber(parseInt(s[1])) }; }
    static notationFromCoords(x, y) { return this.xToLetter(x) + this.yToNumber(y).toString(); }

    toString() {
        return this.board.map(row => row.map(p => p === null ? PIECE_TYPES.None : p.toString()).join('')).join('\n');
    }
}