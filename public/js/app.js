var CurrentArray = [];
var CurrentArrayObjects = [];
var $Strip = {};

/*****************
	Event Listeners
*****************/

$(document).on("click", ".navbar-collapse.in", function (e) {
	if ($(e.target).is("a")) {
		$(this).collapse("hide");
	}
});

/*****************
	Control
*****************/

function Stop() {
	AnimationRequest("control", "Stop", null);
}

function Reboot() {
	if (confirm("Are you sure you wish to reboot the device?")) {
		$Strip.BasicGET("admin/reboot");
	}
}

function PowerOff() {
	if (confirm("Are you sure you wish to turn off the device?")) {
		$Strip.BasicGET("admin/poweroff");
	}
}

/*****************
	Christmas
*****************/

function StartXmas1() {
	AnimationRequest("xmas", "GoXmas1", null);
}

function StartXmas2() {
	AnimationRequest("xmas", "GoXmasIterate", null);
}

/*****************
	Fade
*****************/

function Start2Fade() {
	var args = {
		Color1: $("#Fade2Colors1").val(),
		Color2: $("#Fade2Colors2").val(),
	};

	AnimationRequest("fade", "GoFade2", args);
}

function UpdateFadeSpeed() {
	var args = {
		speed: $("#fadespeed").val(),
	};

	AnimationRequest("fade", "FadeSpeed", args);
}

/*****************
	Rainbow
*****************/

function StartRainbow() {
	AnimationRequest("rainbow", "GoRainbow", null);
}

function UpdateRainbowSpeed() {
	var args = {
		speed: $("#rainbowspeed").val(),
	};
	AnimationRequest("rainbow", "RainbowSpeed", args);
}

/*****************
	Common
*****************/

function AnimationRequest(lib, method, args) {
	$Strip.POST("AnimationRequest", { lib: lib, method: method, args: args });
}

/*****************
	Deprecated
*****************/

function StartDancing() {
	AnimationRequest("dance", "GoDance", {});
}

function UpdateDanceBrightness() {
	var args = {
		Brightness: $("#dancebrightness").val(),
	};

	AnimationRequest("dance", "SetDanceBrightness", args);
}

function StartTwinkling() {
	AnimationRequest("twinkle", "GoTwinkle", {});
}

function fade() {
	$Strip.BasicGET("fade");
}

function spin() {
	$Strip.BasicGET("spin");
}

$Strip = {
	ColorPicker: "",
	Interval: "",
	CanSubmitOverride: true,
	CanSubmit: true,

	SetColorGroup: function (hex, array) {
		$(".colorpicker_hex input").val("#0066ff").trigger("change");
	},

	SetColor: function (hex, index) {
		if ($Strip.CanSubmit || $Strip.CanSubmitOverride) {
			$Strip.POST("color", { color: hex, index: index });
			$Strip.CanSubmit = false;
		}
	},
	Start: function () {
		$Strip.BasicGET("pulse");
	},
	Stop: function () {
		$Strip.BasicGET("istop");
	},
	POST: function (action, data) {
		$.ajax({
			url: "/" + action,
			type: "POST",
			data: data,
		})
			.done(function () {})
			.fail(function () {})
			.always(function () {
				$Strip.CanSubmit = true;
			});
	},
	BasicGET: function (action) {
		$.ajax({
			url: "/" + action,
			type: "GET",
			data: {},
		})
			.done(function () {})
			.fail(function () {})
			.always(function () {});
	},
};

function prepareColors() {
	$Strip.ColorPicker = $("[data-role='colorpicker']").each(function () {
		var index = $(this).data("index");
		CurrentArrayObjects[index] = $(this).ColorPicker({
			flat: true,
			onChange: function (hsb, hex, rgb) {
				$Strip.SetColor(hex, index);
			},
		});
	});
}
