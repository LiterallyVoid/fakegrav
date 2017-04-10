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
