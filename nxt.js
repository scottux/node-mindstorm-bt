"use strict";

//var serialport = require("serialport");
var serialport = require("node_modules/serialport/serialport");
var SerialPort = serialport.SerialPort;


var Nxt = function (port) {

	var initialized = false;

	var data_handles = {};
	var sp = new SerialPort(port, {
		parser: serialport.parsers.raw
	});
	this.initialized = true;
	this.sp.on('data', Nxt.status_handle);
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

Nxt.prototype.stop_program = function () {
	var command = new Buffer([0x00, 0x01]);
	this.execute_command(command);
};

Nxt.prototype.play_tone = function (freq, dur) {
	var command = new Buffer([0x00, 0x03, freq & 0xff, (freq >> 8) & 0xff, dur & 0x00ff, (dur >> 8) & 0xff]);
	this.execute_command(command);
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

Nxt.prototype.get_current_program_name = function () {
	var command = new Buffer([0x00, 0x11]);
	this.execute_command(command);
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

Nxt.prototype.default_return_handle = function (data) {
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
			this.data_handles[i] = callback;
			break;
		}
	}
};

module.exports.Nxt = Nxt;