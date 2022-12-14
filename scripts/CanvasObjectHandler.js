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
		this.circles.forEach((circle, index) => {
			if (circle.visible) {
				this.sc.circle(
					circle.x,
					circle.y,
					circle.radius,
					circle.data,
					//head is green and tail is aqua
					index === 0
						? "green"
						: index === this.circles.length - 1
						? "aqua"
						: circle.color
				);
				//draw head and tail labels on nodes
				//tail label
				if (index === this.circles.length - 1) {
					this.sc.rect(
						circle.x - circle.radius + 15,
						circle.y + circle.radius + 10,
						70,
						30,
						5,
						"Tail",
						"white"
					);
				}
				//head label
				if (index === 0) {
					this.sc.rect(
						circle.x - circle.radius + 15,
						circle.y + circle.radius + 10,
						70,
						30,
						5,
						"Head",
						"white"
					);
				}
			}
		});

		//drawing temporary circles that are being animated
		//temporary circles are needed so there are no color coding problems caused (head and tail have colors)
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
			arrows.push({
				index: i,
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
				visible: true,
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

	circleIntersect(x1, y1, x2, y2, r1, r2) {
		//distance
		let d = distance(x1, y1, x2, y2);
		// let r1 = c1.radius;
		// let r2 = c2.radius;

		//c2 is inside c1
		if (d <= r1 - r2) {
			return true;
		}
		//c1 is inside c2
		if (d <= r2 - r1) {
			return true;
		}
		//circles intersect
		if (d < r1 + r2) {
			return true;
		}
		//circles touch
		if (d === r1 + r2) {
			return true;
		}
		//circles don't intersect or touch
		else {
			return false;
		}
	}

	//returns a list of circles and arrows that have to be animated
	//NOTE: CAN BE OPTIMIZED - LOOK AT MAIN FILE
	//NOT USED RIGHT NOW
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
