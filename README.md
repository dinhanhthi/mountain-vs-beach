# Mountain ⛰️ vs Beach 🏖️ Classifier

<p align="center">
  <img src="./img/favicon.png" width="120px" height="120px"/>
</p>

## Overview

- An interview test of [**Ideta company**](http://ideta.io/).
- Performed by [**Anh-Thi DINH**](https://dinhanhthi.com).
- __Date__: 13-Jan-2021.
- **2 Classes**: "moutain" (and its related: mainland, forest, moutain path,...) and "beach" (and its related: sea, ocean, beach house,...)
- **Dataset**: extracted (~369MB) from [MIT's places dataset](http://places.csail.mit.edu/). It contains ~15K images for each category.
- __Method__: using transfer learning and CNN.
- __Deploy__: a web-app at [mountain-beach.dinhanhthi.com](http://mountain-beach.dinhanhthi.com/) using TenforFlow.js.
- __Jupyter notebook__: [view in HTML format](https://dinhanhthi.github.io/tools/github-html?https://github.com/dinhanhthi/interview-mountain-vs-beach/blob/main/notebook/mountain_beach_tf_course_catdog_moreImages.html).
- __Result__: 94.29% accuracy.

## Dev locally

``` bash
# Serve locally (if you use python)
python3 -m http.server 9999
# Browse: http://0.0.0.0:9999/
```

``` bash
# Serve locally (if you use nodejs)
npm install # install http-server
http-server --port 9999
# Browse: http://127.0.0.1:9999/
```

``` bash
# For converting css/custom.scss to css/custom.css
npm run css-watch
```