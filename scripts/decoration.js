var Decoration = function(type, args) {
    this.type = type;
    this.args = args;
    this.glitches = [];
};

Decoration.prototype.draw = function() {
    if(this.type == "text") {
	var text = this.args[0];
	var lines = text.split("\n");
	for(var i = 0; i < this.glitches.length; i++) {
	    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*()_+{}|:<>?`-=[]\;',./";
	    var l = this.glitches[i][1];
	    lines[l] = lines[l].substr(0, this.glitches[i][0]) + chars[Math.floor(Math.random() * chars.length)] + lines[l].substr(this.glitches[i][0] + 1);
	    this.glitches[i][2]--;
	    if(this.glitches[i][2] < 0) {
		this.glitches.splice(i, 1);
		i--;
	    }
	}

	ctx.save();
	ctx.translate(this.args[2], this.args[3]);
	ctx.rotate(this.args[4] * Math.PI / 180);
	ctx.font = this.args[1] + "px monospace";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	for(var i = 0; i < lines.length; i++) {
	    var y = (-lines.length * 0.5 + i) * this.args[1];
	    ctx.fillText(lines[i], 0, y);
	}
	ctx.restore()

	if(Math.random() < 0.03) {
	    var n = Math.random() * 10;
	    for(var i = 0; i < n; i++) {
		var l = Math.floor(Math.random() * lines.length);
		var c = Math.floor(Math.random() * lines[l].length);
		this.glitches.push([c, l, Math.random() * 8]);
	    }
	}
    }
};