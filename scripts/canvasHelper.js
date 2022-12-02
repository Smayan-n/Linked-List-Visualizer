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

	rect(x, y, width, height, text = "", color = "white") {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;
		this.ctx.roundRect(x, y, width, height, 5);
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
		this.animFrms = 0;

		this.circleRadOffset = 0;

		this.cntx = 0;
		this.cnty = 0;
	}

	animateCircle(circle, animTime) {
		//takes circle object
		//WARNING: 40 is a hardcoded value - might cause problems
		this.animFrms++;
		this.canvas.circle(
			circle.x,
			circle.y,
			circle.radius - 40 + this.circleRadOffset,
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
	animateLine(points, animTime) {
		this.animFrms++;

		const distX = points.x1 - points.x2;
		const distY = points.y1 - points.y2;

		this.canvas.arrow(
			points.x1,
			points.y1,
			points.x1 - this.cntx,
			points.y1 - this.cnty,
			5,
			"blue"
		);
		this.cntx += distX / animTime;
		this.cnty += distY / animTime;

		if (
			Math.abs(this.cntx) >= Math.abs(distX) ||
			Math.abs(this.cnty) >= Math.abs(distY)
		) {
			//end animation
			return true;
		}
	}

	animateMoveLine(points, endCoord, animTime) {
		this.animFrms++;

		const distX = points.x2 - endCoord.x;
		const distY = points.y2 - endCoord.y;

		this.canvas.arrow(
			points.x1,
			points.y1,
			points.x2 - this.cntx,
			points.y2 - this.cnty,
			5,
			"blue"
		);
		this.cntx += distX / animTime;
		this.cnty += distY / animTime;
		// console.log(distX, distY, "    ", this.cntx, this.cnty);

		if (
			Math.abs(this.cntx) >= Math.abs(distX) ||
			Math.abs(this.cnty) >= Math.abs(distY)
		) {
			this.cntx = 0;
			this.cnty = 0;
			this.animFrms = 0;
			return true;
		}
	}

	reset() {
		this.animFrms = 0;
		this.circleRadOffset = 0;
		this.cntx = 0;
		this.cnty = 0;
	}
}
