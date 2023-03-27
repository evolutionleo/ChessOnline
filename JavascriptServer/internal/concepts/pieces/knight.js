import Piece from '../piece.js'
import { PIECE_COLOR, PIECE_TYPES } from '#types/piece_consts';

export default class Knight extends Piece {
    type = PIECE_TYPES.Knight;

    moves() {
        const arr = [];
        for(let x = -2; x <= 2; x++) {
            for(let y = -2; y <= 2; y++) {
                if (x == 0 || y == 0 || (Math.abs(x) == Math.abs(y)))
                    continue;
                arr.push({ x: this.x + x, y: this.y + y });
            }
        }
        return arr;
    }
}