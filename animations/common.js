
var XmasRed = 0xff0000;
var XmasGreen = 0x00ff00;
var XmasBlue = 0x0000ff;
var XmasWhite = 0xffffff;
    
function common() {
   
    this.RandomXmasColor = function() {
        var xmasLight = this.getRandomInt(1, 4);
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
        return xmasColor;
    };
    

    // rainbow-colors, taken from http://goo.gl/Cs3H0v
    this.colorwheel = function(pos) {
        pos = 255 - pos;
        if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
        else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
        else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
    };

    this.rb2Int = function(r, g, b) {
        return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
    };

    this.map_range = function(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    };

    this.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}

module.exports = new common();