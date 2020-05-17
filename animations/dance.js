var common = require("./common.js");

function dance() {
	var name = "dance.js";
	var DanceSpeed = 10;
	var rainbowCycleI,
		rainbowCycleJ = 0;

	this.GoDance = function (args, strip) {
		strip.Mode = name + "dance";
		console.log("Going dance mode.");
		this.DanceTick(args, strip);
	};

	this.DanceTick = function (args, strip) {
		var _this = this;

		if (rainbowCycleJ < 256 * 5) {
			if (rainbowCycleI < strip.NUM_LEDS) {
				strip.Lights[rainbowCycleI] = common.colorWheel(
					((rainbowCycleI * 256) / strip.NUM_LEDS + rainbowCycleJ) & 255
				);

				rainbowCycleI++;
				strip.Render();
			} else {
				strip.Render();
				rainbowCycleI = 0;
				rainbowCycleJ++;
			}
		} else {
			rainbowCycleI = 0;
			rainbowCycleJ = 0;
		}

		strip.Render();

		setTimeout(function () {
			if (strip.Mode == name + "dance") {
				_this.DanceTick(args, strip);
			}
		}, DanceSpeed);
	};
}

// colorWipe( 0xff3b00 , DanceSpeed); // Red
// theaterChase( 0xf8f9de , DanceSpeed); // White
// colorWipe( 0x0043ff , DanceSpeed); // Blue
// colorWipe( 0x1eff0a , DanceSpeed); // Green
// theaterChase( 0xff3b00 , DanceSpeed); // Red
// theaterChase( 0x0043ff , DanceSpeed); // Blue

module.exports = new dance();
