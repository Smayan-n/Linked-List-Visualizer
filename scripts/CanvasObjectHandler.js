//class for handling objects drawn on canvas
class CanvasObjectHandler {
	constructor(simpleCanvas) {
		//takes in a SimpleCanvas object
		this.sc = simpleCanvas;
		this.circles = []; //each circle => {x, y, radius, data, color}
		this.tempCircles = []; //stores circles that are currently being animated
		this.arrows = []; //each arrow => {x1, y1, x2, y2, width, color}
	}

	drawArrows() {
		this.arrows.forEach((arrow) => {
			this.sc.arrow(
				arrow.x1,
				arrow.y1,
				arrow.x2,
				arrow.y2,
				arrow.width,
				arrow.color
			);
		});
	}

	drawCircles() {
		this.circles.forEach((circle, index) => {
			this.sc.circle(
				circle.x,
				circle.y,
				circle.radius,
				circle.data,
				// circle.color
				//head is green and tail is aqua
				index === 0
					? "green"
					: index === this.circles.length - 1
					? "aqua"
					: "white"
			);
		});

		//drawing circles that are being animated
		this.tempCircles.forEach((circle) => {
			this.sc.circle(
				circle.x,
				circle.y,
				circle.radius,
				circle.data,
				circle.color
			);
		});
	}

	//generates a list of all arrows connecting the nodes
	generateArrows() {
		const arrows = [];
		for (let i = 0; i < this.circles.length - 1; i++) {
			//get points on the circumference of the circle and not the center
			const p = getPointsOnCircumference(
				this.circles[i].x,
				this.circles[i].y,
				this.circles[i + 1].x,
				this.circles[i + 1].y,
				this.circles[i + 1].radius
			);

			arrows.push({
				index: i,
				x1: p.x1,
				y1: p.y1,
				x2: p.x2,
				y2: p.y2,
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

		let x = 75;
		let y = 75;
		let flag = true;
		let index = 0;
		//traversing through linked list
		while (curr) {
			nodes.push({
				x: x,
				y: y,
				radius: 50,
				data: curr.data,
				color: "white",
			});

			//to calculate placement of the circles
			x += (window.innerWidth - 50) / ll.length();
			if (flag) {
				y += 100;
				flag = false;
			} else {
				y -= 100;
				flag = true;
			}

			curr = curr.next;
			index++;
		}

		this.circles = nodes;
	}

	//returns a list of circles and arrows that have to be animated
	getAnimationObjects(ll, index) {
		//ll is the linked list
		//index is of the node that is added

		this.generateCircles(ll);
		this.generateArrows();

		const animationObjects = [];

		animationObjects.push(this.circles[index]);
		this.circles.splice(index, 1);

		if (index === 0) {
			animationObjects.push(this.arrows[0]);
			this.arrows.splice(0, 1);
		} else if (index === ll.length() - 1) {
			animationObjects.push(this.arrows[this.arrows.length - 1]);
			this.arrows.splice(this.arrows.length - 1, 1);
		} else {
			animationObjects.push(this.arrows[index - 1]);
			animationObjects.push(this.arrows[index]);
			this.arrows.splice(index - 1, 2);
		}

		return animationObjects;
	}

	// 1 -> 2 -> 3 -> 4
	//[1, 2, 3, 4]
	//[1, 2, 3]
}
