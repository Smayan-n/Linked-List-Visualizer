const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - canvas.offsetTop - 4;

const ctx = canvas.getContext("2d");
const drawing = new SimpleCanvas(ctx);

//handle draging on nodes
canvas.addEventListener("mousedown", (e) => {
	circles.forEach((circle) => {
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

const ll = new LinkedList([1, 2, 3, 4, 6, 8, 12, 34, 56, 789]);
let circles = ll.getDrawableNodes();
let animStart = false;
let newTail = null;

$(".add-btn").on("click", () => {
	ll.append(43);
	const newCircles = ll.getDrawableNodes();
	circles = newCircles.slice(0, newCircles.length - 1);
	newTail = newCircles[newCircles.length - 1];
	animStart = true;
	// add();
});

function add() {
	const tail = circles[circles.length - 2];
	const newCircle = circles[circles.length - 1];
	const dist = distance(tail.x, tail.y, newCircle.x, newCircle.y);
	for (let i = 0; i < dist; i++) {
		// ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawing.arrow(tail.x, tail.y, tail.x + i, tail.y + i, 5, "red");
	}
}

let frames = 0;
let cntx = 0;
let cnty = 0;
let animFrms = 0;

//start drawing
draw();
function draw() {
	//refresh canvas and get new animation frame
	drawing.refresh(draw);

	//drawing arrows
	for (let i = 0; i < circles.length - 1; i++) {
		const p = getPointsOnCircumfrence(
			circles[i].x,
			circles[i].y,
			circles[i + 1].x,
			circles[i + 1].y,
			circles[i + 1].radius
		);
		drawing.arrow(p.x1, p.y1, p.x2, p.y2, 5, "red");
		//for doubly linked list
		// drawing.arrow(p.x2, p.y2, p.x1, p.y1, 4, "red");

		drawing.circle(
			circles[i].x,
			circles[i].y,
			circles[i].radius,
			circles[i].data,
			i === 0 ? "green" : "white"
		);
		//drawing last circle
		if (i === circles.length - 2) {
			drawing.circle(
				circles[i + 1].x,
				circles[i + 1].y,
				circles[i + 1].radius,
				circles[i + 1].data,
				"#33ccff" //blue color
			);
		}
	}

	if (animStart) {
		animFrms++;

		drawing.circle(
			newTail.x,
			newTail.y,
			newTail.radius,
			newTail.data,
			"white"
		);

		if (animFrms >= 12) {
			const tail = circles[circles.length - 1];
			const p = getPointsOnCircumfrence(
				tail.x,
				tail.y,
				newTail.x,
				newTail.y,
				tail.radius
			);
			const distX = p.x1 - p.x2;
			const distY = p.y1 - p.y2;

			drawing.arrow(p.x1, p.y1, p.x1 - cntx, p.y1 - cnty, 5, "blue");
			const speed = 40;
			cntx += distX / speed;
			cnty += distY / speed;

			console.log(cntx, cnty, distX, distY);

			//animation over
			if (
				Math.abs(cntx) >= Math.abs(distX) ||
				Math.abs(cnty) >= Math.abs(distY)
			) {
				cntx = 0;
				cnty = 0;
				animFrms = 0;
				circles.push(newTail);
				animStart = false;
			}
		}
	}

	frames++;
	//drawing circles
	// circles.forEach(circle => {
	//     drawing.circle(circle.x, circle.y, circle.radius, circle.data, circle.click === true ? "green" : "white");
	// });
}
