"use strict";

//var serialport = require("serialport");
//var serialport = require("C:\\Users\\tamachan\\Dropbox\\mindstorms_bluetooth_nodejs\\node_modules\\serialport\\serialport");
var serialport = require("./node_modules/serialport/serialport");
var SerialPort = serialport.SerialPort;

//TODO:
// - Input checking
// - proper close after use, maybe something with detect if command have been run, only exit when no commands need to be answered.

var Nxt = function (port) {
	this.initialized = false;

	this.sp = new SerialPort(port, {
		parser: serialport.parsers.raw
	});
	this.sp.data_handles = {};
	this.initialized = true;
	this.sp.on('data', this.status_handle);
	this.sp.nxt_error_messages = this.nxt_error_messages;
	this.sp.nxt_commands = this.nxt_commands;

	//Output ports
	this.MOTOR_A = 0x00;
	this.MOTOR_B = 0x01;
	this.MOTOR_C = 0x02;
	this.MOTOR_ALL = 0xff;
	
	//Output modes
	this.MOTORON = 0x01;
	this.BRAKE = 0x02;
	this.REGULATED = 0x04;

	//Regulations mode
	this.REGULATION_MODE_IDLE = 0x00;
	this.REGULATION_MODE_MOTOR_SPEED = 0x01;
	this.REGULATION_MODE_MOTOR_SYNC = 0x02;

	//Runstate
	this.MOTOR_RUN_STATE_IDLE = 0x00;
	this.MOTOR_RUN_STATE_RAMPUP = 0x10;
	this.MOTOR_RUN_STATE_RUNNING = 0x20;
	this.MOTOR_RUN_STATE_RAMPDOWN = 0x40;

	//Sensor types
	this.NO_SENSOR = 0x00;
	this.SWITCH = 0x01;
	this.TEMPERATURE = 0x02;
	this.REFLECTION = 0x03;
	this.ANGLE = 0x04;
	this.LIGHT_ACTIVE = 0x05;
	this.LIGHT_INACTIVE = 0x06;
	this.SOUND_DB = 0x07;
	this.SOUND_DBA = 0x08;
	this.CUSTOM = 0x09;
	this.LOWSPEED = 0x0a;
	this.LOWSPEED_9V = 0x0b;
	this.NO_OF_SENSOR_TYPES = 0x0c;

	//Sensor modes
	this.RAWMODE = 0x00;
	this.BOOLEANMODE = 0x20;
	this.TRANSITIONCNTMODE = 0x40;
	this.PERIODCOUNTERMODE = 0x60;
	this.PCTFULLSCALEMODE = 0x80;
	this.CELSIUSMODE = 0xa0;
	this.FAHRENHEITMODE = 0xc0;
	this.ANGLESTEPSMODE = 0xe0;
	this.SLOPEMASK = 0x1f;
	this.MODEMASK = 0xe0;
};

Nxt.prototype.nxt_error_messages = {
	0x00: "OK",
	0x20: "Pending communication transaction in progress",
	0x40: "Specified mailbox queue is empty",
	0xbd: "Request failed (i.e. specified file not found)",
	0xbe: "Unknown command opcode",
	0xbf: "Insane packet",
	0xc0: "Data contains out-of-range values",
	0xdd: "Communication bus error",
	0xde: "No free memory in communication buffer",
	0xdf: "Specified channel/connection is not valid",
	0xe0: "Specified channel/connection not configured or busy",
	0xec: "No active program",
	0xed: "Illegal size specified",
	0xee: "Illegal mailbox queue ID specified",
	0xef: "Attempted to access invalid field of a structure",
	0xf0: "Bad input or output specified",
	0xfb: "Insufficient memory available",
	0xff: "Bad arguments"
};

Nxt.prototype.nxt_commands = {
	0x00: 'startprogram',
	0x01: 'stopprogram',
	0x02: 'playsoundfile',
	0x03: 'playtone',
	0x04: 'setoutputstate',
	0x05: 'setinputmode',
	0x06: 'getoutputstate',
	0x07: 'getinputvalues',
	0x08: 'resetinputscaledvalue',
	0x09: 'messagewrite',
	0x0a: 'resetmotorposition',
	0x0b: 'getbatterylevel',
	0x0c: 'stopsoundplayback',
	0x0d: 'keepalive',
	0x0e: 'lsgetstatus',
	0x0f: 'lswrite',
	0x10: 'lsread',
	0x11: 'getcurrentprogramname',
	0x13: 'messageread'
};

