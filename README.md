# WS2812 LED Strip Animations

A **very** basic app to control WS2812 LED strips with a raspberry pi.

This consists of a Node app which serves a simple HTML page to manage the strip and includes libraries to control the strip.

You can use it for WS2812 (NeoPixel) christmas lights, or other simple DIY applications. I used it for a couple applications, including Christmas Tree Lights and an artistic decorative dodecahedron.

![cubeeee](./images/cube.jpg)

# Current Animations

1.  Rainbow
     - Cycle through all colors and pulse through strip.
2.  Fade 2 Colors
     - Choose 2 colors and fade the strip between them.
3. Dance
   -  Each LED is rapidly moving through the color wheel, giving a 'disco' / 'dance' effect.
5.  Starry Night
    -  Twinkling, white LED effects to simulate stars! :star:
6.  Christmas Tree
     - Randomly cycle R / G / B / W through the strip.
7. Christmas Iterate
     - Iterate a segment of R / G / B / W LEDs through the strip from top to bottom and bottom to top

# Important Reading

I found this NPM package : https://www.npmjs.com/package/rpi-ws281x-native
Read this page.

It led me to follow the instructions here at Adafruit: https://learn.adafruit.com/neopixels-on-raspberry-pi.

Connect your raspi according to those instructions. I have been using my Pi's with a diode instead of the level converter, and they work well.

# Hardware

- WS2812 (Neopixel) LED Light Strip or LEDs
- Raspberry Pi 3 Model B, Raspberry Pi Zero, or Raspberry Pi Model B (other Raspberry Pis should work fine but are untested)
- 5V 2A Power Supply
- 1N4001 Diode (or equivalent) or a level converter. See https://learn.adafruit.com/neopixels-on-raspberry-pi/raspberry-pi-wiring. I used the diode method and connected it up like this:
    -  ![pi-wiring](./images/led_strips_raspi_NeoPixel_Diode_bb.jpg)

# Connections

1.  Connect DATA IN of your WS2812 LED strip to physical pin 12 of the Raspberry Pi. (GPIO 18).
2.  Connect GND (Physical pin 6) to the GND lead of your power supply.
    - Refer to this image for a layout of the raspi pins: https://www.element14.com/community/servlet/JiveServlet/previewBody/73950-102-11-339300/pi3_gpio.png

# Devices

Tested working on:
  1) Raspberry Pi 3 Model B
  2) Raspberry Pi Zero W (some slowness can occur)
     -  Pinout. I connected PSU ground to PIN6 (GND) and DATA to the LED strip on PIN12 (GPIO18)
     -  ![pi-zero-pinout](./images/pi-zero-pinout.png)
     -  **Important** make sure that the power supply's ground is connected to a ground connection on the Pi.
  3) Raspberry Pi Model B (some slowness can occur)

# Raspberry Pi Setup

1.  Install NodeJS
    -  [This NodeJS on Raspi tutorial was super helpful for me](https://desertbot.io/blog/nodejs-git-and-pm2-headless-raspberry-pi-install)
2.  Copy this repo to some location on your pi
    -  Easy option: use git
       -  `sudo apt install git`
       -  `git clone https://github.com/luxdvie/WS2812Controller.git`
 3.  During node setup, I ran into some permissions issues with the `rpi-ws281x-native` package on my pi zero. [I performed these steps](https://stackoverflow.com/questions/52979927/npm-warn-checkpermissions-missing-write-access-to-usr-local-lib-node-modules):
       -  add following lines to `~/.bashrc` after installing npm:
			```
			npm set prefix ~/.npm
			PATH="$HOME/.npm/bin:$PATH"
			PATH="./node_modules/.bin:$PATH"
			Execute following line after changes:
			```
			then run:
			`source ~/.bashrc`
4.  Globally install the node-gyp package 
    -  `npm i -g node-gyp`
5.  Run `npm install` in the root of this project to install all dependencies
    -  **Important troubleshooting note** If you run into issues during installation, you may want to try deleting the `package-lock.json` and `node_modules` directory, and trying `npm install` again. Avoid using `sudo` for npm install if you can!
6.  Modify NUM_LEDS in `strip.js` to match the number of LEDs you have connected
	```
	var NUM_LEDS = <YOUR_LEDS_HERE>;
	```
7.  Modify HTTP_PORT in app.js to match the port you want to use to access your Pi.
	```
	var HTTP_PORT = <YOUR_PORT_HERE>;
	```
8.  Run app.js as root user or with sudo privileges.
	```
    node /path/to/me/app.js
	```
9.  Access app.html to control the LED strip from the IP Address of your raspi.
	```
    http://<YOUR_IP_ADDRESS_HERE>:<YOUR_PORT_HERE>/
	```

# Running on Pi Startup

There are many ways to accomplish this, but the one I went with was this:

1.  Define the command that will run your app.js file. In my case, this was:
    -  `su pi -c 'sudo node /home/pi/code/github.com/WS2812Controller/app.js'`
2.  Put this line in the `/etc/rc.local` file
    -  `sudo nano /etc/rc.local`
    -  Update the contents to add the command (above) that works for you. Mine looks like this (out of the box Raspbian configuration included):
		```
		#!/bin/sh -e
		#
		# rc.local
		#
		# This script is executed at the end of each multiuser runlevel.
		# Make sure that the script will "exit 0" on success or any other
		# value on error.
		#
		# In order to enable or disable this script just change the execution
		# bits.
		#
		# By default this script does nothing.

		# Print the IP address
		_IP=$(hostname -I) || true
		if [ "$_IP" ]; then
		printf "My IP address is %s\n" "$_IP"
		fi

		su pi -c 'sudo node /home/pi/code/github.com/WS2812Controller/app.js'

		exit 0
		```

# Security Note

**Disclaimer** The `rpi-ws281x-native` package requires root access, so you have to run the `app.js` with `sudo` or as `root`... Do this at your own risk :) I never expose my Pi to the internet, so I'm not as concerned about this, but definitely I would not recommend you ever expose this service to the internet, especially when configured this way!

# Author

Austin Brown [GitHub](https://github.com/luxdvie),  [austinbrown2500@gmail.com](mailto:austinbrown2500@gmail.com)