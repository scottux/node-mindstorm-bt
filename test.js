var serialport = require("node_modules/serialport/serialport");
var SerialPort = serialport.SerialPort;

var Nxt = {

	sp: null,
	initialized: false, 

	data_handles: {},

	nxt_error_messages: {
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
	},

	nxt_commands: {
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
	},

	init: function(port) {
		Nxt.sp = new SerialPort(port, {
			parser: serialport.parsers.raw
		});
		Nxt.initialized = true;
		Nxt.sp.on('data', Nxt.status_handle);
	},

	stop_program: function() {
		var command = new Buffer([0x00, 0x01]); 
		Nxt.execute_command(command);
	},
		
	play_tone: function(freq, dur) {
		var command = new Buffer([0x00, 0x03, freq & 0xff, (freq >> 8) & 0xff, dur & 0x00ff, (dur >> 8) & 0xff]); 
		Nxt.execute_command(command);
	},

	get_battery_level: function() {
		var command = new Buffer([0x00, 0x0b]); 
		Nxt.execute_command(command);
	},

	stop_sound_playback: function() {
		var command = new Buffer([0x00, 0x0c]); 
		Nxt.execute_command(command);
	},
	
	keep_alive: function() {
		var command = new Buffer([0x00, 0x0d]); 
		Nxt.execute_command(command);
	},

	get_current_program_name: function() {
		var command = new Buffer([0x00, 0x11]); 
		Nxt.execute_command(command);
	},
		
	execute_command: function(command, callback) {
		//The bluetooth packet need a length (2-bytes) in front of the packet
		var real_command = new Buffer(command.length+2);
		command.copy(real_command, 2);
		real_command[0] = command.length & 0xff;
		real_command[1] = (command.length >> 8) & 0xff;
		if (Nxt.initialized !== true) {
			console.log("NXT not initialized!!!");
		}
		Nxt.sp.write(real_command);
	},

	status_handle: function(data) {
		data = data.slice(2);
		if (data[2] > 0) {
			console.log("Error did happen!!!\nThe error: "+Nxt.nxt_error_messages[data[2]]);
		} else {
			if (data[1] in Nxt.data_handles) {
				Nxt.data_handles[data[1]](data);
			} else {
				Nxt.default_return_handle(data);
			}
		}
	},

	default_return_handle: function(data) {
		console.log("**************");
		console.log("Got some data:");
		console.log(data);
		console.log(Nxt.nxt_error_messages[data[2]]);
		console.log("**************");
	},

	register_callback: function(method, callback) {
		for (i in Nxt.nxt_commands) {
			if (method === Nxt.nxt_commands[i]) {
				Nxt.data_handles[i] = callback;
				break;
			}
		}
	}
};

Nxt.init("/dev/tty.NXT-DevB");
Nxt.play_tone(440,1000);

