/*******************************
	christmas animations
*******************************/
var common = require("./common.js");
var name = "xmas.js";
var Xmas1Speed = 750;

function xmas() {
	/*******************************
	Christmas Mode 1
*******************************/
	/*
	 *	Christmas mode 1. Randomly cycle R / G / B / W through the strip
	 */
	this.GoXmas1 = function (args, strip) {
		strip.Mode = name + "GoXmas1";
		this.Xmas1Tick(strip);
		console.log("Starting GoXmas1");
		return "Going XMAS 1";
	};

	this.Xmas1Tick = function (strip) {
		var self = this;
		for (var index = 0; index < strip.NUM_LEDS; index++) {
			strip.Lights[index] = common.RandomXmasColor();
		}

		strip.Render();

		setTimeout(function () {
			if (strip.Mode == name + "GoXmas1") {
				self.Xmas1Tick(strip);
			} else {
				Xmas1Speed = 750;
			}
		}, Xmas1Speed);
	};

	/*******************************
		Christmas Mode 2
			Christmas mode 2. Iterate R / G / B / W through the strip from top to bottom and bottom to top
*******************************/
	var DanceWidth = 15;
	var DanceArray = [];
	var XmasIterateSpeed = 75;
	var XmasIterateOffset = 0;

	this.GoXmasIterate = function (args, strip) {
		strip.Mode = name + "GoXmasIterate";
		console.log("Starting GoXmasIterate");
		this.XmasIterateSetup();
		this.XmasIterateTick(strip);
	};

	this.XmasIterateSetup = function () {
		for (var d = 0; d < DanceWidth; d++) {
			DanceArray[d] = common.RandomXmasColor();
		}
	};

	this.XmasIterateTick = function (strip) {
		var _this = this;

		strip.SetStripColor(0);
		var DanceArrayIndex = 0;
		var x = 0 + XmasIterateOffset;
		for (x; x < strip.NUM_LEDS; x++) {
			if (DanceArrayIndex < DanceWidth) {
				strip.Lights[x] = DanceArray[DanceArrayIndex];
			}
			DanceArrayIndex++;
		}
		DanceArrayIndex = 0;
		var y = strip.NUM_LEDS - XmasIterateOffset;
		for (y; y > 0; y--) {
			if (DanceArrayIndex < DanceWidth) {
				strip.Lights[y] = DanceArray[DanceArrayIndex];
			}
			DanceArrayIndex++;
		}

		XmasIterateOffset++;
		if (XmasIterateOffset > strip.NUM_LEDS) {
			XmasIterateOffset = 0;
			for (var d = 0; d < DanceWidth; d++) {
				DanceArray[d] = common.RandomXmasColor();
			}
		}

		strip.Render();

		setTimeout(function () {
			if (strip.Mode == name + "GoXmasIterate") {
				_this.XmasIterateTick(strip);
			} else {
				XmasIterateSpeed = 100;
			}
		}, XmasIterateSpeed);
	};
}

module.exports = new xmas();
