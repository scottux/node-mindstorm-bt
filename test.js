var Nxt = require("mindstorms_bluetooth");

function play_sound_test() {
	var nxt = new Nxt("/dev/tty.NXT-DevB");
	nxt.play_tone(440, 1000);
}
