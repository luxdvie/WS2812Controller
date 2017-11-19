/*******************************
	WS2812 LED Control
		Austin Brown
		austin@brogencreations.com
*******************************/
	/* Common Libraries */
		var express = require('express');
		var app = express();
		var bodyParser = require('body-parser');
		var path = require("path");
		app.use(express.static(__dirname + '/public'));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));

	/* NeoPixel Setup */
		var ws281x = require('rpi-ws281x-native');
		var NUM_LEDS = 100, pixelData = new Uint32Array(NUM_LEDS);
		ws281x.init(NUM_LEDS);
		var color = 0x4b42f4;

	/* Setup */
		var MODES = { "INIT": 0, "FADE2": 1, "RAINBOW" : 2, "MANUAL" : 3, "CLEAR": 4, "DANCE": 5, "TWINKLE" : 6, "XMAS1" : 7 };


/*******************************
	$app Instance
*******************************/

		var $app = {} || $app;

		$app = {

			// The array representing our lights
			Lights: [],

			// The current mode our app is in
			Mode: MODES.INIT,

			Tick: function() {}
		};



/*******************************
	Strip
*******************************/

		/*
		*   Clear all LEDs back to 0x00000 and render
		*/
		function StripStop() {
			for (var i = 0; i < NUM_LEDS; i++) {
				$app.Lights[i] = 0; // default purple color
			}
			StripRender();
			$app.Mode = MODES.CLEAR;
		}

		/*
		*   Resets the strip back to startup setting.
		*/
		function SetStripColor( color ) {
			$app.Lights = [];
			for (var i = 0; i < NUM_LEDS; i++) {
				$app.Lights[i] = color; // default purple color
			}
			StripRender();	
		}

		/*
		*   Resets the strip back to startup setting.
		*/
		function ResetStrip() {
			$app.Lights = [];
			for (var i = 0; i < NUM_LEDS; i++) {
				$app.Lights[i] = 0xa94f66; // default purple color
			}
			StripRender();	
		}

		/* 
		*	Renders the Lights strip
		*/
		function StripRender() {
			var tmp = [];
			for (var i = 0; i < NUM_LEDS; i++) {
				tmp[i] = $app.Lights[i];
			}
			ws281x.render(tmp);
		}
	

