import Piece from '../piece.js'
import { PIECE_TYPES, oppositeColor } from '#types/piece_consts';

export default class Rook extends Piece {
    type = PIECE_TYPES.King;

    moves(attacking = false) {
        const arr = [];
        
        for(let x = -1; x <= 1; x++) {
            for(let y = -1; y <= 1; y++) {
                if (x == 0 && y == 0) continue;

                arr.push({ x: this.x + x, y: this.y + y });
            }
        }

        // check for castle
        if (!this.moved && !attacking) {
            let r1 = this.board.get(0, this.y);
            let r2 = this.board.get(7, this.y);

            let canLongCastle = r1?.type == PIECE_TYPES.Rook && !r1.moved;
            let canShortCastle = r2?.type == PIECE_TYPES.Rook && !r2.moved;

            if (canLongCastle) {
                for(let x = 1; x < this.x; x++) {
                    // there is a piece or the square is attacked by a piece
                    if (this.board.get(x, this.y) !== null || this.board.getAll(oppositeColor(this.color)).some(p => p.moves(true).some(move => move.x == x && move.y == this.y))) {
                        canLongCastle = false;
                        break;
                    }
                }
            }

            if (canShortCastle) {
                for(let x = this.x+1; x < 7; x++) {
                    // there is a piece or the square is attacked by a piece
                    if (this.board.get(x, this.y) !== null || this.board.getAll(oppositeColor(this.color)).some(p => p.moves(true).some(move => move.x == x && move.y == this.y))) {
                        canShortCastle = false;
                        break;
                    }
                }
            }

            if (canLongCastle) arr.push({ x: this.x - 2, y: this.y });
            if (canShortCastle) arr.push({ x: this.x + 2, y: this.y });
        }

        return arr;
    }
}