# WS2812 LED Strip Animations

A basic app to control WS2812 LED strips with a raspberry pi. 

This consists of a Node app which serves a simple HTML page to manage the strip and includes libraries to control the strip.

# Current Animations

1) Rainbow
  - Cycle through all colorsand pulse through strip.

2) Fade 2 Colors
  - Choose 2 colors and fade the strip between them.

3) Dance
  - Pulse colors through the strip is a dancing fashion.

4) Starry Night
  - All white LEDs that flicker at random.

# Hardware 

- WS2812 LED Light Strip
- Raspberry Pi 3 Model B or Raspberry Pi Zero
- 5V 2A Power Supply

# Reading 

I found this NPM package : https://www.npmjs.com/package/rpi-ws281x-native
Read this page. 

It led me to follow the instructions here at Adafruit: https://learn.adafruit.com/neopixels-on-raspberry-pi. 
Connect your raspi according to those instructions. 

# Connections 

1) Connect DATA IN of your WS2812 LED strip to physical pin 12 of the Raspberry Pi. (GPIO 18).
2) Connect GND (Physical pin 6) to the GND lead of your power supply. 
- Refer to this image for a layout of the raspi pins: https://www.element14.com/community/servlet/JiveServlet/previewBody/73950-102-11-339300/pi3_gpio.png

# Notes 

Tested working on: 
  1) Raspberry Pi 3 Model B
  2) Raspberry Pi Zero W

# Raspberry Pi Setup

1) Install NodeJS
2) Install express NPM package
3) Install body-parser NPM package
4) Install rpi-ws281x-native NPM package
5) Modify NUM_LEDS in app.js to match the number of LEDs you have connected
5) Run app.js from source code in Node
6) Access app.html to control the LED strip from the IP Address of your raspi


# Questions? 

Contact me @ austin@brogencreations.com