/*******************************
	Web Methods
*******************************/
	
	/*******************************
		Home
	*******************************/
		app.get('/',function(req,res){
			res.header("Access-Control-Allow-Origin", "*");
		    res.sendFile(path.join(__dirname+'/app.html'));
		});

	/*******************************
		Rainbow
	*******************************/
		app.get("/rainbow", function(req,res) {
			res.header("Access-Control-Allow-Origin", "*");
			res.send("Switching to rainbow.");
			if ($app.Mode != MODES.RAINBOW) GoRainbow();
		});

		app.post('/rainbowspeed', function(request, response){
			response.header("Access-Control-Allow-Origin", "*");
			if (request && request.body && request.body.speed) {
				
				var val = parseInt(request.body.speed);
				var mappedVal = map_range( val, 0, 100, 50, 5 );
				if (typeof mappedVal === "number") {
					RainbowSpeed = mappedVal;	
				} else {
					RainbowSpeed = 1000 / 30;
				}
			}
			response.send("rainbowspeed rsp: " + RainbowSpeed);
		});

	/*******************************
		Dance
	*******************************/
		app.get("/dance", function(req,res) {
			res.header("Access-Control-Allow-Origin", "*");
			res.send("Switching to dance.");
			if ($app.Mode != MODES.DANCE) GoDance();
		});

		app.post('/dancespeed', function(request, response){
			res.header("Access-Control-Allow-Origin", "*");
			if (request && request.body && request.body.speed) {
				
				var val = parseInt(request.body.speed);
				var mappedVal = map_range( val, 0, 100, 50, 5 );
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
		app.get("/twinkle", function(req,res) {
			res.header("Access-Control-Allow-Origin", "*");
			res.send("Switching to twinkle.");
			if ($app.Mode != MODES.TWINKLE) GoTwinkle();
		});

	/*******************************
		Fade 2 Colors
	*******************************/
		app.post('/fade2colors', function(request, response){
			response.header("Access-Control-Allow-Origin", "*");
			if (request && request.body && request.body.color1 && request.body.color2) {
				
				var col1 = request.body.color1;
				var col2 = request.body.color2;
				GoFade2Colors(col1, col2);
			}
			response.send("fade2colors rsp");
		});

		app.post('/fadespeed', function(request, response){
			response.header("Access-Control-Allow-Origin", "*");
			if (request && request.body && request.body.speed) {
				
				var val = parseInt(request.body.speed);
				var mappedVal = map_range( val, 0, 100, 10, 1 );
				if (typeof mappedVal === "number") {
					FadeSpeed = mappedVal;	
				} else {
					FadeSpeed = 1000 / 30;
				}
			}
			response.send("fadespeed rsp: " + FadeSpeed);
		});

	/*******************************
		Clear
	*******************************/
		app.get("/stop", function(req,res) {
			res.header("Access-Control-Allow-Origin", "*");
			res.send("Stopping the strip.");
			StripStop();
		});

	/*******************************
		Christmas Mode 1
	*******************************/
		app.get('/xmas1', function(request, response){
			response.header("Access-Control-Allow-Origin", "*");
			GoXmas1();
			response.send("Going Xmas1");
		});

/*******************************
	Animation Groups
*******************************/
	
	/*******************************
		Christmas Mode 1
	*******************************/
		/*
		*	Christmas mode 1. Randomly cycle R / G / B / W through the strip
		*/
		function GoXmas1() {
			$app.Mode = MODES.XMAS1;
			Xmas1Tick();
		}

		var XmasRed = 0xff0000;
		var XmasGreen = 0x00ff00;
		var XmasBlue = 0x0000ff;
		var XmasWhite = 0xffffff;
		var Xmas1Speed = 750;
		function Xmas1Tick() {	

			for (var index=0; index < NUM_LEDS; index++) {
				var xmasLight = getRandomInt(1, 4);
				var xmasColor = XmasRed;
				switch (xmasLight) {
					case 1: 
						xmasColor = XmasRed;
					break;
					case 2: 
						xmasColor = XmasGreen;
					break;
					case 3:
						xmasColor = XmasBlue;
					break;
					case 4: 
						xmasColor = XmasWhite;
					break;
				}
								
				$app.Lights[index] =  xmasColor;
			}

			StripRender();

			setTimeout(function () {
				if ($app.Mode == MODES.XMAS1) {
					Xmas1Tick();
				} else {
					Xmas1Speed = 750;
				}
			}, Xmas1Speed);

		}

	/*******************************
		Fade 2 Colors
	*******************************/
		var Fade2Color1;
		var Fade2Color2;
		var CurrentFadeColor;
		var Brightness = 255;
		var FadingDown = true;
		var FadeSpeed = 10;
		function GoFade2Colors(col1, col2) {
			Fade2Color1 = parseInt("0x"+col1);
			Fade2Color2 = parseInt("0x"+col2);
			CurrentFadeColor = Fade2Color1;
			SetStripColor(CurrentFadeColor);
			if ($app.Mode != MODES.FADE2) {
				$app.Mode = MODES.FADE2;
				FadeTick();	
			}		
			$app.Mode = MODES.FADE2;
			
		}

		function FadeTick() 
		{
			if ($app.Mode != MODES.FADE2) {
				ws281x.setBrightness( 255 );
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
					SetStripColor( CurrentFadeColor );
				} else {
					// fade down
					ws281x.setBrightness( Brightness );
					Brightness--;
				}
			} else {
				// go up
				if (Brightness > 254) {
					FadingDown = true;
					
				} else {
					// fade down
					ws281x.setBrightness( Brightness );
					Brightness++;
				} 
			}
			setTimeout(function () {
				if ($app.Mode == MODES.FADE2) {
					FadeTick();
				} else {
					FadeSpeed = 1000 / 30;
					ws281x.setBrightness( 255 );
				}
			}, FadeSpeed);

		}

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


			setTimeout(function(){
				if ( IsDancing() ) {
					// DanceTick();
				}
			}, 10);

		}

		var rainbowCycleI, rainbowCycleJ = 0;
		function rainbowCycle(wait, cb) {
			
			if ( rainbowCycleJ <  256*5 ) {
				if ( rainbowCycleI < NUM_LEDS ) {
					$app.Lights[rainbowCycleI] = Wheel(((rainbowCycleI * 256 / NUM_LEDS) + rainbowCycleJ) & 255);
					rainbowCycleI++;
					setTimeout( function(){ 
						if (IsDancing()) {
							rainbowCycle(wait, cb); 	
						}					
					}, wait );
					StripRender();

				} else {
					StripRender();
					rainbowCycleI = 0; 
					rainbowCycleJ++;

					setTimeout( function(){ 
						if (IsDancing()) {
							rainbowCycle(wait, cb); 	
						}					
					}, wait );

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

		function Wheel(WheelPos) {
		if(WheelPos < 85) {
		return rgbToHex(WheelPos * 3, 255 - WheelPos * 3, 0);
		} else if(WheelPos < 170) {
		WheelPos -= 85;
		return rgbToHex(255 - WheelPos * 3, 0, WheelPos * 3);
		} else {
		WheelPos -= 170;
		return rgbToHex(0, WheelPos * 3, 255 - WheelPos * 3);
		}
		}

		function rgbToHex(r, g, b) {
			return parseInt("0x" + componentToHex(r) + componentToHex(g) + componentToHex(b));
		}
		function componentToHex(c) {
			var hex = c.toString(16);
			return hex.length == 1 ? "0" + hex : hex;
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
				return TwinkleColors[ind+1];
			}
		}

		// = [ , 0xeaeaea, 0xd8d6d6, 0xbfbfbf, 0xa8a8a8, 0xE1E2DC, 0xc1c1bf, 0xa5a5a4, 0x898988, 0x616a5d  ];
		var TwinkleColors = [ 0xffffff, 0xFCFCFC, 0xFAFAFA, 0xF7F7F7, 0xF5F5F5, 0xF2F2F2, 0xF0F0F0, 0xEDEDED, 0xEBEBEB, 0xE8E8E8, 0xE5E5E5, 0xE3E3E3, 0xE0E0E0, 0xDEDEDE, 0xDBDBDB, 0xD9D9D9, 0xD6D6D6, 0xD4D4D4, 0xD1D1D1, 0xCFCFCF, 0xCCCCCC, 0xC9C9C9, 0xC7C7C7, 0xC4C4C4, 0xC2C2C2, 0xBFBFBF, 0xBDBDBD, 0xBABABA, 0xB8B8B8, 0xB5B5B5, 0xB3B3B3, 0xB0B0B0];

		function TwinkleTick() {
			if (!WasTwinkling) {
				for (var x=0; x< NUM_LEDS;x++) {
					// choose a random init point
					var init = getRandomInt(0, TwinkleColors.length -1);
					LastStates[x] = TwinkleColors[init]; // deafult white color
					$app.Lights[x] = LastStates[x];
				}
				StripRender();
				WasTwinkling = true;	
			} else {

				for (var x=0; x< NUM_LEDS;x++) {
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

			setTimeout(function(){
				if ( $app.Mode == MODES.TWINKLE ) {		
					TwinkleTick();
				}
			}, TwinkleSpeed);
			

		}

		function getRandomInt(min, max) {			
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

	/*******************************
		Rainbow
	*******************************/

		function GoRainbow() {
			$app.Mode = MODES.RAINBOW;
			RainbowTick();
		}

		var RainbowOffset = 0;
		var RainbowSpeed = 1000 / 30;
		function RainbowTick() 
		{
			for (var i = 0; i < NUM_LEDS; i++) {
				pixelData[i] = colorwheel((RainbowOffset + i) % 256);
			}

			RainbowOffset = (RainbowOffset + 1) % 256;
			ws281x.render(pixelData);
			
			setTimeout(function () {
				if ($app.Mode == MODES.RAINBOW) {
					RainbowTick();
				} else {
					ChooseNextMode();
					RainbowOffset = 0;
				}
			}, RainbowSpeed);
		}
		

/*******************************
	Common
*******************************/

	function ChooseNextMode() {

		switch ($app.Mode) {


			case MODES.RAINBOW: 
				GoRainbow();
				break;
		}


	}

	// rainbow-colors, taken from http://goo.gl/Cs3H0v
	function colorwheel(pos) {
	  pos = 255 - pos;
	  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
	  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
	  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
	}

	function rgb2Int(r, g, b) {
	  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
	}

	function map_range(value, low1, high1, low2, high2) {
	    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}

/*******************************
	RUN
*******************************/
	
	if ($app.Mode == MODES.INIT) {	
		GoRainbow();
	}

	var server = app.listen(80, function() {
		console.log('***************************');	
		console.log(' LED APPLICATION STARTUP ');	
		console.log('***************************');	
	});