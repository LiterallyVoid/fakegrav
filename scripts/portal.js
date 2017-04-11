function Portal(x, y, properties) {
    this.pos = new Vec2(x, y);
    this.properties = properties || {"onTouch": nextLevel, "noGravity": true};
    this.size = 0;
    this.particles = [];
};

Portal.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.lineWidth = 2;
    for(var i = 0; i < this.particles.length; i++) {
	var trailLength = 10;
	if(this.particles[i].time < 10) {
	    trailLength = this.particles[i].time;
	}
	var gradient = ctx.createLinearGradient(
	    this.particles[i].pos.x, this.particles[i].pos.y,
	    this.particles[i].pos.x + this.particles[i].vel.x * trailLength,
	    this.particles[i].pos.y + this.particles[i].vel.y * trailLength
	);
	var alpha = 1 - (this.particles[i].time / 40.0);
	gradient.addColorStop(0, "rgba(0, 0, 0, 0");
	gradient.addColorStop(1, "rgba(0, 0, 0, " + alpha + ")");
	ctx.strokeStyle = gradient;
	ctx.beginPath();
	ctx.moveTo(this.particles[i].pos.x, this.particles[i].pos.y);
	ctx.lineTo(this.particles[i].pos.x + this.particles[i].vel.x * trailLength,
		   this.particles[i].pos.y + this.particles[i].vel.y * trailLength);
	ctx.stroke();
    }
    ctx.restore();
};

Portal.prototype.update = function() {
    var vel = new Vec2(-100, 0);
    while(vel.mag() > 1) {
	vel.x = Math.random() * 2 - 1;
	vel.y = Math.random() * 2 - 1;
    }
    vel.normalize();
    vel.mult(0.05);
    var pos = vel.get();
    pos.normalize();
    pos.mult(-100);
    this.particles.push({
	pos: pos,
	vel: vel,
	time: 40
    });

    for(var i = 0; i < this.particles.length; i++) {
	this.particles[i].vel.mult(1.15);
	this.particles[i].pos.add(this.particles[i].vel);
	this.particles[i].time--;
	if(this.particles[i].time < 0) {
	    this.particles.splice(i, 1);
	    i--;
	}
    }
};

Portal.prototype.closestPoint = function(point, minDistance) {
    var pos = this.pos.get();
    var diff = pos.get();
    diff.sub(point);
    var normal = diff.get();
    normal.normalize();
    var offset = diff.get();
    offset.normalize();
    offset.mult(this.size);
    pos.add(offset);
    var props = this.properties;
    props["force"] = new Vec2(0, 1);
    return [diff.mag() - this.size, pos, props];
};

Portal.prototype.force = function(point) {
    var diff = this.pos.get();
    diff.sub(point);
    var normal = diff.get();
    normal.normalize();

    var d = point.dist(this.pos);

    var force = normal.get();
    force.mult(2000 / (d * d));
    return force;
};