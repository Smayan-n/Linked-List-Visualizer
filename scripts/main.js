const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - canvas.offsetTop - 4;

const ctx = canvas.getContext("2d");
const drawing = new SimpleCanvas(ctx);
const animation = new CanvasAnimation(drawing);

//handle draging on nodes
canvas.addEventListener("mousedown", (e) => {
	nodes.forEach((circle) => {
		//get x and y offsets on canvas
		const clickX = e.offsetX,
			clickY = e.offsetY;

		//get dist from mouse click pos to center of circle
		const dist = distance(clickX, clickY, circle.x, circle.y);
		//if dist < radius of circle, click is in circle
		if (dist < circle.radius) {
			circle.click = true;
			//offsets for moving circle from exact coords user clicked on
			const offsets = {
				dx: circle.x - clickX,
				dy: circle.y - clickY,
			};
			canvas.onmousemove = (e) => {
				circle.x = e.offsetX + offsets.dx;
				circle.y = e.offsetY + offsets.dy;
			};
			canvas.onmouseup = (e) => {
				canvas.onmousemove = null;
				canvas.onmouseup = null;
			};
		}
	});
});

const ll = new LinkedList([1, 2, 4, 6, 7, 8]);
let nodes = ll.getDrawableNodes();
let addAnimStart = false;
let prependAnimStart = false;
let newNode = null;

$(".prepend-btn").on("click", () => {
	ll.prepend(12);
	const newNodes = ll.getDrawableNodes();
	nodes = newNodes.slice(1, newNodes.length);
	newNode = newNodes[0]; //first
	prependAnimStart = true;
});

$(".add-btn").on("click", () => {
	ll.append(43);
	const newNodes = ll.getDrawableNodes();
	nodes = newNodes.slice(0, newNodes.length - 1);
	newNode = newNodes[newNodes.length - 1]; //last
	addAnimStart = true;
	// add();
});

function animate(c1, c2, type) {
	//type will be either append or prepend
}

let frames = 0;

//start drawing
draw();
function draw() {
	//refresh canvas and get new animation frame
	drawing.refresh(draw);

	//drawing arrows
	for (let i = 0; i < nodes.length - 1; i++) {
		const p = getPointsOnCircumfrence(
			nodes[i].x,
			nodes[i].y,
			nodes[i + 1].x,
			nodes[i + 1].y,
			nodes[i + 1].radius
		);
		drawing.arrow(p.x1, p.y1, p.x2, p.y2, 5, "red");
		//for doubly linked list
		// drawing.arrow(p.x2, p.y2, p.x1, p.y1, 4, "red");
	}

	//drawing nodes
	nodes.forEach((circle, index) => {
		drawing.circle(
			circle.x,
			circle.y,
			circle.radius,
			circle.data,
			//head is green tail is blue, and rest are white
			index === 0
				? "green"
				: index === nodes.length - 1
				? "#33ccff"
				: "white"
		);
	});

	if (addAnimStart) {
		if (animation.animateCircle(newNode, 20)) {
			//
			const tail = nodes[nodes.length - 1];
			const points = getPointsOnCircumfrence(
				tail.x,
				tail.y,
				newNode.x,
				newNode.y,
				tail.radius
			);
			if (animation.animateLine(points, 20)) {
				addAnimStart = false;
				animation.reset();
				nodes.push(newNode);
			}
		}
	}

	if (prependAnimStart) {
		if (animation.animateCircle(newNode, 20)) {
			//
			const tail = nodes[0];
			const points = getPointsOnCircumfrence(
				newNode.x,
				newNode.y,
				tail.x,
				tail.y,
				tail.radius
			);
			if (animation.animateLine(points, 20)) {
				prependAnimStart = false;
				animation.reset();
				nodes.unshift(newNode);
			}
		}
	}

	frames++;
	//drawing nodes
	// nodes.forEach(circle => {
	//     drawing.circle(circle.x, circle.y, circle.radius, circle.data, circle.click === true ? "green" : "white");
	// });
}
