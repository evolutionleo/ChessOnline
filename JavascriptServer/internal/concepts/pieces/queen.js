import Piece from '../piece.js'
import { PIECE_COLOR, PIECE_TYPES } from '#types/piece_consts';

export default class Queen extends Piece {
    type = PIECE_TYPES.Queen;

    moves() {
        const arr = [];

        const handleCell = (x, y) => {
            if (this.board.isInside(x, y))
                arr.push({x, y});
            
            let p = this.board.get(x, y);
            if (p !== null) {
                return -1;
            }

            return 0;
        }

        let s = new Array(8).fill(false);
        for(let i = 1; i <= 8; i++) {
            if (!s[0] && handleCell(this.x + i, this.y + i) == -1)
                s[0] = true;
            if (!s[1] && handleCell(this.x + i, this.y - i) == -1)
                s[1] = true;
            if (!s[2] && handleCell(this.x - i, this.y + i) == -1)
                s[2] = true;
            if (!s[3] && handleCell(this.x - i, this.y - i) == -1)
                s[3] = true;
            if (!s[4] && handleCell(this.x + i, this.y) == -1)
                s[4] = true;
            if (!s[5] && handleCell(this.x - i, this.y) == -1)
                s[5] = true;
            if (!s[6] && handleCell(this.x, this.y + i) == -1)
                s[6] = true;
            if (!s[7] && handleCell(this.x, this.y - i) == -1)
                s[7] = true;
        }

        return arr;
    }
}