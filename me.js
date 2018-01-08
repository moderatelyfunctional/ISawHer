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
		this.gravity = 0.18;

		this.bodyWidth = 12;
		this.bodyHeight = 24;
		this.circleOffset = 4;
		this.paraOffset = 2;
		this.circleRadius = this.bodyWidth * .6;
		this.fillStyle = "#5ccfe6";
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

	_boundsCheck() {
		if (this.x >= this.widthBound - this.bodyWidth) {
			this.x = this.widthBound - this.bodyWidth;
		} else if (this.x <= 0) {
			this.x = 0;
		}
		if (this.y >= 616) {
			this.y = 616;
			this.jumping = false;
		}
	}

	update(keys) {
		if (keys[KEY_UP] || keys[KEY_SPACE]) {
			if (!this.jumping) {
				this.jumping = true;
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

		this.x += this.xVel;
		this.y += this.yVel;

		this._boundsCheck();
	}

	colCheck(object) {

	}
}



