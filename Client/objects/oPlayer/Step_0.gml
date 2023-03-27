/// @description platformer physics logic

if (!remote) {
	kup = keyboard_check(ord("W")) || keyboard_check(vk_up)
	kleft = keyboard_check(ord("A")) || keyboard_check(vk_left)
	kdown = keyboard_check(ord("S")) || keyboard_check(vk_down)
	kright = keyboard_check(ord("D")) || keyboard_check(vk_right)
	
	kjump = keyboard_check(vk_space)
	kjump_press = keyboard_check_pressed(vk_space)
	kjump_rel = keyboard_check_released(vk_space)
	
	move_x = kright - kleft
	move_y = kdown - kup
	
	sendPlayerControls()
	
	//spd.x = move_x * walksp
}


//if (kjump_press and grounded()) {
//	jump()
//}

//if (!kjump and !cutJump and !grounded() and spd.y <= -1) {
//	spd.y *= .5
//	cutJump = true
//}


// Inherit the parent event
event_inherited();