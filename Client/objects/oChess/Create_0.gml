/// @desc

PIECE_COLOR = {
	White: "W",
	Black: "B"
}

global.canvas = new SUICanvas()

//global.canvas.appendChild(new SUIBackButton())
board = []
possible_moves = []
possible_from = undefined
selected_square = undefined

status = ""

local_color = PIECE_COLOR.White

title_el = global.canvas.appendChild(new SUITitle(350+10, 100-10, SUIBind(function() { return "You play as " + oChess.local_color }), { halign: fa_left, valign: fa_bottom }))
status_el = global.canvas.appendChild(new SUIText(30, 30, SUIBind("self.status"), { font: fStatus, color: c_yellow, halign: fa_left, valign: fa_top }))

board_el = global.canvas.appendChild(
	new SUIChessBoard({
		board: SUIBind("self.board"),
		possible_moves: SUIBind("self.possible_moves", "self.possible_moves"),
		possible_from: SUIBind("self.possible_from"),
		selected_square: SUIBind("self.selected_square", "self.selected_square"),
		local_color: SUIBind("self.local_color")
	}))
board_el.set("left", 350)
board_el.set("top", 100)



width = 8
height = 8

for(var cy = 0; cy < height; cy++) {
	array_push(board, [])
	for(var cx = 0; cx < width; cx++) {
		array_push(board[cy], "")
	}
}



#macro EMPTY_PIECE_CHAR "."

parseBoard = function(str) {
	str = string_replace_all(str, "\n", "")
	//if (local_color == PIECE_COLOR.Black)
	//	str = string_reverse(str)
	
	string_foreach(str, function(c, i) {
		var _x = (i-1) % 8
		var _y = (i-1) div 8
		board[_y][_x] = c
	})
}

piece_ids = {
	"K": 1,
	"Q": 2,
	"B": 3,
	"N": 4,
	"R": 5,
	"P": 6
}

getPieceId = function(c) {
	var value = piece_ids[$ string_upper(c)]
	if (is_undefined(value))
		return 0
	if (string_upper(c) != c)
		value += 6
	
	return value
}
