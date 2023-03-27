export const PIECE_TYPES = {
    None: '.',
    Pawn: 'P',
    King: 'K',
    Queen: 'Q',
    Rook: 'R',
    Bishop: 'B',
    Knight: 'N'
}

export const PIECE_COLOR = {
    White: 'W',
    Black: 'B'
}

export function oppositeColor(color) {
    if (color === PIECE_COLOR.White) {
        return PIECE_COLOR.Black;
    }
    else return PIECE_COLOR.White;
}