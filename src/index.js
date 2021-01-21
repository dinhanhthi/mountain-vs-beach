var model = undefined;
const classifierElement = document.getElementById('classifier');
const loader = document.getElementById("loader");
const result = document.getElementById("result");
const listImgs = document.getElementById("list-imgs");
const mainImage = document.getElementById("main-img");
const imageDisplay = mainImage.firstElementChild;
const predictLoader = document.getElementById("predict-loader");
const imgTextPredict = document.getElementById("img-text-predict");
let goodImg = true;

// init
async function initialize() {
	// 193MB version
	// model = await tf.loadGraphModel('saved_model/not-quantized/model.json');

	// 48MB version
	model = await tf.loadGraphModel('saved_model/quantized/model.json');
	classifierElement.style.display = 'block';
	listImgs.style.display = "flex";
	if (bar < 99) {
		bar = 100;
		clearInterval(idloader);
		loader.style.display = "none";
	}
	document.getElementById('predict').addEventListener('click', () => {
		predict();
	});
}


// when predict button is clicked
async function predict() {
	try {
		if (imageDisplay.src != "") {

			mainImage.style.display = "block";

			const offset = tf.scalar(255.0);
			let tensorImg = tf.browser.fromPixels(imageDisplay)
				.resizeNearestNeighbor([200, 200])
				.toFloat().sub(offset)
				.div(offset)
				.expandDims();
			prediction = await model.predict(tensorImg).data();

			result.style.display = "block";

			var score = Math.round((prediction[0] + Number.EPSILON) * 100);

			var threshold = 0.65;
			if (prediction[0] > threshold) {
				result.getElementsByTagName("p")[0].innerHTML
					= "It's <b>a mountain</b> (or related)!"
					+ " I'm <b>" + String(score) + "%</b> sure!";
			} else if (prediction[0] < 1 - threshold) {
				result.getElementsByTagName("p")[0].innerHTML
					= "It's <b>a beach</b> (or related)!"
					+ " I'm <b>" + String(100 - score) + "%</b> sure if your image really has a beach/mountain!";
			} else {
				var notSure = ((prediction[0] > 0.5) ? "mountain" : "beach");
				var notSureScore = ((prediction[0] > 0.5) ? score : 100 - score);
				result.getElementsByTagName("p")[0].innerHTML
					= "I'm not so confident what it is!"
					+ " There may be some errors with your image or the image you indicated is not clearly a mountain or a beach."
					+ " Please choose another one."
					+ " If you ask me to guess anyway, it's a <b>" + notSure
					+ "</b> with <b>" + String(notSureScore) + "%</b> confidence!";
			}

		} else {
			result.getElementsByTagName("p")[0].innerHTML
				= "You have to indicate an image to predict!"
		}

	} catch (err) {
		result.getElementsByTagName("p")[0].innerHTML
			= "There are some unexpected errors. Please choose another image!"
	}
}

// loading bar
let seconds = 50;
let bar = 1;
let idloader = setInterval(function () {
	bar++;
	var percent = loader.lastElementChild.firstElementChild;
	percent.setAttribute("aria-valuenow", String(bar));
	percent.style = "width: " + String(bar) + "%;";
}, seconds * 1000 / 100)

// button upload
function changeImage() {
	var uploadedImage = document.getElementById('my-file-selector').files[0];
	imageDisplay.src = URL.createObjectURL(uploadedImage);
	result.style.display = "none";
	mainImage.style.display = "block";
	imgTextPredict.style.display = "none";
}

// list of example images
listImgs.getElementsByClassName("item").forEach(it => {
	it.addEventListener("click", function () {
		imageDisplay.src = it.firstElementChild.src;
		result.style.display = "none";
		mainImage.style.display = "block";
		imgTextPredict.style.display = "none";
	});
});

initialize();