# WS2812 LED Strip Animations

A **very** basic app to control WS2812 LED strips with a raspberry pi. 

This consists of a Node app which serves a simple HTML page to manage the strip and includes libraries to control the strip.

You can use it for WS2812 (Neopixel) christmas lights, or other simple DIY applications.

# Current Animations

1) Rainbow
  - Cycle through all colors and pulse through strip.

2) Fade 2 Colors
  - Choose 2 colors and fade the strip between them.

3) Christmas Mode 1
  - Randomly cycle R / G / B / W through the strip.

4) Christmas Mode 2
  - Iterate a segment of R / G / B / W LEDs through the strip from top to bottom and bottom to top

# Important Reading 

I found this NPM package : https://www.npmjs.com/package/rpi-ws281x-native
Read this page. 

It led me to follow the instructions here at Adafruit: https://learn.adafruit.com/neopixels-on-raspberry-pi. 

Connect your raspi according to those instructions. I have been using my Pi's with a diode instead of the level converter, and they work well.

# Hardware 

- WS2812 (Neopixel) LED Light Strip or LEDs
- Raspberry Pi 3 Model B or Raspberry Pi Zero (other Raspberry Pis should work fine but are untested)
- 5V 2A Power Supply
- 1N4001 Diode (or equivalent) or a level converter. See https://learn.adafruit.com/neopixels-on-raspberry-pi/wiring

# Connections 

1) Connect DATA IN of your WS2812 LED strip to physical pin 12 of the Raspberry Pi. (GPIO 18).
2) Connect GND (Physical pin 6) to the GND lead of your power supply. 
- Refer to this image for a layout of the raspi pins: https://www.element14.com/community/servlet/JiveServlet/previewBody/73950-102-11-339300/pi3_gpio.png

# Notes 

I currently have included the node modules directory in the repo. **IMORTANT** This will only work on a Raspberry Pi.

In future versions I will remove the node_modules folder and instruct users to download the (3) required packagaes. 

Tested working on: 
  1) Raspberry Pi 3 Model B
  2) Raspberry Pi Zero W (some slowness can occurr)

# Raspberry Pi Setup

1) Install NodeJS.
2) Copy this repo to some location on your pi.
3) Modify NUM_LEDS in strip.js to match the number of LEDs you have connected.

    `var NUM_LEDS = <YOUR_LEDS_HERE>;`

4) Modify HTTP_PORT in app.js to match the port you want to use to access your Pi.

    `var HTTP_PORT = <YOUR_PORT_HERE>;`

5) Run app.js as root user or with sudo privileges.

    `node /path/to/me/app.js`

6) Access app.html to control the LED strip from the IP Address of your raspi.

    `http://<YOUR_IP_ADDRESS_HERE>:<YOUR_PORT_HERE>/`

# Questions? 

Contact me @ austin@brogencreations.com