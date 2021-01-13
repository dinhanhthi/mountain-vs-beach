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

## TL;DR (In short)

1. Overview the task.
2. Find and get dataset.
3. Choose appropriate methods & tools:
   1. [TensorFlow](https://www.tensorflow.org/)
   2. A good model for this kind of problem. I choose __transfer learning__ from a pretrained [InceptionV3 model](https://www.tensorflow.org/api_docs/python/tf/keras/applications/InceptionV3) with "imagenet" weights.
   3.