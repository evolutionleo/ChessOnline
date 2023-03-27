// <3
function string_reverse(s) {
	var ans = ""
	for(var i = string_length(s); i > 0;  i--) {
		ans += string_char_at(s, i)
	}
	
	return ans
}