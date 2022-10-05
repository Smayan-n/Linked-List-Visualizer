const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - canvas.offsetTop - 4;

const ctx = canvas.getContext("2d");
const simpleCanvas = new SimpleCanvas(ctx);
const animator = new CanvasAnimation(simpleCanvas);
const canvasObjHandler = new CanvasObjectHandler(simpleCanvas);

//handle draging on nodes
canvas.addEventListener("mousedown", (e) => {
	canvasObjHandler.circles.forEach((circle) => {
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
				//update arrows as well
				canvasObjHandler.generateArrows();

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
canvasObjHandler.generateCircles(ll);
canvasObjHandler.generateArrows();
// let nodes = canvasObjHandler.circles;
let addAnimStart = false;
let prependAnimStart = false;
let insertAnimStart = false;
let newNode = null;
let newArrow = null;
let animationObjects = [];

$(".insert-btn").on("click", () => {
	ll.insertAtIndex(40, 2);
	animationObjects = canvasObjHandler.getAnimationValues(ll, 2);
	newNode = animationObjects[0];
	insertAnimStart = true;
});

$(".prepend-btn").on("click", () => {
	ll.prepend(12);
	animationObjects = canvasObjHandler.getAnimationValues(ll, 0);
	newNode = animationObjects[0];
	newArrow = animationObjects[1];
	prependAnimStart = true;

	// const newNodes = ll.getDrawableNodes();
	// nodes = newNodes.slice(1, newNodes.length);
	// newNode = newNodes[0]; //first
	// prependAnimStart = true;
});

$(".add-btn").on("click", () => {
	ll.append(43);
	animationObjects = canvasObjHandler.getAnimationValues(ll, ll.length() - 1);
	newNode = animationObjects[0];
	newArrow = animationObjects[1];
	addAnimStart = true;
});

let frames = 0;
let animFrames = 0;
const animSpeed = 25;

//start simpleCanvas
draw();
function draw() {
	//refresh canvas and get new animation frame
	simpleCanvas.refresh(draw);

	//drawing objects
	canvasObjHandler.drawArrows();
	canvasObjHandler.drawCircles();

	if (addAnimStart) {
		// if (animator.animateCircle(newNode, 20)) {
		// 	//
		// 	const oldNode = nodes[nodes.length - 1];
		// 	const points = getPointsOnCircumfrence(
		// 		oldNode.x,
		// 		oldNode.y,
		// 		newNode.x,
		// 		newNode.y,
		// 		oldNode.radius
		// 	);
		// 	if (animator.animateLine(points, 20)) {
		// 		addAnimStart = false;
		// 		animator.reset();
		// 		nodes.push(newNode);
		// 	}
		// }
		animFrames++;
		if (animFrames < animSpeed) {
			animator.animateCircle(newNode, animSpeed);
		}
		if (animFrames === animSpeed) {
			canvasObjHandler.circles.push(newNode);
		}
		if (animFrames > animSpeed && animFrames < animSpeed * 2) {
			animator.animateLine(newArrow, animSpeed);
		}
		if (animFrames > animSpeed * 2) {
			canvasObjHandler.arrows.push(newArrow);
			addAnimStart = false;
			animator.reset();
			animFrames = 0;
		}
	}

	if (prependAnimStart) {
		// if (animator.animateCircle(newNode, 20)) {
		// 	//
		// 	const oldNode = canvasObjHandler.circles[0];
		// 	const points = getPointsOnCircumfrence(
		// 		newNode.x,
		// 		newNode.y,
		// 		oldNode.x,
		// 		oldNode.y,
		// 		oldNode.radius
		// 	);
		// 	if (animator.animateLine(points, 20)) {
		// 		prependAnimStart = false;
		// 		animator.reset();
		// 		canvasObjHandler.circles.unshift(newNode);
		// 		canvasObjHandler.arrows.unshift(newArrow);
		// 	}
		// }
		animFrames++;

		if (animFrames < animSpeed) {
			animator.animateCircle(newNode, animSpeed);
		}
		if (animFrames === animSpeed) {
			canvasObjHandler.circles.unshift(newNode);
		}
		if (animFrames > animSpeed && animFrames < animSpeed * 2) {
			animator.animateLine(newArrow, animSpeed);
		}
		if (animFrames > animSpeed * 2) {
			canvasObjHandler.arrows.unshift(newArrow);
			prependAnimStart = false;
			animator.reset();
			animFrames = 0;
		}
	}

	if (insertAnimStart) {
		const leftArrow = animationObjects[1];
		const rightArrow = animationObjects[2];

		if (animFrames >= 0 && animFrames < 20) {
			animator.animateCircle(newNode, 20);
		}
		if (animFrames === 20) {
			canvasObjHandler.circles.splice(2, 0, newNode);
		}
		if (animFrames >= 20 && animFrames < 40) {
			animator.animateLine(leftArrow, 20);
		}
		if (animFrames === 40) {
			canvasObjHandler.arrows.splice(1, 0, leftArrow);
		}
		if (animFrames >= 40 && animFrames < 60) {
			animator.animateLine(rightArrow, 20);
		}
		if (animFrames === 60) {
			canvasObjHandler.arrows.splice(2, 0, rightArrow);
		}
		if (animFrames > 60) {
			insertAnimStart = false;
			animator.reset();
		}

		animFrames++;
	}

	frames++;
	//simpleCanvas nodes
	// nodes.forEach(circle => {
	//     simpleCanvas.circle(circle.x, circle.y, circle.radius, circle.data, circle.click === true ? "green" : "white");
	// });
}
