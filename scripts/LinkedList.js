class Node {
	constructor(data) {
		this.data = data;
		this.next = null;
		this.prev = null;
	}
}

class LinkedList {
	constructor(list) {
		//create new linked list from input"
		this.head = null;
		this.tail = null;
		if (list) {
			list.forEach((data) => {
				this.append(data);
			});
		}
	}

	append(data) {
		//append node to the end of linked list
		const node = new Node(data);
		if (!this.head) {
			this.head = node;
			this.tail = node;
			return;
		}

		node.prev = this.tail;
		this.tail.next = node;
		this.tail = node;
	}

	insertAtIndex(data, index) {
		if (!this.head) {
			return;
		}
		if (index === 0) {
			this.prepend(data);
			return;
		}
		if (index === this.length()) {
			this.append(data);
			return;
		}

		const newNode = new Node(data);
		let curr = this.head;
		let currIndex = 0;
		while (curr) {
			if (currIndex === index - 1) {
				newNode.prev = curr;
				newNode.next = curr.next;
				curr.next = newNode;
				if (curr.next.next) {
					curr.next.next.prev = newNode;
				}
				return;
			}
			currIndex++;
			curr = curr.next;
		}
	}

	prepend(data) {
		//add node to the start of linked list
		const node = new Node(data);

		node.next = this.head;
		this.head.prev = node;
		this.head = node;
	}

	length() {
		//return length of linked list
		let curr = this.head;
		let count = 0;
		while (curr) {
			count++;
			curr = curr.next;
		}
		return count;
	}

	//not used right now
	getDrawableNodes() {
		//returns array of nodes (circles) that can be drawn on the canvas
		//also places nodes in proper positions (good (x, y) coords)

		const nodes = [];
		let curr = self.head;

		let x = 75;
		let y = 75;
		let flag = true;
		while (curr) {
			nodes.push({
				x: x,
				y: y,
				radius: 50,
				data: curr.data,
				color: "white",
				click: false,
			});

			x += (window.innerWidth - 50) / ll.length();
			if (flag) {
				y += 100;
				flag = false;
			} else {
				y -= 100;
				flag = true;
			}

			curr = curr.next;
		}
		return nodes;
	}
}
