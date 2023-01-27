//class for handling objects drawn on canvas
class CanvasObjectHandler {
	constructor(simpleCanvas) {
		//takes in a SimpleCanvas object
		this.sc = simpleCanvas;
		this.circles = []; //each circle => {x, y, radius, data, color, visible}
		this.tempCircles = []; //stores circles that are currently being animated

		this.arrows = []; //each arrow => {x1, y1, x2, y2, width, color} (each arrow connects 2 centers of circles)

		this.labels = []; //head and tail labels
	}

	drawArrows() {
		this.arrows.forEach((arrow) => {
			//get points on the circumference of the circle and not the center
			const p = getPointsOnCircumference(
				arrow.x1,
				arrow.y1,
				arrow.x2,
				arrow.y2,
				this.circles[0].radius //getting radius of one circle (all circles have same radius)
			);
			this.sc.arrow(p.x1, p.y1, p.x2, p.y2, arrow.width, arrow.color);
		});
	}

	drawCircles() {
		//drawing temporary circles that are being animated
		//temporary circles are needed so there are no color coding problems caused (head and tail have colors)
		this.tempCircles.forEach((circle) => {
			this.sc.circle(circle.x, circle.y, circle.radius, circle.data, circle.color);
		});

		this.circles.forEach((circle, index) => {
			if (circle.visible) {
				this.sc.circle(
					circle.x,
					circle.y,
					circle.radius,
					circle.data,
					//head is green and tail is aqua
					index === 0 ? "green" : index === this.circles.length - 1 ? "aqua" : circle.color
				);
				//draw head and tail labels on nodes
				//tail label
				if (index === this.circles.length - 1) {
					this.sc.rect(circle.x - circle.radius + 15, circle.y + circle.radius + 10, 70, 30, 5, "Tail", "white");
				}
				//head label
				if (index === 0) {
					this.sc.rect(circle.x - circle.radius + 15, circle.y + circle.radius + 10, 70, 30, 5, "Head", "white");
				}
			}
		});
	}

	//generates a list of all arrows connecting the nodes
	generateArrows() {
		const arrows = [];
		for (let i = 0; i < this.circles.length - 1; i++) {
			arrows.push({
				x1: this.circles[i].x,
				y1: this.circles[i].y,
				x2: this.circles[i + 1].x,
				y2: this.circles[i + 1].y,
				width: 5,
				color: "red",
			});
		}
		this.arrows = arrows;
	}

	//calculates array of nodes (circles) that can be drawn on the canvas
	//also places the circles in proper positions (good (x, y) coords)
	generateCircles(ll) {
		const nodes = [];
		let curr = ll.head;

		const regularCoords = getRegularCoords(ll.length());
		let index = 0;
		//traversing through linked list
		while (curr) {
			nodes.push({
				x: regularCoords[index].x,
				y: regularCoords[index].y,
				radius: 50,
				data: curr.data,
				color: "white",
				visible: true,
			});
			index++;
			curr = curr.next;
		}

		this.circles = nodes;
	}
}
