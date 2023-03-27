import { PIECE_TYPES, PIECE_COLOR } from '#types/piece_consts'
import Board from '#concepts/board'

export default class Piece {
    type = PIECE_TYPES.None;
    color = undefined;
    moved = false;
    x = 0;
    y = 0;

    constructor(board, _x, _y, color = undefined) {
        this.board = board;
        this.color = color;
        var x = _x, y = _y;

        if (color === undefined && typeof x === 'string') {
            color = y;
            var {x, y} = this.board.notationToCoords(x);
        }
        this.x = x;
        this.y = y;

        this.board.set(x, y, this);
    }

    // custom for each piece
    moves(attacking = false) {
        return [];
    }

    validMoves() {
        return this.moves().filter(move => this.board.isValidMove(this.x, this.y, move.x, move.y));
    }

    getMoves() {
        return this.validMoves();
    }

    toString() {
        return this.color == PIECE_COLOR.White ? this.type.toUpperCase() : this.type.toLowerCase();
    }
}