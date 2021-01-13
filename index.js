var model = undefined;
const classifierElement = document.getElementById('classifier');
const loader = document.getElementById("loader");
const result = document.getElementById("result");
const listImgs = document.getElementById("list-imgs");
const mainImage = document.getElementById("main-img");
const imageDisplay = mainImage.firstElementChild;
const inputURL = document.getElementById("img-url");

// init
async function initialize() {
    // model = await tf.loadGraphModel('saved_model/not-quantized/model.json');
    model = await tf.loadGraphModel('saved_model/quantized/model.json');
		classifierElement.style.display = 'block';
		listImgs.style.display = "flex";
		if (bar<99){
			bar = 100;
			clearInterval(idloader);
			loader.style.display = "none";
		}
    document.getElementById('predict').addEventListener('click', () => predict());
}

// when predict button is clicked
async function predict () {
	try {

		if (inputURL.value != ""){
			changeImageByUrl();
		}

		if (imageDisplay.src != ""){
			const offset = tf.scalar(255.0);
			let tensorImg = tf.browser
												.fromPixels(imageDisplay)
												.resizeNearestNeighbor([200, 200])
												.toFloat().sub(offset)
												.div(offset)
												.expandDims();
			prediction = await model.predict(tensorImg).data();

			console.log(prediction)
			console.log(prediction[0]);

			result.style.display = "block";

			var score = Math.round((prediction[0] + Number.EPSILON) * 100);

			if (prediction[0] > 0.65) {
				result.getElementsByTagName("p")[0].innerHTML
					= "It's <b>a mountain</b> (or related)!"
					+ " I'm <b>" + String(score) + "</b>% sure!";
			} else if(prediction[0] < 0.35) {
				result.getElementsByTagName("p")[0].innerHTML
					= "It's <b>a beach</b> (or related)!"
						+ " I'm <b>" + String(100-score) + "%</b> sure!";
			} else{
				var notSure = ((prediction[0]>0.5) ? "mountain" : "beach");
				var notSureScore = ((prediction[0]>0.5) ? score : 100-score);
				result.getElementsByTagName("p")[0].innerHTML
					= "I'm not so confident what it is!"
						+ " There may be some errors with your image or the image you indicated is not clearly a mountain or a beach."
						+ " Please choose another one."
						+ " If you ask me to guess anyway, it's a <b>" + notSure
						+ "</b> with <b>" + String(notSureScore) + "</b>% confidence!";
			}
		} else {
			result.getElementsByTagName("p")[0].innerHTML
				= "You have to indicate an image to predict!"
		}
	} catch (err) {
		result.getElementsByTagName("p")[0].innerHTML
			= "There are some unexpected errors.Please choose another image!"
	}
}

// % sure?
function countPercentage(score){

}

// loading bar
let seconds = 60;
let bar = 0;
let idloader = setInterval(function(){
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
}

function changeImageByUrl() {
	var imgUrl = inputURL.value;
	if (checkURL(imgUrl)) {
		imageDisplay.src = imgUrl;
		result.style.display = "none";
		mainImage.style.display = "block";
	}
}

function checkURL(url) {
	return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

// list of example images
listImgs.getElementsByClassName("item").forEach(it => {
	it.addEventListener("click", function(){
		imageDisplay.src = it.firstElementChild.src;
		result.style.display = "none";
		mainImage.style.display = "block";
	});
});

initialize();