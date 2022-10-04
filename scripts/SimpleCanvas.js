//this is a class that can be used to simplify the drawing of shapes on a HTML canvas
class SimpleCanvas {
	constructor(canvasContext) {
		//canvas this.ctx
		this.ctx = canvasContext;
	}

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

	arrow(fromx, fromy, tox, toy, arrowWidth, color) {
		//draws an arrow from (fromx, fromy) to (tox, toy)

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

	//takes animation callback function and refreshes the canvas
	refresh(callbackFunction) {
		const canvas = this.ctx.canvas;
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		requestAnimationFrame(callbackFunction);
	}
}
