function Portal(x, y, properties) {
    this.pos = new Vec2(x, y);
    this.properties = properties || {"onTouch": nextLevel};
    this.size = 30;
    this.particles = [];
};

Portal.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.lineWidth = 2;
    for(var i = 0; i < this.particles.length; i++) {
	var gradient = ctx.createLinearGradient(
	    this.particles[i].pos.x, this.particles[i].pos.y,
	    this.particles[i].pos.x - this.particles[i].vel.x * 10,
	    this.particles[i].pos.y - this.particles[i].vel.y * 10
	);
	var alpha = 1 - (this.particles[i].time / 20.0);
	gradient.addColorStop(0, "rgba(0, 0, 0, " + alpha + ")");
	gradient.addColorStop(1, "rgba(0, 0, 0, 0");
	ctx.strokeStyle = gradient;
	ctx.beginPath();
	ctx.moveTo(this.particles[i].pos.x, this.particles[i].pos.y);
	ctx.lineTo(this.particles[i].pos.x - this.particles[i].vel.x * 10,
		   this.particles[i].pos.y - this.particles[i].vel.y * 10);
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
    vel.mult(2);
    var pos = this.pos.get();
    var offset = vel.get();
    offset.mult(20);
    pos.sub(offset);
    this.particles.push({
	pos: pos,
	vel: vel,
	time: 20
    });

    for(var i = 0; i < this.particles.length; i++) {
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
    var offset = diff.get();
    offset.normalize();
    offset.mult(this.size);
    pos.add(offset);
    return [diff.mag() - this.size, pos, this.properties];
};
