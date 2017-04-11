var Decoration = function(type, args) {
    this.type = type;
    this.args = args;
};

Decoration.prototype.draw = function() {
    if(this.type == "text") {
	var lines = this.args[0].split("\n");

	ctx.save();
	ctx.translate(this.args[2], this.args[3]);
	ctx.rotate(this.args[4] * Math.PI / 180);
	ctx.font = this.args[1] + "px sans";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	for(var i = 0; i < lines.length; i++) {
	    var y = (-lines.length * 0.5 + i) * this.args[1];
	    ctx.fillText(lines[i], 0, y);
	}
	ctx.restore()
    }
};