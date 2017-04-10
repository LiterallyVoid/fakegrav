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
            accel.mult(1.5);
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
