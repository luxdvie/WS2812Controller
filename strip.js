/* 
*   Put your number of LEDs here.
*/
var NUM_LEDS = 100;

// var ws281x = require('rpi-ws281x-native');
var pixelData = new Uint32Array(NUM_LEDS);
// ws281x.init(NUM_LEDS);

var Lights = [];

function strip() {
    
    this.NUM_LEDS = NUM_LEDS;
    this.Mode = "";
    this.Lights = []; 
    this.Clear = function () {
        // ws281x.reset();
    };

    /*
    *   Clear all LEDs back to 0x00000 and render
    */
    this.Stop = function () {
        strip.Clear();
        CurrentMode = MODES.CLEAR;
    };

    /*
    *   Set a single color for all LEDs
    */
    this.SetStripColor = function (color) {
        for (var i = 0; i < NUM_LEDS; i++) {
            this.Lights[i] = color;
        }
        strip.Render();
    };

    this.Render = function () {
        var tmp = [];
        for (var i = 0; i < NUM_LEDS; i++) {
            if (i > NUM_LEDS) break;
            tmp[i] = this.Lights[i];
        }
        // ws281x.render(tmp);
    };
}

module.exports = new strip();