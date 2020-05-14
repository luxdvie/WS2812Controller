/*******************************
	animation control
*******************************/
var common = require("./common.js");
var name = "control.js";

function control() {
	this.Stop = function (args, strip) {
		strip.SetStripColor(0);
		strip.Mode = "STOP";
		console.log("Stopped strip");
	};
}

module.exports = new control();
