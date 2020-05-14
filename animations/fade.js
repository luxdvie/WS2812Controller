/*******************************
	christmas animations
*******************************/
var common = require("./common.js");
var name = "fade.js";

/*******************************
	fader methods
*******************************/

var Fade2Color1;
var Fade2Color2;
var CurrentFadeColor;
var Brightness = 255;
var FadingDown = true;
var FadeSpeed = 10;

function fader() {
	this.GoFade2 = function (args, strip) {
		console.log("Starting Fade 2 Colors");
		Fade2Color1 = parseInt("0x" + args.Color1);
		Fade2Color2 = parseInt("0x" + args.Color2);

		CurrentFadeColor = Fade2Color1;
		strip.SetStripColor(CurrentFadeColor);

		strip.Mode = "GoFade2";
		this.FadeTick(strip);
	};

	this.FadeTick = function (strip) {
		var _this = this;

		if (strip.Mode != "GoFade2") {
			strip.SetBrightness(255);
			return;
		}

		if (FadingDown) {
			// go down
			if (Brightness <= 50) {
				FadingDown = false;
				if (CurrentFadeColor == Fade2Color1) {
					CurrentFadeColor = Fade2Color2;
				} else {
					CurrentFadeColor = Fade2Color1;
				}
				strip.SetStripColor(CurrentFadeColor);
			} else {
				// fade down
				strip.SetBrightness(Brightness);
				Brightness--;
			}
		} else {
			// go up
			if (Brightness > 254) {
				FadingDown = true;
			} else {
				// fade down
				strip.SetBrightness(Brightness);
				Brightness++;
			}
		}

		if (strip.Mode == "GoFade2") {
			setTimeout(function () {
				_this.FadeTick(strip);
			}, FadeSpeed);
		} else {
			FadeSpeed = 10;
			strip.SetBrightness(255);
		}
	};

	this.FadeSpeed = function (args, strip) {
		var val = parseInt(args.speed);
		var mappedVal = common.map_range(val, 0, 100, 10, 1);
		if (typeof mappedVal === "number") {
			FadeSpeed = mappedVal;
			console.log("Updated fade speed: " + FadeSpeed);
		} else {
			FadeSpeed = 1000 / 30;
		}
	};
}

module.exports = new fader();
