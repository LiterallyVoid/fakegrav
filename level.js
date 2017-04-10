function Level(data) {
    this.objects = [];
    this.player = null;

    var objects = data["objects"];
    for(var i = 0; i < objects.length; i++) {
        if(objects[i][0] == "line") {
            this.objects.push(new Line(objects[i][1], objects[i][2],
				       objects[i][3], objects[i][4], objects[i][5]));
        } else if(objects[i][0] == "portal") {
            this.objects.push(new Portal(objects[i][1], objects[i][2], objects[i][3]));
        } else if(objects[i][0] == "playerSpawn") {
            this.player = new Player(objects[i][1], objects[i][2],
				     objects[i][3], this);
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
    for(var i = 0; i < this.objects.length; i++) {
	if(this.objects[i].update) {
            this.objects[i].update();
	}
    }
};

Level.prototype.closestPoint = function(point, minDistance) {
    var closestPoint = [1000000, null, {}];
    for(var i = 0; i < this.objects.length; i++) {
        var objectClosestPoint = this.objects[i].closestPoint(point, minDistance);
        if(objectClosestPoint[0] < closestPoint[0]) {
            closestPoint = objectClosestPoint;
        }
    }
    return closestPoint;
};
