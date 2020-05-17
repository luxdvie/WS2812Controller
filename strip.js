/**
 * Put your number of LED's here
 */
var NUM_LEDS = 100;
var ws281x = require("rpi-ws281x-native");
var pixelData = new Uint32Array(NUM_LEDS);
var Lights = [];

ws281x.init(NUM_LEDS);

function strip() {
	this.NUM_LEDS = NUM_LEDS;
	this.Mode = "";
	this.Lights = [];
	this.Clear = function () {
		ws281x.reset();
	};

	/**
	 * Clear all LED's back to 0x00000 and render
	 */
	this.Stop = function () {
		strip.Clear();
		CurrentMode = MODES.CLEAR;
	};

	/**
	 * Assign the brightness of the whole strip.
	 */
	this.SetBrightness = function (brightness) {
		ws281x.setBrightness(brightness);
	};

	/**
	 * Set a single color for all LED's
	 */
	this.SetStripColor = function (color) {
		for (var i = 0; i < NUM_LEDS; i++) {
			this.Lights[i] = color;
		}
		this.Render();
	};

	/**
	 * Render the current state of the LED strip
	 */
	this.Render = function () {
		var tmp = [];
		for (var i = 0; i < NUM_LEDS; i++) {
			if (i > NUM_LEDS) break;
			tmp[i] = this.Lights[i];
		}

		ws281x.render(tmp);
	};
}

module.exports = new strip();
