//NOTE: THE RADIUS VALUE IS HARDCODED

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - canvas.offsetTop;

const ctx = canvas.getContext("2d");
const simpleCanvas = new SimpleCanvas(ctx);
const animator = new CanvasAnimation(simpleCanvas);
const canvasObjHandler = new CanvasObjectHandler(simpleCanvas);

//window resize event listener
//resize canvas and regenerate circle and arrow positions so they fit on screen
window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - canvas.offsetTop;
	canvasObjHandler.generateCircles(ll);
	canvasObjHandler.generateArrows();
});

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

				//circle intersection detection - so circles don't overlap
				// let intersect = false;
				// canvasObjHandler.circles.forEach((c2) => {
				// 	if (JSON.stringify(circle) !== JSON.stringify(c2)) {
				// 		if (
				// 			canvasObjHandler.circleIntersect(
				// 				e.offsetX + offsets.dx,
				// 				e.offsetY + offsets.dy,
				// 				c2.x,
				// 				c2.y,
				// 				c2.radius,
				// 				c2.radius
				// 			)
				// 		) {
				// 			intersect = true;
				// 			return;
				// 		}
				// 	}
				// });

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

//change text on delete and insert buttons depending on index input
$(".index-input").on("change", () => {
	let index = getIndex();
	$(".delete-btn").text(`Delete at index ${index}`);
	$(".insert-btn").text(`Insert at index ${index}`);
});

const ll = new LinkedList([1, 2, 3, 4]);

canvasObjHandler.generateCircles(ll);
canvasObjHandler.generateArrows();

//boolean values to check if animations has started
let appendAnimStart = false;
let prependAnimStart = false;
let insertAnimStart = false;
let deleteLastAnimStart = false;
let deleteFirstAnimStart = false;
let deleteMiddleAnimStart = false;

let newNode = null;
let newArrow = null;

let leftArrow = null;
let rightArrow = null;

let deleteIndex = null;
$(".delete-btn").on("click", () => {
	deleteIndex = getIndex();
	//validations
	if (deleteIndex > ll.length() - 1 || deleteIndex < 0) {
		createPopup("Index out of bounds", "red");
		return;
	}
	if (ll.length() === 1) {
		createPopup("Cannot delete head", "red");
		return;
	}

	if (deleteIndex === ll.length() - 1) {
		newNode = canvasObjHandler.circles[deleteIndex];
		canvasObjHandler.circles[deleteIndex].visible = false;
		deleteLastAnimStart = true;
	} else if (deleteIndex === 0) {
		newNode = canvasObjHandler.circles[deleteIndex];
		canvasObjHandler.circles[deleteIndex].visible = false;
		deleteFirstAnimStart = true;
	} else {
		newNode = canvasObjHandler.circles[deleteIndex];
		leftArrow = canvasObjHandler.arrows[deleteIndex - 1];
		rightArrow = canvasObjHandler.arrows[deleteIndex];
		//start traversing animation
		traverseIndex = deleteIndex;
		traverseAnimStart = true;
	}
});

let insertIndex = null;

$(".insert-btn").on("click", () => {
	insertIndex = getIndex();
	//redirecting insertion to append and prepend functions if index is 0 or ll.length()
	if (insertIndex === ll.length()) {
		append();
	} else if (insertIndex === 0) {
		prepend();
	} else {
		insert();
	}
});

$(".prepend-btn").on("click", () => {
	prepend();
});

$(".add-btn").on("click", () => {
	append();
});

//traversingAnimation
let traverseAnimStart = false;

//prepend and append functions could be optimized to use the same code
const prepend = () => {
	$("canvas").css("cursor", "crosshair");
	openPopup("Click anywhere on canvas to prepend node");

	canvas.onclick = (e) => {
		closePopup();
		newNode = {
			x: e.offsetX,
			y: e.offsetY,
			radius: 50,
			data: getData(),
			color: "white",
			visible: true,
		};
		newArrow = {
			index: canvasObjHandler.arrows.length,
			x1: newNode.x,
			y1: newNode.y,
			x2: canvasObjHandler.circles[0].x,
			y2: canvasObjHandler.circles[0].y,
			width: 5,
			color: "red",
		};

		prependAnimStart = true;
		canvas.onclick = null;
		$("canvas").css("cursor", "default");
	};
};

const insert = () => {
	if (insertIndex > ll.length() || insertIndex < 0) {
		createPopup("Index out of bounds", "red");
		return;
	}
	$("canvas").css("cursor", "crosshair");
	openPopup("Click anywhere on canvas to insert node");

	canvas.onclick = (e) => {
		closePopup();
		newNode = {
			x: e.offsetX,
			y: e.offsetY,
			radius: 50,
			data: getData(),
			color: "white",
			visible: true,
		};
		leftArrow = canvasObjHandler.arrows[insertIndex - 1];
		rightArrow = {
			index: insertIndex,
			x1: newNode.x,
			y1: newNode.y,
			x2: canvasObjHandler.circles[insertIndex].x,
			y2: canvasObjHandler.circles[insertIndex].y,
			width: 5,
			color: "red",
		};
		//start traversing animation
		traverseIndex = insertIndex;
		traverseAnimStart = true;
		canvas.onclick = null;
		$("canvas").css("cursor", "default");
	};
};

