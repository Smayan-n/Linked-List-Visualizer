function getPointsOnCircumference(x1, y1, x2, y2, dt) {
	//returns x, y coords on given line dt distance from x1, y1 and also x2, y2 (returns 2 coords)

	const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

	//ratio of distances
	let t = (dt + 2) / d;
	const x1f = x1 * (1 - t) + t * x2;
	const y1f = y1 * (1 - t) + t * y2;

	t = (d - dt - 6) / d;
	const x2f = x1 * (1 - t) + t * x2;
	const y2f = y1 * (1 - t) + t * y2;

	return { x1: x1f, y1: y1f, x2: x2f, y2: y2f };
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

//creates a custom animated popup
function createPopup(text, color = "orange") {
	openPopup(text, color);
	setTimeout(() => {
		closePopup();
	}, 1500);
}
function openPopup(text, color = "orange") {
	$(".popup").text(text);
	$(".popup").css({ visibility: "visible", "background-color": color });
	$(".popup").addClass("slideAnimStart");
}
function closePopup() {
	$(".popup").removeClass("slideAnimStart");
	$(".popup").addClass("slideAnimEnd");
	setTimeout(() => {
		$(".popup").removeClass("slideAnimEnd");
		$(".popup").css("visibility", "hidden");
	}, 500);
}

//function to return a set of coords for the circles so they are arranged in a regular order
function getRegularCoords(numCircles) {
	const coords = [];
	let xCoord = 75;
	let yCoord = 75;
	let flag = true;
	for (let i = 0; i < numCircles; i++) {
		coords.push({ x: xCoord, y: yCoord });
		//to calculate placement of the circles
		xCoord += (window.innerWidth - 50) / ll.length();
		if (flag) {
			yCoord += 100;
			flag = false;
		} else {
			yCoord -= 100;
			flag = true;
		}
	}
	return coords;
}

function circleIntersect(x1, y1, x2, y2, r1, r2) {
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
