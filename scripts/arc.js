function Arc(x, y, radius, start, end, properties) {
    if(end < start) {
	var t = start;
	start = end;
	end = t;
    }
    this.pos = new Vec2(x, y);
    this.radius = radius;
    this.start = (start / 180) * Math.PI;
    this.end = (end / 180) * Math.PI;

    this.properties = properties || {};
};

Arc.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, this.start, this.end);
    ctx.stroke();
};

Arc.prototype.closestPoint = function(point, minDistance) {
    var pos = this.pos.get();
    var diff = point.get();
    diff.sub(this.pos);
    var offset = diff.get();
    offset.normalize();
    offset.mult(this.radius);
    pos.add(offset);
    var angle = diff.heading();
    var angleDiff = angle - this.start;

    while(angleDiff < 0) {
	angleDiff += Math.PI * 2;
    }

    while(angleDiff > Math.PI * 2) {
	angleDiff -= Math.PI * 2;
    }

    if(angleDiff > 0 && angleDiff < (this.end - this.start)) {
	var dist = Math.abs(diff.mag() - this.radius);
	return [dist, pos, this.properties];
    }

    var p1 = new Vec2(this.radius, 0);
    p1.rotate(this.start);
    p1.add(this.pos);

    var p2 = new Vec2(this.radius, 0);
    p2.rotate(this.end);
    p2.add(this.pos);

    var distP1 = p1.dist(point);
    var distP2 = p2.dist(point);
    if(distP1 < distP2) {
	return [distP1, p1, this.properties];
    } else {
	return [distP2, p2, this.properties];
    }
};
