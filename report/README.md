# Report: mountain vs beach classifier

## Overview

- An interview test of [**Ideta company**](http://ideta.io/).
- Performed by [**Anh-Thi DINH**](https://dinhanhthi.com).
- __Date__: 13-Jan-2021.
- **2 Classes**: "moutain" (and its related: mainland, forest, moutain path,...) and "beach" (and its related: sea, ocean, beach house,...)
- **Dataset**: extracted (~369MB) from [MIT's places dataset](http://places.csail.mit.edu/). It contains ~15K images for each category.
- __Method__: using transfer learning and CNN.
- __Deploy__: a web-app at [mountain-beach.dinhanhthi.com](http://mountain-beach.dinhanhthi.com/) using TenforFlow.js.
- __Result__: 94.29% accuracy.

## Methodology

1. __Overview the task__: Number of steps? Possible approaches? Available frameworks and tools? Data?
2. __Find and get dataset__: use an extracted version of [MIT's places dataset](http://places.csail.mit.edu/) with 15K images for each category.
3. Choose appropriate methods & tools:
    1. __Framework__: [TensorFlow](https://www.tensorflow.org/)
    2. __Final model__: use __transfer learning__ from a pretrained [InceptionV3 model](https://www.tensorflow.org/api_docs/python/tf/keras/applications/InceptionV3) with "imagenet" weights + a few more layers.

		``` bash
		# WARNING: check the notebook for full parameters
		# Pretrained InceptionV3
		# up to layer "mixed7" ((None, 10, 10, 768))
		pre_trained_model = InceptionV3(weights = "imagenet")
		last_output = pre_trained_model.get_layer('mixed7').output

		# Add more layers
		x = layers.Flatten()(last_output)
		x = layers.Dense(512, activation='relu')(x)
		x = layers.Dropout(0.35)(x) # prevent "overfitting"
		x = layers.Dense  (1, activation='sigmoid')(x)

		# Model
		model = Model(pre_trained_model.input, x)
		model.compile(optimizer = RMSprop(lr=1e-5),
              		  loss = 'binary_crossentropy',
                      metrics = ['accuracy'])

		# Train with epochs=100, batch_size=50
		```
    3. __Machine__: try both [Google Colab](https://colab.research.google.com/) and personal laptop (Dell XPS 15 7950 with 32GB RAM, 4GB GPU and Intel® Core™ i7-9750H CPU @ 2.60GHz × 12).
4. __Already tried approaches__:
   1. Use directly data: the "right" images of _beach_ and _mountain_. However, there are not many data (5K for each). Only 90% accuracy or underfitting/overfitting sometimes. That's why I use "other related