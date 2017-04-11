function Vec2(x, y) {
    this.x = x || 0;
    this.y = y || 0;
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
