const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - canvas.offsetTop - 4;

const ctx = canvas.getContext("2d");
const simpleCanvas = new SimpleCanvas(ctx);
const animator = new CanvasAnimation(simpleCanvas);
const canvasObjHandler = new CanvasObjectHandler(simpleCanvas);

//handle dragging on nodes
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

const ll = new LinkedList([1, 2]);
canvasObjHandler.generateCircles(ll);
canvasObjHandler.generateArrows();
// let nodes = canvasObjHandler.circles;
let addAnimStart = false;
let prependAnimStart = false;
let insertAnimStart = false;
let newNode = null;
let newArrow = null;
let animationObjects = [];

const insertIndex = 1;
$(".insert-btn").on("click", () => {
	ll.insertAtIndex(40, insertIndex);
	animationObjects = canvasObjHandler.getAnimationObjects(ll, insertIndex);
	newNode = animationObjects[0];
	insertAnimStart = true;
});

$(".prepend-btn").on("click", () => {
	ll.prepend(12);
	animationObjects = canvasObjHandler.getAnimationObjects(ll, 0);
	newNode = animationObjects[0];
	newArrow = animationObjects[1];
	prependAnimStart = true;
});

$(".add-btn").on("click", () => {
	ll.append(43);
	animationObjects = canvasObjHandler.getAnimationObjects(
		ll,
		ll.length() - 1
	);
	newNode = animationObjects[0];
	newArrow = animationObjects[1];
	addAnimStart = true;
});

let animFrames = 0;
//higher is slower
const animSpeed = 30;

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
		// 	const points = getPointsOnCircumference(
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
			canvasObjHandler.tempCircles.push(newNode);
		}
		if (animFrames > animSpeed && animFrames < animSpeed * 2) {
			animator.animateLine(newArrow, animSpeed);
		}
		if (animFrames > animSpeed * 2 && animFrames < animSpeed * 2.3) {
			canvasObjHandler.arrows.push(newArrow);
		}
		if (animFrames > animSpeed * 2.3) {
			canvasObjHandler.circles.push(newNode);
			canvasObjHandler.tempCircles = [];
			addAnimStart = false;
			animator.reset();
			animFrames = 0;
		}
	}

	if (prependAnimStart) {
		animFrames++;

		if (animFrames < animSpeed) {
			animator.animateCircle(newNode, animSpeed);
		}
		if (animFrames === animSpeed) {
			//add node at position 0
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
		animFrames++;

		const leftArrow = animationObjects[1];
		const rightArrow = animationObjects[2];

		if (animFrames < animSpeed) {
			animator.animateCircle(newNode, animSpeed);
		}
		if (animFrames === animSpeed) {
			canvasObjHandler.circles.splice(insertIndex, 0, newNode);
		}
		if (animFrames >= animSpeed && animFrames < animSpeed * 2) {
			animator.animateLine(leftArrow, animSpeed);
		}
		if (animFrames === animSpeed * 2) {
			animator.reset(); //to avoid any weird line drawing
			canvasObjHandler.arrows.splice(insertIndex - 1, 0, leftArrow);
		}
		if (animFrames >= animSpeed * 2 && animFrames < animSpeed * 3) {
			animator.animateLine(rightArrow, animSpeed);
		}
		if (animFrames === animSpeed * 3) {
			canvasObjHandler.arrows.splice(insertIndex, 0, rightArrow);
		}
		if (animFrames > animSpeed * 3) {
			insertAnimStart = false;
			animFrames = 0;
			animator.reset();
		}
	}
}
