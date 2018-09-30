
// returns text composed of full-width characters
module.exports.toVaporwave = function (txt) {
	// split into a char array
	const chars = txt.split('');

	// convert each character into full width equivalent & recombine
	return chars.map(toFullWidth).join('');
}

// returns the full-width version of the character c
const fw_chars = {
	'`': '｀', '1': '１', '2': '２', '3': '３', '4': '４', '5': '５',
	'6': '６', '7': '７', '8': '８', '9': '９', '0': '０', '-': '－',
	'=': '＝', '~': '～', '!': '！', '@': '＠', '#': '＃', '$': '＄',
	'%': '％', '^': '＾', '&': '＆', '*': '＊', '(': '（', ')': '）',
	'_': '＿', '+': '＋',

	'q': 'ｑ', 'w': 'ｗ', 'e': 'ｅ', 'r': 'ｒ', 't': 'ｔ', 'y': 'ｙ',
	'u': 'ｕ', 'i': 'ｉ', 'o': 'ｏ', 'p': 'ｐ', '[': '［', ']': '］',
	'\\': '＼', 'Q': 'Ｑ', 'W': 'Ｗ', 'E': 'Ｅ', 'R': 'Ｒ', 'T': 'Ｔ',
	'Y': 'Ｙ', 'U': 'Ｕ', 'I': 'Ｉ', 'O': 'Ｏ', 'P': 'Ｐ', '{': '｛',
	'}': '｝', '|': '｜',

	'a': 'ａ', 's': 'ｓ', 'd': 'ｄ', 'f': 'ｆ', 'g': 'ｇ', 'h': 'ｈ',
	'j': 'ｊ', 'k': 'ｋ', 'l': 'ｌ', ';': '；', '\'': '＇', 'A': 'Ａ',
	'S': 'Ｓ', 'D': 'Ｄ', 'F': 'Ｆ', 'G': 'Ｇ', 'H': 'Ｈ', 'J': 'Ｊ',
	'K': 'Ｋ', 'L': 'Ｌ', ':': '：', '\"': '“',

	'z': 'ｚ', 'x': 'ｘ', 'c': 'ｃ', 'v': 'ｖ', 'b': 'ｂ', 'n': 'ｎ',
	'm': 'ｍ', ',': '，', '.': '．', '/': '／', 'Z': 'Ｚ', 'X': 'Ｘ',
	'C': 'Ｃ', 'V': 'Ｖ', 'B': 'Ｂ', 'N': 'Ｎ', 'M': 'Ｍ', '<': '＜',
	'>': '＞', '?': '？', ' ': '　'
};

function toFullWidth(c) {
	return fw_chars[c] || c;
}
