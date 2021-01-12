var model = undefined;
const classifierElement = document.getElementById('classifier');
const loaderElement = document.getElementById('loader');

async function initialize() {

    // model = await tf.loadGraphModel('saved_model/not-quantized/model.json');
    model = await tf.loadGraphModel('saved_model/quantized/model.json');
    classifierElement.style.display = 'block';
    loaderElement.style.display = 'none';

    document.getElementById('predict').addEventListener('click', () => predict());

}

async function predict () {

		const imageElement = document.getElementById('img');
		const offset = tf.scalar(255.0);
    let tensorImg = tf.browser.fromPixels(imageElement).resizeNearestNeighbor([200, 200]).toFloat().sub(offset).div(offset).expandDims();
		prediction = await model.predict(tensorImg).data();

		console.log(prediction)
		console.log(prediction[0]);

    if (prediction[0] > 0.5) {
        alert("You uploaded a mountain!");
    } else {
        alert("You uploaded a beach!");
    }
}

function changeImage() {
    var imageDisplay = document.getElementById('img');
    var uploadedImage = document.getElementById('my-file-selector').files[0];
    imageDisplay.src = URL.createObjectURL(uploadedImage);
}

initialize();