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
