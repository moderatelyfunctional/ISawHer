const positionsForMe = {
	1: [20, 616]
}
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_LEFT = 37;
const KEY_SPACE = 32;

const epsilon = 4e-1;

class Me {
	constructor(level, widthBound, heightBound) {
		this.level = level;
		this.widthBound = widthBound;
		this.heightBound = heightBound;

		this.x = positionsForMe[this.level][0];
		this.y = positionsForMe[this.level][1];
		this.xVel = 0;
		this.yVel = 0;
		this.speed = 3;
		
		this.friction = 0.85;
		this.jumping = false;
		this.grounded = false;
		this.gravity = 0.18;

		this.bodyWidth = 12;
		this.bodyHeight = 24;
		this.circleOffset = 4;
		this.paraOffset = 2;
		this.circleRadius = this.bodyWidth * .6;
		this.fillStyle = "#5ccfe6";

		this.width = this.bodyWidth + this.paraOffset;
		this.height = this.bodyHeight + this.circleOffset + this.circleRadius * 2;
	}

	_draw_parallelogram(ctx) {
		const sign = this.xVel > epsilon ? 1 : -1;
		ctx.beginPath();
		ctx.moveTo(this.x + sign * this.paraOffset, this.y);
		ctx.lineTo(this.x + this.bodyWidth + sign * this.paraOffset, this.y);
		ctx.lineTo(this.x + this.bodyWidth, this.y + this.bodyHeight);
		ctx.lineTo(this.x, this.y + this.bodyHeight);
		ctx.closePath();
		ctx.fill();
	}

	draw(ctx) {
		ctx.fillStyle = this.fillStyle;
		const circleX = this.x + this.bodyWidth / 2;
		const circleY = this.y - this.circleRadius - this.circleOffset;

		ctx.beginPath();
		ctx.arc(circleX, circleY, this.circleRadius, 0, 2 * Math.PI, true);
		ctx.fill();
		ctx.closePath();
		if (this.xVel > -epsilon && this.xVel < epsilon) {
			ctx.fillRect(this.x, this.y, this.bodyWidth, this.bodyHeight);
		} else {
			this._draw_parallelogram(ctx);
		}
	}

	collisionCheck(box) {
		const vX = (this.x + (this.width) / 2) - (box.x + (box.width / 2));
		const vY = (this.y + (this.height) / 2) - (box.y + (box.height / 2));
		const hWidth = (this.width) / 2 + box.width / 2;
		const hHeight = (this.height) / 2 + box.height / 2;
		var colDir = "";

		if (Math.abs(vX) < hWidth && Math.abs(vY) < hHeight) {
			const oX = hWidth - Math.abs(vX);
			const oY = hHeight - Math.abs(vY);
			if (oX >= oY) {
				colDir = (vY > 0) ? "t" : "b";
				this.y += (vY > 0) ? oY : -oY;
			} else {
				colDir = (vX > 0) ? "l" : "r";
				this.x += (vX > 0) ? oX : -oX;
			}
		}
		return colDir;
	}

	_boundsCheck(boxes) {
		console.log(boxes);
		this.grounded = false;
		for (var i = 0; i < boxes.length; i++) {
			const dir = this.collisionCheck(this, boxes[i]);
			console.log("direction is " + dir);
			if (dir === "l" || dir === "r") {
				this.velX = 0;
				this.jumping = false;
			} else if (dir === "b") {
				this.grounded = true;
				this.jumping = false;
			} else if (dir === "t") {
				this.velY *= -1;
			}
		}

		if (this.grounded) {
			this.velY = 0;
		}

		// if (this.x >= this.widthBound - this.bodyWidth) {
		// 	this.x = this.widthBound - this.bodyWidth;
		// } else if (this.x <= 0) {
		// 	this.x = 0;
		// }
		// if (this.y >= 616) {
		// 	this.y = 616;
		// 	this.jumping = false;
		// }
	}

	update(keys, boxes) {
		if (keys[KEY_UP] || keys[KEY_SPACE]) {
			if (!this.jumping && this.grounded) {
				this.jumping = true;
				this.grounded = false;
				this.yVel = -2.5 * this.speed;
			}
		}
		if (keys[KEY_RIGHT]) {
			if (this.xVel < this.speed) {
				this.xVel++;
			}
		}
		if (keys[KEY_LEFT]) {
			if (this.xVel > -this.speed) {
				this.xVel--;
			}
		}

		this.xVel *= this.friction;
		this.yVel += this.gravity;

		this._boundsCheck(boxes);

		this.x += this.xVel;
		this.y += this.yVel;

		console.log(this.x + " " + this.y)

	}
}



