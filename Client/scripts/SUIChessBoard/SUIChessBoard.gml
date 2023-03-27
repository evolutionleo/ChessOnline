enum CELL_COLOR {
	Black = c_orange,
	White = c_white
}

#macro CELL_WIDTH 64
#macro CELL_HEIGHT 64

function SUIChessBoard(props, children) : SUIElement(0, 0, props, children) constructor {
	
	SUIInherit(self, props)
	
	draw = function(x, y) {
		var b = get("board")
		var moves = get("possible_moves")
		var sel = get("selected_square")
		var possible_from = get("possible_from")
		var local_color = get("local_color")
		
		for(var _cy = 0; _cy < 8; _cy++) {
			for(var _cx = 0; _cx < 8; _cx++) {
				var _x = x + _cx * CELL_WIDTH
				var _y = y + _cy * CELL_HEIGHT
				
				var cx = local_color == "B" ? _cx : 7-_cx
				var cy = local_color == "B" ? _cy : 7-_cy
				
				var c = b[cy][cx]
				
				var cell_col = (cx + cy) % 2 == 0 ? CELL_COLOR.Black : CELL_COLOR.White
				var piece_id = oChess.getPieceId(c)
				
				var is_selected = !is_undefined(sel) and sel.x == cx and sel.y == cy
				var selected_possible = !is_undefined(sel) and !is_undefined(possible_from) and sel.x == possible_from.x and sel.y == possible_from.y
				
				//trace(array_length(moves))
				var is_possible_move = false
				for(var i = 0; i < array_length(moves); i++) {
					if (!selected_possible)
						break
					
					if(moves[i].x == cx and moves[i].y == cy) {
						is_possible_move = true
						break
					}
				}
				
				draw_set_color(cell_col)
				draw_set_alpha(1.0)
				draw_rectangle(_x, _y, _x + CELL_WIDTH, _y + CELL_HEIGHT, false)
				
				draw_sprite_stretched(sPiece, piece_id, _x, _y, CELL_WIDTH, CELL_HEIGHT)
				
				if (is_selected) {
					draw_set_color(c_yellow)
					draw_set_alpha(.4)
					
					draw_rectangle(_x, _y, _x + CELL_WIDTH, _y + CELL_HEIGHT, false)
					
					draw_set_alpha(1.0)
				}
				
				if (is_possible_move) {
					draw_set_color(c_black)
					draw_set_alpha(.5)
					draw_circle(_x + CELL_WIDTH/2, _y + CELL_HEIGHT/2, CELL_WIDTH/6, false)
				}
				
				draw_set_alpha(1.0)
				draw_set_color(c_white)
			}
		}
	}
	
	step = function() {
		var x1 = get("left")
		var x2 = x1 + 8 * CELL_WIDTH
		var y1 = get("top")
		var y2 = y1 + 8 * CELL_HEIGHT
		
		var col = get("local_color")
		
		if (mouse_x >= x1 and mouse_x < x2 and mouse_y >= y1 and mouse_y < y2) {
			var cx = (mouse_x - x1) div CELL_WIDTH
			var cy = (mouse_y - y1) div CELL_HEIGHT
			var gcx = col == "B" ? cx : 7-cx
			var gcy = col == "B" ? cy : 7-cy
			
			var selected = get("selected_square")
			
			if (mouse_check_button_pressed(mb_left)) {
				set("possible_moves", [])
				if (is_undefined(selected)) {
					set("selected_square", {x: gcx, y: gcy})
					sendRequestPossibleMoves(gcx, gcy)
				}
				else {
					set("selected_square", undefined)
					if (selected.x != gcx or selected.y != gcy)
						sendMove(selected.x, selected.y, gcx, gcy)
				}
			}
			if (mouse_check_button_pressed(mb_right)) {
				set("possible_moves", [])
				set("selected_square", undefined)
			}
		}
	}
}