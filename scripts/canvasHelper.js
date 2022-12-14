//this is a class that can be used to simplify the drawing of shapes on a HTML canvas
class SimpleCanvas {
	constructor(canvasContext) {
		//canvas this.ctx
		this.ctx = canvasContext;
	}

	//draws circle
	circle(x, y, radius, text = "", color = "white") {
		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;
		// this.ctx.strokeWidth = 1;

		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();

		this.ctx.font = `bold ${radius / 2}px Arial`;
		//center text
		this.ctx.textAlign = "center";
		this.ctx.textBaseLine = "middle";
		this.ctx.fillStyle = "black";
		this.ctx.fillText(text, x, y + 5);
		this.ctx.closePath();
	}

	line(x1, y1, x2, y2, width = 4, color = "white") {
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = width;

		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	//draws an arrow from (fromx, fromy) to (tox, toy)
	arrow(fromx, fromy, tox, toy, arrowWidth, color) {
		//variables to be used when creating the arrow
		var headlen = 10;
		var angle = Math.atan2(toy - fromy, tox - fromx);

		this.ctx.strokeStyle = color;

		//starting path of the arrow from the start square to the end square
		//and drawing the stroke
		this.line(fromx, fromy, tox, toy, arrowWidth, color);

		//starting a new path from the head of the arrow to one of the sides of
		//the point
		this.ctx.beginPath();
		this.ctx.moveTo(tox, toy);
		this.ctx.lineTo(
			tox - headlen * Math.cos(angle - Math.PI / 7),
			toy - headlen * Math.sin(angle - Math.PI / 7)
		);

		//path from the side point of the arrow, to the other side point
		this.ctx.lineTo(
			tox - headlen * Math.cos(angle + Math.PI / 7),
			toy - headlen * Math.sin(angle + Math.PI / 7)
		);

		//path from the side point back to the tip of the arrow, and then
		//again to the opposite side point
		this.ctx.lineTo(tox, toy);
		this.ctx.lineTo(
			tox - headlen * Math.cos(angle - Math.PI / 7),
			toy - headlen * Math.sin(angle - Math.PI / 7)
		);

		//draws the paths created above
		this.ctx.stroke();
	}

	rect(x, y, width, height, radius, text = "", color = "white") {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;
		this.ctx.roundRect(x, y, width, height, radius);
		this.ctx.stroke();
		this.ctx.fill();

		this.ctx.font = "bold 24px Arial";
		//center text
		this.ctx.textAlign = "center";
		this.ctx.textBaseLine = "middle";
		this.ctx.fillStyle = "red";
		this.ctx.fillText(text, width / 2 + x, height / 2 + y + 8);
		this.ctx.closePath();
	}

	//takes animation callback function and refreshes the canvas
	refresh(callbackFunction) {
		const canvas = this.ctx.canvas;
		this.ctx.fillStyle = "rgba(0,0,0,1)";
		this.ctx.fillRect(0, 0, canvas.width, canvas.height);
		requestAnimationFrame(callbackFunction);
	}
}

//canvas animation class
class CanvasAnimation {
	constructor(simpleCanvas) {
		//takes in a SimpleCanvas object
		this.canvas = simpleCanvas;

		this.circleRadOffset = 0;

		this.offsetx = 0;
		this.offsety = 0;
	}

	animateCircle(circle, animTime, reversed = false) {
		//takes circle object
		//WARNING: 40 is a hardcoded value - might cause problems

		this.canvas.circle(
			circle.x,
			circle.y,
			reversed
				? circle.radius - this.circleRadOffset
				: circle.radius - 40 + this.circleRadOffset,
			circle.data,
			"white"
		);

		this.circleRadOffset += 40 / animTime;

		if (this.circleRadOffset >= 40) {
			this.canvas.circle(
				circle.x,
				circle.y,
				circle.radius,
				circle.data,
				"white"
			);
			//end animation
			return true;
		}
	}

	//takes in an arrow and uses it's x1, y1 and x2, y2 to animate the arrow growing from one coord to another
	animateLine(points, animTime, collapse = false, reversed = false) {
		//collapse is opposite of arrow expanding
		//collapse reverse means arrow collapses from tail to head and collapse not reversed means arrow collapses from head to tail

		const distX = points.x1 - points.x2;
		const distY = points.y1 - points.y2;

		collapse
			? reversed
				? this.canvas.arrow(
						points.x1 - this.offsetx,
						points.y1 - this.offsety,
						points.x2,
						points.y2,
						5,
						"blue"
				  )
				: this.canvas.arrow(
						points.x1,
						points.y1,
						points.x2 + this.offsetx,
						points.y2 + this.offsety,
						5,
						"blue"
				  )
			: this.canvas.arrow(
					points.x1,
					points.y1,
					points.x1 - this.offsetx,
					points.y1 - this.offsety,
					5,
					"blue"
			  );

		this.offsetx += distX / animTime;
		this.offsety += distY / animTime;

		if (
			Math.abs(this.offsetx) >= Math.abs(distX) ||
			Math.abs(this.offsety) >= Math.abs(distY)
		) {
			//end animation
			return true;
		}
	}

	//animates arrow moving to endcoord
	animateMoveLine(points, endCoord, animTime) {
		//separate distances between end of arrow and new node coords (where the arrow will end up)
		const distX = points.x2 - endCoord.x;
		const distY = points.y2 - endCoord.y;

		this.canvas.arrow(
			points.x1,
			points.y1,
			points.x2 - this.offsetx,
			points.y2 - this.offsety,
			5,
			"blue"
		);
		//slowly adding fractions to offset
		this.offsetx += distX / animTime;
		this.offsety += distY / animTime;

		//animation complete when offset is equal to distance
		if (
			Math.abs(this.offsetx) >= Math.abs(distX) ||
			Math.abs(this.offsety) >= Math.abs(distY)
		) {
			return true;
		}
	}

	reset() {
		this.circleRadOffset = 0;
		this.offsetx = 0;
		this.offsety = 0;
	}
}
