var width = 400;
var height = 400;

var canvas = document.querySelector("#main");
var ctx = canvas.getContext("2d");
var keys = [];

function Vec2(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    /*this._x = x || 0;
    Object.defineProperty(this, "x", {
	get: function() {
	    return this._x;
	},

	set: function(x) {
	    debugger;
	    this._x = x;
	},
    });*/
};

Vec2.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;
};

Vec2.prototype.sub = function(other) {
    this.x -= other.x;
    this.y -= other.y;
};

Vec2.prototype.mult = function(other) {
    if(typeof other == "number") {
	other = {x: other, y: other};
    }
    this.x *= other.x;
    this.y *= other.y;
};

Vec2.prototype.div = function(other) {
    if(typeof other == "number") {
	other = {x: other, y: other};
    }
    if(other.x == 0 && other.y == 0) {
	return;
    }
    this.x /= other.x;
    this.y /= other.y;
};

Vec2.prototype.heading = function() {
    return Math.atan2(this.y, this.x);
};

Vec2.prototype.rotate = function(ang) {
    var sin = Math.sin(ang);
    var cos = Math.cos(ang);
    var that = {x: this.x, y: this.y};
    this.x = that.x * cos - that.y * sin;
    this.y = that.x * sin + that.y * cos;
};

Vec2.prototype.dot = function(other) {
    return this.x * other.x + this.y * other.y;
};

Vec2.prototype.mag = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vec2.prototype.normalize = function() {
    this.div(this.mag());
};

Vec2.prototype.dist = function(other) {
    var offset = other.get();
    offset.sub(this);
    return offset.mag();
};

Vec2.prototype.get = function() {
    return new Vec2(this.x, this.y);
};

function Player(x, y, gravity, level) {
    this.pos = new Vec2(x, y);
    this.vel = new Vec2(0, 0);
    this.gravity = gravity;
    this.pan = new Vec2(x, y);
    this.angle = gravity;
    this.level = level;
    this.drawSize = 18;
    this.size = 20;
};

Player.prototype.view = function() {
    ctx.translate(width * 0.5, height * 0.5);
    ctx.rotate(-this.angle);
    ctx.translate(-this.pan.x, -this.pan.y);
};

Player.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.drawSize, 0, 2 * Math.PI);
    ctx.fill();
};

Player.prototype.update = function() {
    this.pan.sub(this.pos);
    this.pan.mult(0.8);
    this.pan.add(this.pos);
    var angleDiff = (this.gravity - this.angle);
    while(angleDiff < -Math.PI) {
        angleDiff += Math.PI * 2;
        this.angle -= Math.PI * 2;
    }
    while(angleDiff > Math.PI) {
        angleDiff -= Math.PI * 2;
        this.angle += Math.PI * 2;
    }
    this.angle += angleDiff * 0.05;
    var gravity = new Vec2(0, 0.2);
    gravity.rotate(this.gravity);
    var side = gravity.get();
    side.rotate(Math.PI * 0.5);
    this.pos.add(this.vel);
    this.vel.add(gravity);
    var closestPoint = this.level.closestPoint(this.pos, this.size * 2);
    if(closestPoint[0] < this.size) {
        var push = closestPoint[1].get();
        push.sub(this.pos);
        push.normalize();
        var normal = push.get();
        push.mult(this.size - closestPoint[0]);
        this.pos.sub(push);
        var accel = normal.get();
        accel.mult(this.vel.dot(normal));
        if(this.vel.mag() > 7) {
            accel.mult(1.6);
        }
        this.vel.sub(accel);

        this.gravity = normal.heading() - Math.PI * 0.5;
        
        if(keys[38]) {
            var force = gravity.get();
            force.mult(-30);
            this.vel.add(force);
        }
    }
    var accel = side.get();
    accel.mult(this.vel.dot(side) * 0.5);
    this.vel.sub(accel);

    if(keys[37]) {
        this.vel.add(side);
    }
    if(keys[39]) {
        this.vel.sub(side);
    }
};

function Line(x1, y1, x2, y2) {
    this.p1 = new Vec2(x1, y1);
    this.p2 = new Vec2(x2, y2);
    this.normal = new Vec2(this.p1.y - this.p2.y, this.p2.x - this.p1.x);
    this.normal.normalize();
    this.distance = this.normal.dot(this.p1);

    this.startNormal = new Vec2(this.p2.x - this.p1.x, this.p2.y - this.p1.y);
    this.startNormal.normalize();
    this.startDistance = this.startNormal.dot(this.p1);
    this.length = this.p1.dist(this.p2);
};

Line.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
};

Line.prototype.closestPoint = function(point, minDistance) {
    var lineDist = this.startNormal.dot(point) - this.startDistance;
    if(lineDist > 0 && lineDist < this.length) {
        var closestPoint = this.startNormal.get();
        closestPoint.mult(lineDist);
        closestPoint.add(this.p1);
        return [Math.abs(this.normal.dot(point) - this.distance), closestPoint];
    }
    if(lineDist < -minDistance || lineDist > this.length + minDistance) {
        return [10000000, null];
    }
    var distP1 = this.p1.dist(point);
    var distP2 = this.p2.dist(point);
    if(distP1 < distP2) {
        return [distP1, this.p1];
    } else {
        return [distP2, this.p2];
    }
};

function Level(data) {
    this.objects = [];
    this.player = null;
    for(var i = 0; i < data.length; i++) {
        if(data[i][0] == "line") {
            this.objects.push(new Line(data[i][1], data[i][2], data[i][3], data[i][4]));
        } else if(data[i][0] == "playerSpawn") {
            this.player = new Player(data[i][1], data[i][2], data[i][3], this);
        }
    } 
};

Level.prototype.draw = function() {
    ctx.save();
    this.player.view();
    for(var i = 0; i < this.objects.length; i++) {
        this.objects[i].draw();
    }
    this.player.draw();
    ctx.restore();
};

Level.prototype.update = function() {
    this.player.update();
};

Level.prototype.closestPoint = function(point, minDistance) {
    var closestPoint = [1000000, null];
    for(var i = 0; i < this.objects.length; i++) {
        var objectClosestPoint = this.objects[i].closestPoint(point, minDistance);
        if(objectClosestPoint[0] < closestPoint[0]) {
            closestPoint = objectClosestPoint;
        }
    }
    return closestPoint;
};

var levels = [
    [
        ["playerSpawn", 0, -50, -0.1],
        ["line", -30, 0, 100, 0],
        ["line", 100, 0, 150, 50],
        ["line", 150, 50, 150, 200],
        ["line", 150, 200, 130, 200],
        ["line", -300, 400, -250, 450],
    ],
];

var currentLevel = new Level(levels[0]);


if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
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

function loop(time) {
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
    ctx.fillStyle = "#111";
    ctx.strokeStyle = "#111";

    currentLevel.draw();

    accumulator += delta;
    while(accumulator > ticrate) {
	currentLevel.update();
	accumulator -= ticrate;
    }

    requestAnimationFrame(loop);
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