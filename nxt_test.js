var Nxt = require("./nxt").Nxt;

function play_sound_test() {
	var nxt = new Nxt("/dev/tty.NXT-DevB");
	nxt.play_tone(440, 1000);
	nxt.set_output_state(nxt.MOTOR_A, 50, nxt.MOTORON, nxt.REGULATION_MODE_IDLE, 0, nxt.MOTOR_RUN_STATE_RUNNING, 360);
	//setTimeout(nxt.close_connection(nxt.sp),5000);
}

play_sound_test();
