// This can be used to initiate the server interaction
// (send the first packet)
function onConnect() {
	sendHello()
	sendClientInfo()
	sendRequestTime()
}

function onDisconnect() {
	global.status = "Disconnected from the server!"
	//trace("Warning: Unhandled disconnect event!")
}

function onIncompatible(server_game_version) {
	show_message(str_format("Incompatible client version - %! (Server version is %)", GAME_VERSION,  server_game_version))
	game_end()
}

// called when the current instance of the game is the dual instance (created by oDualInstance)
function onSecondWindow() {
	// you probably want to add some logic here to disable music, etc.
}


function leaveGame() {
	global.playing = false
	sendLeaveLobby()
	room_goto(rMenu)
}