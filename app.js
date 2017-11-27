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


		/* The port the server will listen on */
		var HTTP_PORT = 8080;

		/* Global reference to the LED strip */
		var strip = require("./strip.js");

		/* 
		*	Animation Libraries
		*/
		var xmas = require("./animations/xmas.js");
		var fade = require("./animations/fade.js");
		var rainbow = require("./animations/rainbow.js");
		var control = require("./animations/control.js");


/*******************************
	Web Methods
*******************************/

	/*
	*	Generic handler for an animation request.
	*
	*		All requests should be in the format
	*		
	*			lib => name of animation package you're referencing
	*			method => name of method in package you're calling
	*			args => object containing any arguments you want to pass to the animation method
	*
	*/
	app.post('/AnimationRequest', function (request, response) {
		response.header("Access-Control-Allow-Origin", "*");

		var lib = request.body.hasOwnProperty("lib") ? request.body.lib : "";
		var instance = GetLibraryInstance(lib);
		if (instance === null || typeof instance === "undefined") { response.send("Library not found."); return; }
		
		var method = request.body.hasOwnProperty("method") ? request.body.method : null;
		if (method === null) { response.send("Method not found."); return; }

		var args = request.body.hasOwnProperty("args") ? request.body.args : "";

		var rsp = instance[method](args, strip);

		response.send(rsp);
	});

	/*
	*	Home
	*/
	app.get('/', function (req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		res.sendFile(path.join(__dirname + '/app.html'));
	});


/*******************************
	common
*******************************/

	/* 
	*	Find the correct reference to a specific library name;
	*/
	function GetLibraryInstance(key) {
		var lib = null;
		switch (key) 
		{
			case "xmas":
				lib = xmas;
			break;
			case "fade":
				lib = fade;
			break;
			case "rainbow":
				lib = rainbow;
			break;
			case "control":
				lib = control;
			break;
		}

		return lib;
	}

/*******************************
	startup
*******************************/

	var server = app.listen(HTTP_PORT, function() {
		console.log('***************************');	
		console.log(' WS2812 CONTROLLER STARTUP ');	
		console.log('***************************');	
	});