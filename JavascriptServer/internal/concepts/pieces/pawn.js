import Piece from '../piece.js'
import { PIECE_COLOR, PIECE_TYPES } from '#types/piece_consts';

export default class Pawn extends Piece {
    type = PIECE_TYPES.Pawn;

    moves(attacking = false) {
        const arr = [];
        const dir = this.color == PIECE_COLOR.White ? 1 : -1;

        const addIfPiece = (x, y, shouldExist = false) => {
            if (!this.board.isInside(x, y))
                return false;

            let p = this.board.get(x, y)
            
            if ((shouldExist && p !== null && p.color !== this.color) || (!shouldExist && p === null)) {
                arr.push({ x, y });
                return true;
            }
            else
                return false;
        }

        
        addIfPiece(this.x + 1, this.y + dir, true);
        addIfPiece(this.x - 1, this.y + dir, true);

        if (!attacking) {
            if(addIfPiece(this.x, this.y + dir, false))
                if (!this.moved)
                    addIfPiece(this.x, this.y + dir * 2, false);
        }

        return arr;
    }
}