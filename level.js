// data format: [x, y, width, height]
const positionsForLevel = {
	1: [new Box(0, 640, 200, 10),
		new Box(120, 520, 200, 14)]
}

class Level {

	constructor(level) {
		this.level = level;
		this.blocks = positionsForLevel[this.level];
		this.fillStyle = "#363636";
		this.colorStop = "black";
		this.colorStop = "white";
	}

	draw(ctx) {
		for (var i = 0; i < this.blocks.length; i++) {
			ctx.fillStyle = this.fillStyle;
			ctx.fillRect(this.blocks[i].x, this.blocks[i].y, this.blocks[i].width, this.blocks[i].height);
		}
	}


}