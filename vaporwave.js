
// returns text composed of full-width characters
module.exports.toVaporwave = function(txt){
	var chars = txt.split(''); // for each character
	return chars.map(toFullWidth).join(''); // convert the character into full width version
}

// returns the full-width version of the character c
function toFullWidth(c) {
	switch (c) {
		case '`': return '｀'; case '1': return '１'; case '2': return '２';
		case '3': return '３'; case '4': return '４'; case '5': return '５';
		case '6': return '６'; case '7': return '７'; case '8': return '８';
		case '9': return '９'; case '0': return '０'; case '-': return '－';
		case '=': return '＝'; case '~': return '～'; case '!': return '！';
		case '@': return '＠'; case '#': return '＃'; case '$': return '＄';
		case '%': return '％'; case '^': return '＾'; case '&': return '＆';
		case '*': return '＊'; case '(': return '（'; case ')': return '）';
		case '_': return '＿'; case '+': return '＋';

		case 'q': return 'ｑ'; case 'w': return 'ｗ'; case 'e': return 'ｅ';
		case 'r': return 'ｒ'; case 't': return 'ｔ'; case 'y': return 'ｙ';
		case 'u': return 'ｕ'; case 'i': return 'ｉ'; case 'o': return 'ｏ';
		case 'p': return 'ｐ'; case '[': return '［'; case ']': return '］';
		case '\\': return '＼'; case 'Q': return 'Ｑ'; case 'W': return 'Ｗ';
		case 'E': return 'Ｅ'; case 'R': return 'Ｒ'; case 'T': return 'Ｔ';
		case 'Y': return 'Ｙ'; case 'U': return 'Ｕ'; case 'I': return 'Ｉ';
		case 'O': return 'Ｏ'; case 'P': return 'Ｐ'; case '{': return '｛';
		case '}': return '｝'; case '|': return '｜';

		case 'a': return 'ａ'; case 's': return 'ｓ'; case 'd': return 'ｄ';
		case 'f': return 'ｆ'; case 'g': return 'ｇ'; case 'h': return 'ｈ';
		case 'j': return 'ｊ'; case 'k': return 'ｋ'; case 'l': return 'ｌ';
		case ';': return '；'; case '\'': return '＇'; case 'A': return 'Ａ';
		case 'S': return 'Ｓ'; case 'D': return 'Ｄ'; case 'F': return 'Ｆ';
		case 'G': return 'Ｇ'; case 'H': return 'Ｈ'; case 'J': return 'Ｊ';
		case 'K': return 'Ｋ'; case 'L': return 'Ｌ'; case ':': return '：';
		case '\"': return '“';

		case 'z': return 'ｚ'; case 'x': return 'ｘ'; case 'c': return 'ｃ';
		case 'v': return 'ｖ'; case 'b': return 'ｂ'; case 'n': return 'ｎ';
		case 'm': return 'ｍ'; case ',': return '，'; case '.': return '．';
		case '/': return '／'; case 'Z': return 'Ｚ'; case 'X': return 'Ｘ';
		case 'C': return 'Ｃ'; case 'V': return 'Ｖ'; case 'B': return 'Ｂ';
		case 'N': return 'Ｎ'; case 'M': return 'Ｍ'; case '<': return '＜';
		case '>': return '＞'; case '?': return '？'; case ' ': return '　';

		default: return c;
	}
}
