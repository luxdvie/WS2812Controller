var common = require("./common.js");

function twinkle() {
	var name = "twinkle.js";
	var WasTwinkling = false;
	var TwinkleSpeed = 250;
	var LastStates = [];

	// Good, white colors to use to simulate starry nights :)
	var TwinkleColors = [
		0xffffff,
		0xfcfcfc,
		0xfafafa,
		0xf7f7f7,
		0xf5f5f5,
		0xf2f2f2,
		0xf0f0f0,
		0xededed,
		0xebebeb,
		0xe8e8e8,
		0xe5e5e5,
		0xe3e3e3,
		0xe0e0e0,
		0xdedede,
		0xdbdbdb,
		0xd9d9d9,
		0xd6d6d6,
		0xd4d4d4,
		0xd1d1d1,
		0xcfcfcf,
		0xcccccc,
		0xc9c9c9,
		0xc7c7c7,
		0xc4c4c4,
		0xc2c2c2,
		0xbfbfbf,
		0xbdbdbd,
		0xbababa,
		0xb8b8b8,
		0xb5b5b5,
		0xb3b3b3,
		0xb0b0b0,
	];

	this.GoTwinkle = function (args, strip) {
		strip.Mode = name + "twinkle";
		console.log("Going twinkle / starry mode.");
		this.TwinkleTick(args, strip);
	};

	this.TwinkleTick = function(args, strip) {
		var _this = this;

		if (!WasTwinkling) {
			for (var x = 0; x < strip.NUM_LEDS; x++) {
				// choose a random init point
				var init = common.getRandomInt(0, TwinkleColors.length - 1);
				LastStates[x] = TwinkleColors[init]; // default white color
				strip.Lights[x] = LastStates[x];
			}

			strip.Render();
			WasTwinkling = true;
		} else {
			for (var x = 0; x < strip.NUM_LEDS; x++) {
				var shouldTwinkle = common.getRandomInt(0, 100);
				if (shouldTwinkle > 10) {
					// only a 50% chance of twinkling
					var currentColor = LastStates[x];
					var newColor = this.GetNextColor(currentColor);
					LastStates[x] = newColor;
					strip.Lights[x] = LastStates[x];
				}
			}

			strip.Render();
		}

		// dark color 616a5d
		// lightest color 0xE1E2DC
		setTimeout(function () {
			if (strip.Mode == name + "twinkle") {
				_this.TwinkleTick(args, strip);
			}
		}, TwinkleSpeed);
	}

	this.GetNextColor = function (col, rand) {
		var ind = TwinkleColors.indexOf(col);
		if (ind == TwinkleColors.length + 1) {
			// choose the first
			return TwinkleColors[0];
		} else {
			// choose the next
			return TwinkleColors[ind + 1];
		}
	};
}

module.exports = new twinkle();
