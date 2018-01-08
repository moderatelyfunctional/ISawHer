const positionsForMe = {
	1: [20, 640 - 42.4]
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
		const start_y = this.y + 2 * this.circleRadius + this.circleOffset
		ctx.beginPath();
		ctx.moveTo(this.x + sign * this.paraOffset, start_y);
		ctx.lineTo(this.x + this.bodyWidth + sign * this.paraOffset, start_y);
		ctx.lineTo(this.x + this.bodyWidth, start_y + this.bodyHeight);
		ctx.lineTo(this.x, start_y + this.bodyHeight);
		ctx.closePath();
		ctx.fill();
	}

	draw(ctx) {
		ctx.fillStyle = this.fillStyle;
		const circleX = this.x + this.bodyWidth / 2;
		const circleY = this.y + this.circleRadius;

		ctx.beginPath();
		ctx.arc(circleX, circleY, this.circleRadius, 0, 2 * Math.PI, true);
		ctx.fill();
		ctx.closePath();
		if (this.xVel > -epsilon && this.xVel < epsilon) {
			ctx.fillRect(this.x, this.y + 2 * this.circleRadius + this.circleOffset, this.bodyWidth, this.bodyHeight);
		} else {
			this._draw_parallelogram(ctx);
		}
	}

	_rectCollisionCheck(box) {
		if (this.x < box.x + box.width && this.x + this.width > box.x &&
			this.y < box.y + box.height && this.y + this.height > box.y) {
			return true;
		}
		return false;
	}

	_intersectRectangle(box) {
		const x = Math.max(this.x, box.x);
		const num_one = Math.min(this.x + this.width, box.x + box.width);
		const y = Math.max(this.y, box.y);
		const num_two = Math.min(this.y + this.height, box.y + box.height);
		return new Box(x, y, num_one - x, num_two - y);
	}

// https://gamedev.stackexchange.com/questions/13774/how-do-i-detect-the-direction-of-2d-rectangular-object-collisions
	_collideFromLeft(prevPosition, box) {
		const prevRight = prevPosition.x + prevPosition.width;
		const currRight = this.x + this.width;
		return prevRight < box.x && currRight >= box.x;
	}

	_collideFromRight(prevPosition, box) {
		const boxRight = box.x + box.width;
		return prevPosition.x >= boxRight && this.left < boxRight;
	}

	_collideFromTop(prevPosition, box) {
		const prevBottom = prevPosition.y + prevPosition.height;
		const currBottom = this.y + this.height;
		return prevBottom < box.y && currBottom >= box.y;
	}

	_collideFromBottom(prevPosition, box) {
		const boxBottom = box.y + box.height;
		return prevPosition.y >= boxBottom && this.y < boxBottom
	}

	collisionCheck(prevPosition, box) {
		var colDir = "";
		if (!this._rectCollisionCheck(box)) {
			return colDir;
		} 
		const intersectRect = this._intersectRectangle(box);
		if (this.y < box.y) { // Intersecting me bottom
			this.y -= intersectRect.height;
			colDir = "b";
		} else if (this.y > box.y) { // Intersecting me top
			this.y += intersectRect.height;
			colDir = "t";
		} else if (this.x < box.x) { // Intsersecting me right
			this.x -= intersectRect.width;
			colDir = "r";
		} else { // Intersecting me left
			this.x += intersectRect.width; 
			colDir = "l";
		}

		return colDir;
	}

	_boundsCheck(prevPosition, boxes) {
		this.grounded = false;
		for (var i = 0; i < boxes.length; i++) {
			const dir = this.collisionCheck(prevPosition, boxes[i]);
			if (dir === "l" || dir === "r") {
				this.xVel = 0;
				this.jumping = false;
			} else if (dir === "b") {
				this.grounded = true;
				this.jumping = false;
			} else if (dir === "t") {
				this.yVel *= -1;
			}
		}

		if (this.grounded) {
			this.yVel = 0;
		}
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

		const prevPosition = [this.xVel, this.yVel];
		this.xVel *= this.friction;
		this.yVel += this.gravity;
		this.x += this.xVel;
		this.y += this.yVel;

		this._boundsCheck(prevPosition, boxes);
	}
}



