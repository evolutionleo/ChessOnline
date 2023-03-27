import Piece from '../piece.js'
import { PIECE_COLOR, PIECE_TYPES } from '#types/piece_consts';

export default class Rook extends Piece {
    type = PIECE_TYPES.Rook;

    moves() {
        const arr = [];
        let x, y;

        const handleCell = (x, y) => {
            if (this.board.isInside(x, y))
                arr.push({x, y});
            
            let p = this.board.get(x, y);
            if (p !== null) {
                return -1;
            }

            return 0;
        }

        let s = new Array(4).fill(false);
        for(let i = 1; i < 8; i++) {
            if (!s[0] && handleCell(this.x + i, this.y) == -1)
                s[0] = true;
            if (!s[1] && handleCell(this.x - i, this.y) == -1)
                s[1] = true;
            if (!s[2] && handleCell(this.x, this.y + i) == -1)
                s[2] = true;
            if (!s[3] && handleCell(this.x, this.y - i) == -1)
                s[3] = true;
        }

        return arr;
    }
}