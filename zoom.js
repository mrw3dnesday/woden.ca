const imageURL =
	"52259221868_e86daccb7d_6k.jpg";
const canvas = document.getElementById("image-canvas");

const img = new Image();
img.src = imageURL;
//Load image
img.onload = () => {
	createCanvas(canvas, img);
};

/**
 * Creates a canvas for a image.
 * @param {Canvas} canvas element.
 * @param {Image} img image.
 */
function createCanvas(canvas, img) {
	//Canvas
	const ctx = canvas.getContext("2d");
	//canvas.width = img.width;
	//canvas.height = img.height;

    canvas.width = img.width;
	canvas.height = img.height;


	//Calcs
	let cameraZoom;
	let cameraOffset;

	let startWidth;
	let startHeight;

	/**
	 * Sets cameraZoom and cameraOffset.
	 */
	function setInitialValues() {
		cameraZoom = Math.min(canvas.width / img.width, canvas.height / img.height);
		const xOffset = (canvas.width - img.width * cameraZoom) / 2;
		const yOffset = (canvas.height - img.height * cameraZoom) / 2;
		cameraOffset = { x: xOffset, y: yOffset };

		startWidth = img.width * cameraZoom;
		startHeight = img.height * cameraZoom;
	}

	setInitialValues();

	/**
	 * Draw function.
	 */
	function draw() {
		//Calc
		const difX = cameraOffset.x + (startWidth - canvas.width) / 2;
		const difY = cameraOffset.y + (startHeight - canvas.height) / 2;
		const posX = (canvas.width - img.width * cameraZoom) / 2 + difX * cameraZoom;
		const posY =
			(canvas.height - img.height * cameraZoom) / 2 + difY * cameraZoom;

		//Context draw
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(
			img,
			posX,
			posY,
			img.width * cameraZoom,
			img.height * cameraZoom
		);
	}

	let isDragging = false;
	const dragStart = { x: 0, y: 0 };
	const mult = Math.max(img.width, img.height) / 1000;

	canvas.onmousedown = (event) => {
		isDragging = true;
		dragStart.x = event.clientX / cameraZoom - cameraOffset.x / mult;
		dragStart.y = event.clientY / cameraZoom - cameraOffset.y / mult;
	};

	canvas.onmouseup = canvas.onmouseleave = () => (isDragging = false);

	canvas.onmousemove = (event) => {
		if (!isDragging) return;
		cameraOffset.x = (event.clientX / cameraZoom - dragStart.x) * mult;
		cameraOffset.y = (event.clientY / cameraZoom - dragStart.y) * mult;

		requestAnimationFrame(draw);
	};

	canvas.onwheel = (event) => {
		if (isDragging) return;
		cameraZoom -= event.deltaY * 0.0005; //Reduce sensitivity
		if (cameraZoom < 0.01) cameraZoom = 0.01;

		requestAnimationFrame(draw);
		event.preventDefault();
	};


	//First draw.
	draw();
}
