var width = 400;
var height = 400;

var canvas = document.querySelector("#main");
var ctx = canvas.getContext("2d");
var keys = [];

if(!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback, element) {
                window.setTimeout(callback, 1000 / 60);

            };
    })();
}

var lastUpdate = -1;
var accumulator = 0;
var ticrate = 1000.0 / 60.0;

var objects = [new Portal(0, 0)];
var playLevel = null;

function nextLevel() {
    playLevel = null;
};

function loop(time) {
    requestAnimationFrame(loop);
    if(time == undefined) {
	time = Date.now();
    }

    if(lastUpdate < 0) {
	lastUpdate = time;
    }

    var delta = time - lastUpdate;
    lastUpdate = time;

    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";

    if(playLevel) {
	playLevel.draw();
	
	accumulator += delta;
	while(accumulator > ticrate) {
	    playLevel.update();
	    accumulator -= ticrate;
	}
    } else {
	for(var i = 0; i < objects.length; i++) {
	    objects[i].draw();
	    if(objects[i].update) {
		objects[i].update();
	    }
	}
    }
};

function resize() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    width = canvas.width;
    height = canvas.height;
};

resize();

requestAnimationFrame(loop);

window.addEventListener(
    "keydown",
    function(e) {
	keys[e.keyCode] = true;
    },
    false);

window.addEventListener(
    "keyup",
    function(e) {
	keys[e.keyCode] = false;
    },
    false);

window.addEventListener(
    "resize",
    resize,
    false);