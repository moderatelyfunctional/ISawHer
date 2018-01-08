window.onload = function() {
	keys = [];
	document.body.addEventListener("keydown", function(e) {
		keys[e.keyCode] = true;
		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
	        e.preventDefault();
	    }
	});
	document.body.addEventListener("keyup", function(e) {
		keys[e.keyCode] = false;
	});

	var canvas = document.getElementById("screen");
	var ctx = canvas.getContext("2d");
	var width = canvas.width;
	var height = canvas.height;

	if (window.devicePixelRatio > 1) {
		canvas.width = width * window.devicePixelRatio;
		canvas.height = height * window.devicePixelRatio;
		canvas.style.width = width + "px";
		canvas.style.height = height + "px";

		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	}

	var currLevelIndex = 1;

	var currLevel = new Level(currLevelIndex);
	var me = new Me(currLevelIndex, width, height);

	function draw() {
		me.update(keys, currLevel.blocks);


		ctx.clearRect(0, 0, canvas.width, canvas.height);
		currLevel.draw(ctx);
		me.draw(ctx);

		// requestAnimationFrame(draw);
	}

	draw();
}






































