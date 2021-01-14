# Documentation: mountain vs beach classifier

## Overview

- An interview test of [**Ideta company**](http://ideta.io/).
- Performed by [**Anh-Thi DINH**](https://dinhanhthi.com).
- __Date__: 13-Jan-2021.
- **2 Classes**: "moutain" (and its related: mainland, forest, moutain path,...) and "beach" (and its related: sea, ocean, beach house,...)
- **Dataset**: extracted (~369MB) from [MIT's places dataset](http://places.csail.mit.edu/). It contains ~15K images for each category.
- __Method__: using transfer learning and CNN.
- __Deploy__: a web-app at [mountain-beach.dinhanhthi.com](http://mountain-beach.dinhanhthi.com/) using TensorFlow.js.
- __Jupyter notebook__: [view in HTML format](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/interview-mountain-vs-beach/blob/main/notebook/mountain_beach_tf_course_catdog_moreImages.html).
- __Result__: 94.29% accuracy.

## Methodology

1. __Overview the task__: Number of steps? Possible approaches? Available frameworks and tools? Data?
2. __Find and get dataset__: extracted (~369MB) from [MIT's places dataset](http://places.csail.mit.edu/) (26GB). It contains ~15K images for each category. __Remark__: There are categoris `beach` and `mountain` in the original dataset but there are only ~5K images for each. That's why I use also other "related classes" to get more data, i.e.
    - "beach realated" = "beach" + "beach_house" + "ocean".
    - "mountain related" = "mountain" + "mountain_path" + "mountain_snowy".
3. Choose appropriate methods & tools:
    1. __Framework__: [TensorFlow](https://www.tensorflow.org/)
    2. __Final model__: use __transfer learning__ from a pretrained [InceptionV3 model](https://www.tensorflow.org/api_docs/python/tf/keras/applications/InceptionV3) with "imagenet" weights + a few more layers.

		``` bash
		# WARNING: check the notebook for full parameters

		# Pretrained InceptionV3
		# up to layer "mixed7" ((None, 10, 10, 768))
		# We don't train these layers, just use the last output.
		pre_trained_model = InceptionV3(weights = "imagenet")
		last_output = pre_trained_model.get_layer('mixed7').output

		# Add more layers
		x = layers.Flatten()(last_output)
		x = layers.Dense(512, activation='relu')(x)
		x = layers.Dropout(0.35)(x) # prevent "overfitting"
		x = layers.Dense  (1, activation='sigmoid')(x)

		# Model
		model = Model(pre_trained_model.input, x)
		model.compile(
            optimizer = RMSprop(lr=1e-5),
            loss = 'binary_crossentropy',
            metrics = ['accuracy'])

		# Train with epochs=100, batch_size=50
		```
    3. __Machine__: try both [Google Colab](https://colab.research.google.com/) and personal laptop (Dell XPS 15 7950 with 32GB RAM, 4GB GPU and Intel® Core™ i7-9750H CPU @ 2.60GHz × 12).
    4. __Final score__: 94.29% accuracy.
4. __Already tried approaches__:
    1. Use directly data: the "right" images of _beach_ and _mountain_. However, there are not many data (5K for each category). Only 90% accuracy or underfitting/overfitting sometimes. That's why I use "other related" images (15K for each category).
    2. Smaller input size (`150x150`, for quicker training): smaller accuracy.
    3. Using VGG16 [places365 pretrained weights](http://gkalliatakis.com/accomplishments/keras_vgg16_places/) (instead of InceptionV3 + "imagenet"): only 88% accuracy.
    4. Using smaller dropout (`0.2` instead of `0.35`): smaller accuracy.
    5. Using bigger input size (`224x224`), smaller learning rate or bigger `batch_size`: not enough GPU memory or time to train the model.
5. __Deployment__:
    1. **Result**: [mountain-beach.dinhanhthi.com](http://mountain-beach.dinhanhthi.com/).
    1. __Chosen approach__ (serverless): using [TensorFlow.js](https://www.tensorflow.org/js) to load weights + trained model from `.json` and `.bin` files + static site + hosted on [Netlify](http://netlify.com/) (free).
        - **Weakness**: trained model is big (193MB), it takes too much time for users to load the site.
        - **Solution**: Using quantization technique in [tfjs-converter](https://github.com/tensorflow/tfjs/tree/master/tfjs-converter) to reduce the model from 193MB to 48MB (it's also big but better).
            - _Quantization technique_: compress our model parameters from Float32s (4 bytes) to Uint8s (single bytes) by mapping each tensors’ value from the range [min value, max value] represented by 255⁴ bits to [0, 255] represented by 255 bits.
            - This converter will convert a saved model (exported by TensorFlow Core) to a format of TensorFlow.js. The converted format contains splitted 4MB `.bin` files - that way they can be cached by browsers. That's why **the users have to wait only once when load the page at the first time**, other times, it's quick!
            - _Weakness_: we lose accuracy (may be not much, may be much).
    2. **Other options** (server side):
        1. Trained model + [Flask](https://flask.palletsprojects.com/en/1.1.x/) + [Heroku](https://www.heroku.com/).
        2. Trained model + [Fask](https://flask.palletsprojects.com/en/1.1.x/) + [Firebase](https://firebase.google.com/).
        3. Trained model + [Streamlit](https://www.streamlit.io/) + [Heroku](https://www.heroku.com/).
        4. I didn't choose them because I've tested some other projects which are built based on these techniques. They're not faster much than the serverless approach but they consume more time to construct.
    3. **Frontend**: [Bootstrap](https://blog.getbootstrap.com/) + HTML + CSS + Vanilla JS.
        1. 3 ways to input an image:
           1. Upload from local (**recommended**).
           2. Choose example images right on the page.
           3. ~~Paste from URL of image (must follow a good format, otherwise, it will not work!). Acceptable URLs are `.jpeg`, `.png`, `.jpg` or `base64` urls.~~
        2. **Technical problem with URL option**: TFJS's `fromPixels()` method is causing a [CORS error](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors) (we cannot fetch the image via a intermediate site like our web-app).
        3. **The meaning of results**: because our problem is a binary classification. I use `sigmoid` to get the probability of the `score`. This `score` is between `0` (beach) and `1` (mountain).
           1. It's a mountain if `score > 0.65` and we output `score*100`%.
           2. It's a beach if `score < 0.35` and we output `(1-score)*100`%.
           3. **Not sure result**: `score` between `[0.35, 0.65]`. It may come from your input image (not good format, cannot fetch URL, there are both beach and mountain in the image, there aren't either mountain or beach in the image,...).
