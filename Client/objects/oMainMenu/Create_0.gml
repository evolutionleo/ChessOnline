/// @desc

global.canvas = new SUICanvas()
global.status = ""

var btn_w = 192
var btn_h = 64
var offset_y = 30

txt_title = global.canvas.appendChild(new SUITitle(0, room_height/2-80, "Chess Online"))
txt_title.set("center", room_width/2)

txt_status = global.canvas.appendChild(new SUIText(0, room_height - 90, SUIBind("global.status"), { halign: fa_middle, valign: fa_center }))
txt_status.set("center", room_width/2)

//btn_lobbies = global.canvas.appendChild(new SUIButton(0, room_height/2-(btn_h+offset_y)/2, "Lobbies", function() { room_goto(rLobbiesList) }, {w: btn_w, h: btn_h}))
btn_play = global.canvas.appendChild(new SUIButton(0, room_height/2+(btn_h+offset_y)/2, "Play", function() { sendJoinLobby() }, {w: btn_w, h: btn_h}))
//btn_login = global.canvas.appendChild(new SUIButton(0, room_height/2+(btn_h+offset_y)/2, "Login", function() { room_goto(rLogin) }, {w: btn_w, h: btn_h}))

//btn_lobbies.set("center", room_width/2)
btn_play.set("center", room_width/2)
//btn_login.set("center", room_width/2)