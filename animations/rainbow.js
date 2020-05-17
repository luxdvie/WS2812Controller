/*******************************
	rainbow animations
*******************************/
var common = require("./common.js");

function rainbow() {
	var name = "rainbow.js";
	var RainbowOffset = 0;
	var RainbowSpeed = 1000 / 30;

	this.GoRainbow = function (args, strip) {
		strip.Mode = name + "rainbow";
		console.log("Going rainbow mode.");
		this.RainbowTick(args, strip);
	};

	this.RainbowTick = function (args, strip) {
		var _this = this;
		for (var i = 0; i < strip.NUM_LEDS; i++) {
			strip.Lights[i] = common.colorWheel((RainbowOffset + i) % 256);
		}

		RainbowOffset = (RainbowOffset + 1) % 256;

		strip.Render();

		setTimeout(function () {
			if (strip.Mode == name + "rainbow") {
				_this.RainbowTick(args, strip);
			} else {
				RainbowOffset = 0;
			}
		}, RainbowSpeed);
	};

	this.RainbowSpeed = function (args, strip) {
		var val = parseInt(args.speed);
		var mappedVal = common.map_range(val, 0, 100, 50, 5);
		if (typeof mappedVal === "number") {
			RainbowSpeed = mappedVal;
			console.log("New rainbow speed: " + RainbowSpeed);
		} else {
			RainbowSpeed = 1000 / 30;
		}
	};
}

module.exports = new rainbow();
