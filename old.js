/*******************************
    Dance
*******************************/
app.get("/dance", function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.send("Switching to dance.");
	if ($app.Mode != MODES.DANCE) GoDance();
});

app.post("/dancespeed", function (request, response) {
	res.header("Access-Control-Allow-Origin", "*");
	if (request && request.body && request.body.speed) {
		var val = parseInt(request.body.speed);
		var mappedVal = map_range(val, 0, 100, 50, 5);
		if (typeof mappedVal === "number") {
			DanceSpeed = mappedVal;
		} else {
			DanceSpeed = 1000 / 30;
		}
	}
	response.send("DanceSpeed rsp: " + DanceSpeed);
});

/*******************************
    Twinkle
*******************************/
app.get("/twinkle", function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.send("Switching to twinkle.");
	if ($app.Mode != MODES.TWINKLE) GoTwinkle();
});

/*******************************
    Dance
*******************************/

function GoDance() {
	$app.Mode = MODES.DANCE;
	DanceTick();
}

var DanceSpeed = 10;
function DanceTick() {
	// colorWipe( 0xff3b00 , DanceSpeed); // Red
	// theaterChase( 0xf8f9de , DanceSpeed); // White
	// colorWipe( 0x0043ff , DanceSpeed); // Blue
	// colorWipe( 0x1eff0a , DanceSpeed); // Green
	// theaterChase( 0xff3b00 , DanceSpeed); // Red
	// theaterChase( 0x0043ff , DanceSpeed); // Blue\

	rainbowCycle(0, rainbowCycle);

	setTimeout(function () {
		if (IsDancing()) {
			// DanceTick();
		}
	}, 10);
}

var rainbowCycleI,
	rainbowCycleJ = 0;
function rainbowCycle(wait, cb) {
	if (rainbowCycleJ < 256 * 5) {
		if (rainbowCycleI < NUM_LEDS) {
			$app.Lights[rainbowCycleI] = Wheel(
				((rainbowCycleI * 256) / NUM_LEDS + rainbowCycleJ) & 255
			);
			rainbowCycleI++;
			setTimeout(function () {
				if (IsDancing()) {
					rainbowCycle(wait, cb);
				}
			}, wait);
			StripRender();
		} else {
			StripRender();
			rainbowCycleI = 0;
			rainbowCycleJ++;

			setTimeout(function () {
				if (IsDancing()) {
					rainbowCycle(wait, cb);
				}
			}, wait);
		}
	} else {
		rainbowCycleI = 0;
		rainbowCycleJ = 0;
		if (cb) cb(wait, cb);
	}
}

function IsDancing() {
	return $app.Mode == MODES.DANCE;
}

/*******************************
    Twinkle
*******************************/
var WasTwinkling = false;
var TwinkleSpeed = 500;
function GoTwinkle() {
	$app.Mode = MODES.TWINKLE;
	WasTwinkling = false;
	TwinkleTick();
}

var LastStates = [];

function GetNextColor(col, rand) {
	var ind = TwinkleColors.indexOf(col);
	if (ind == TwinkleColors.length + 1) {
		// choose the first
		return TwinkleColors[0];
	} else {
		// choose the next
		return TwinkleColors[ind + 1];
	}
}

// = [ , 0xeaeaea, 0xd8d6d6, 0xbfbfbf, 0xa8a8a8, 0xE1E2DC, 0xc1c1bf, 0xa5a5a4, 0x898988, 0x616a5d  ];
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

function TwinkleTick() {
	if (!WasTwinkling) {
		for (var x = 0; x < NUM_LEDS; x++) {
			// choose a random init point
			var init = getRandomInt(0, TwinkleColors.length - 1);
			LastStates[x] = TwinkleColors[init]; // deafult white color
			$app.Lights[x] = LastStates[x];
		}
		StripRender();
		WasTwinkling = true;
	} else {
		for (var x = 0; x < NUM_LEDS; x++) {
			var shouldTwinkle = getRandomInt(0, 100);
			if (shouldTwinkle > 10) {
				// only a 50% chance of twinkling
				var currentColor = LastStates[x];
				var newColor = GetNextColor(currentColor);
				LastStates[x] = newColor;
				$app.Lights[x] = LastStates[x];
			}
		}
		StripRender();
	}
	// dark color 616a5d

	// lightest color 0xE1E2DC

	setTimeout(function () {
		if ($app.Mode == MODES.TWINKLE) {
			TwinkleTick();
		}
	}, TwinkleSpeed);
}