const append = () => {
	$("canvas").css("cursor", "crosshair");
	openPopup("Click anywhere on canvas to append node");

	canvas.onclick = (e) => {
		closePopup();
		newNode = {
			x: e.offsetX,
			y: e.offsetY,
			radius: 50,
			data: getData(),
			color: "white",
			visible: true,
		};
		newArrow = {
			index: canvasObjHandler.arrows.length,
			x1: canvasObjHandler.circles[canvasObjHandler.circles.length - 1].x,
			y1: canvasObjHandler.circles[canvasObjHandler.circles.length - 1].y,
			x2: newNode.x,
			y2: newNode.y,
			width: 5,
			color: "red",
		};
		appendAnimStart = true;
		canvas.onclick = null;
		$("canvas").css("cursor", "default");
	};
};

//methods to read and validate data and index inputs from user
const getIndex = () => {
	let index = $(".index-input").val();
	if (index === "") {
		return 0; //default index value
	}
	return parseInt(index);
};
const getData = () => {
	let data = $(".data-input").val();
	if (data === "") {
		return 10; //default data value
	}
	return parseInt(data);
};

//animation vars
let animFrames = 0;
const animSpeed = 60; //higher is slower animations

let currTraverseAnimIndex = 0;
let traverseIndex;

//start drawing
draw();
function draw() {
	//refresh canvas and get new animation frame
	simpleCanvas.refresh(draw);

	//-----------------animation sequences-------------------

	//traverse animation
	if (traverseAnimStart) {
		animFrames++;
		if (animFrames < animSpeed) {
			const c = { ...canvasObjHandler.circles[currTraverseAnimIndex] };
			c.radius = 57;
			c.color = "orange";
			simpleCanvas.circle(c.x, c.y, c.radius, c.data, c.color);
		}
		if (
			animFrames === animSpeed &&
			currTraverseAnimIndex >= traverseIndex
		) {
			animFrames = animSpeed * 2;
		}
		if (animFrames > animSpeed && animFrames < animSpeed * 2) {
			const a = { ...canvasObjHandler.arrows[currTraverseAnimIndex] };
			a.width = 12;
			animator.animateLine(a, animSpeed);
			// simpleCanvas.arrow(a.x1, a.y1, a.x2, a.y2, a.width, "blue");
		}
		if (animFrames === animSpeed * 2) {
			if (currTraverseAnimIndex < traverseIndex) {
				currTraverseAnimIndex++;
				animFrames = 0;
				animator.reset();
			} else {
				traverseAnimStart = false;
				deleteMiddleAnimStart = true;
				// insertAnimStart = true;
				currTraverseAnimIndex = 0;
				animFrames = 0;
				canvasObjHandler.tempCircles = [];
				animator.reset();
			}
		}
	}

	//add animations
	if (appendAnimStart) {
		animFrames++;
		if (animFrames < animSpeed) {
			animator.animateCircle(newNode, animSpeed);
		}
		if (animFrames === animSpeed) {
			//add new node in temp arr
			canvasObjHandler.tempCircles.push(newNode);
		}
		if (animFrames > animSpeed && animFrames < animSpeed * 2) {
			animator.animateLine(newArrow, animSpeed);
		}
		if (animFrames === animSpeed * 2) {
			//add arrow to end
			canvasObjHandler.arrows.push(newArrow);
		}
		if (animFrames > animSpeed * 2.1) {
			//clear the temp circles arr and add node to main circle arr
			canvasObjHandler.circles.push(newNode);
			canvasObjHandler.tempCircles = [];

			appendAnimStart = false;
			animator.reset();
			animFrames = 0;
			ll.append(newNode.data);
		}
	}

	if (prependAnimStart) {
		animFrames++;
		if (animFrames < animSpeed) {
			animator.animateCircle(newNode, animSpeed);
		}
		if (animFrames === animSpeed) {
			//add node at position 0 in tempArr
			canvasObjHandler.tempCircles.unshift(newNode);
		}
		if (animFrames > animSpeed && animFrames < animSpeed * 2) {
			animator.animateLine(newArrow, animSpeed);
		}
		if (animFrames === animSpeed * 2) {
			//add arrow at position 0
			canvasObjHandler.arrows.unshift(newArrow);
		}
		if (animFrames > animSpeed * 2.1) {
			//clear the temp circles arr and add node to main circle arr
			canvasObjHandler.circles.unshift(newNode);
			canvasObjHandler.tempCircles = [];

			prependAnimStart = false;
			animator.reset();
			animFrames = 0;
			ll.prepend(newNode.data);
		}
	}

	if (insertAnimStart) {
		animFrames++;

		if (animFrames < animSpeed) {
			animator.animateCircle(newNode, animSpeed);
		}
		if (animFrames === animSpeed) {
			canvasObjHandler.circles.splice(insertIndex, 0, newNode);
			canvasObjHandler.arrows.splice(insertIndex - 1, 1); //delete existing arrow
		}
		if (animFrames >= animSpeed && animFrames < animSpeed * 2) {
			//animate left arrow moving to new node
			animator.animateMoveLine(
				leftArrow,
				{ x: newNode.x, y: newNode.y },
				animSpeed
			);
		}
		if (animFrames === animSpeed * 2) {
			animator.reset(); //to avoid any weird line drawing
			//left arrow's end points are now changed
			leftArrow.x2 = newNode.x;
			leftArrow.y2 = newNode.y;
			//left arrow is added to main list so it can be drawn
			canvasObjHandler.arrows.splice(insertIndex - 1, 0, leftArrow);
		}
		if (animFrames >= animSpeed * 2 && animFrames < animSpeed * 3) {
			animator.animateLine(rightArrow, animSpeed);
		}
		if (animFrames === animSpeed * 3) {
			canvasObjHandler.arrows.splice(insertIndex, 0, rightArrow);
		}
		if (animFrames > animSpeed * 3) {
			animator.reset();
			insertAnimStart = false;
			animFrames = 0;
			//update actual linked list
			ll.insertAtIndex(newNode.data, insertIndex);
		}
	}

	//delete animations
	if (deleteLastAnimStart) {
		animFrames++;
		if (animFrames < animSpeed) {
			animator.animateCircle(newNode, animSpeed, true);
		}
		if (animFrames === animSpeed) {
			//remove arrow
			newArrow = canvasObjHandler.arrows.pop();
		}
		if (animFrames > animSpeed && animFrames < animSpeed * 2) {
			animator.animateLine(newArrow, animSpeed, true, false);
		}
		if (animFrames === animSpeed * 2) {
			//delete last circle
			canvasObjHandler.circles.pop();
		}
		if (animFrames > animSpeed * 2.2) {
			deleteLastAnimStart = false;
			animator.reset();
			animFrames = 0;
			ll.deleteAtIndex(ll.length() - 1);
		}
	}

	if (deleteFirstAnimStart) {
		animFrames++;
		if (animFrames < animSpeed) {
			animator.animateCircle(newNode, animSpeed, true);
		}
		if (animFrames === animSpeed) {
			//remove arrow
			newArrow = canvasObjHandler.arrows.shift();
		}
		if (animFrames > animSpeed && animFrames < animSpeed * 2) {
			animator.animateLine(newArrow, animSpeed, true, true);
		}
		if (animFrames === animSpeed * 2) {
			//delete first circle
			canvasObjHandler.circles.shift();
		}
		if (animFrames > animSpeed * 2.2) {
			deleteFirstAnimStart = false;
			animator.reset();
			animFrames = 0;
			ll.deleteAtIndex(0);
		}
	}

	if (deleteMiddleAnimStart) {
		animFrames++;
		if (animFrames === 1) {
			canvasObjHandler.arrows.splice(deleteIndex, 1);
		}
		if (animFrames < animSpeed) {
			animator.animateLine(rightArrow, animSpeed, true, false);
		}
		if (animFrames === animSpeed) {
			//delete circle from arr so animation of it shrinking can be seen
			canvasObjHandler.circles.splice(deleteIndex, 1);
		}
		if (animFrames >= animSpeed && animFrames < animSpeed * 2) {
			//animate circle shrinking
			animator.animateCircle(newNode, animSpeed * 1.01, true);
		}
		if (animFrames === animSpeed * 2) {
			animator.reset(); //to avoid any weird line drawing
			//delete arrow so it can be animated
			canvasObjHandler.arrows.splice(deleteIndex - 1, 1);
		}
		if (animFrames >= animSpeed * 2 && animFrames < animSpeed * 3) {
			//animate arrow moving
			animator.animateMoveLine(
				leftArrow,
				{ x: rightArrow.x2, y: rightArrow.y2 },
				animSpeed
			);
		}
		if (animFrames === animSpeed * 3) {
			//left arrow's end points are now changed
			leftArrow.x2 = rightArrow.x2;
			leftArrow.y2 = rightArrow.y2;
			//left arrow is added to main list so it can be drawn
			canvasObjHandler.arrows.splice(deleteIndex - 1, 0, leftArrow);
		}
		if (animFrames > animSpeed * 3) {
			animator.reset();
			deleteMiddleAnimStart = false;
			animFrames = 0;
			//update actual linked list
			ll.deleteAtIndex(deleteIndex);
		}
	}

	//drawing objects
	canvasObjHandler.drawArrows();
	canvasObjHandler.drawCircles();
}