Nxt.prototype.start_program = function (program_name) {
	//TODO: Implement
};

Nxt.prototype.stop_program = function () {
	var command = new Buffer([0x00, 0x01]);
	this.execute_command(command);
};

Nxt.prototype.play_tone = function (freq, dur) {
	var command = new Buffer([0x00, 0x03, freq & 0xff, (freq >> 8) & 0xff, dur & 0x00ff, (dur >> 8) & 0xff]);
	this.execute_command(command);
};

Nxt.prototype.set_output_state = function (port, power, mode, reg_mode, turn_ratio, run_state, tacho_limit) {
	var tacho = [];
	tacho[0] = tacho_limit & 0xff;
	tacho[1] = (tacho_limit >> 8) & 0xff;
	tacho[2] = (tacho_limit >> 16) & 0xff;
	tacho[3] = (tacho_limit >> 24) & 0xff;
	var command_arr = [0x00, 0x04, port, ((power + 100) % 200) - 100, mode, reg_mode, ((turn_ratio + 100) % 200), run_state, tacho[0], tacho[1], tacho[2], tacho[3]];
	var command = new Buffer(command_arr);	
	this.execute_command(command);
};

Nxt.prototype.set_input_state = function (port, sensor_type, sensor_mode) {
	//TODO: Implement
};

Nxt.prototype.get_output_state = function (port) {
	//TODO: Implement
};

Nxt.prototype.get_input_state = function (port) {
	//TODO: Implement
};

Nxt.prototype.reset_input_scaled_value = function (port) {
	//TODO: Implement
};

Nxt.prototype.message_write = function (inbox_no, message) {
	//TODO: Implement
};

Nxt.prototype.reset_motor_position = function (port, relative) {
	//TODO: Implement
};

Nxt.prototype.get_battery_level = function () {
	var command = new Buffer([0x00, 0x0b]);
	this.execute_command(command);
};

Nxt.prototype.stop_sound_playback = function () {
	var command = new Buffer([0x00, 0x0c]);
	this.execute_command(command);
};

Nxt.prototype.keep_alive = function () {
	var command = new Buffer([0x00, 0x0d]);
	this.execute_command(command);
};

Nxt.prototype.ls_get_status = function (port) {
	//TODO: Implement
}

Nxt.prototype.ls_write = function (port, rx_read_length, tx_data) {
	//TODO: Implement
};

Nxt.prototype.ls_read = function (port) {
	//TODO: Implement
};

Nxt.prototype.get_current_program_name = function () {
	var command = new Buffer([0x00, 0x11]);
	this.execute_command(command);
};

Nxt.prototype.message_read = function (remote_inbox_no, local_inbox_no, remove_remote_msg) {
	//TODO: Implement
};

Nxt.prototype.execute_command = function (command, callback) {
	//The bluetooth packet need a length (2-bytes) in front of the packet
	var real_command = new Buffer(command.length + 2);
	command.copy(real_command, 2);
	real_command[0] = command.length & 0xff;
	real_command[1] = (command.length >> 8) & 0xff;
	if (this.initialized !== true) {
		console.log("NXT not initialized!!!");
	}
	this.sp.write(real_command);
};

Nxt.prototype.status_handle = function (data) {
	data = data.slice(2);
	if (data[2] > 0) {
		console.log("Error did happen!!!\nThe error: " + this.nxt_error_messages[data[2]]);
	} else {
		if (this.data_handles.hasOwnProperty(data[1])) {
			this.data_handles[data[1]](data);
		} else {
			this.default_return_handle(data);
		}
	}
};

SerialPort.prototype.default_return_handle = function (data) {
	console.log("**************");
	console.log("Got some data:");
	console.log(data);
	console.log(this.nxt_error_messages[data[2]]);
	console.log("**************");
};

Nxt.prototype.register_callback = function (method, callback) {
	var i;
	for (i in this.nxt_commands) {
		if (method === this.nxt_commands[i]) {
			this.sp.data_handles[i] = callback;
			break;
		}
	}
};

Nxt.prototype.close_connection = function (sp) {
	sp.end(false,null);
};

module.exports.Nxt = Nxt;
