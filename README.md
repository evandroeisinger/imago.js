## imago.js [![Build Status](https://travis-ci.org/evandroeisinger/imago.js.svg?branch=master)](https://travis-ci.org/evandroeisinger/imago.js) [![npm version](https://badge.fury.io/js/imago-js.svg)](http://badge.fury.io/js/imago-js) [![Bower version](https://badge.fury.io/bo/imago.js.svg)](http://badge.fury.io/bo/imago.js)

> It's a wonderful image library! With the purpose to facilitate the manipulation of images, imago.js enables you to perform trimming and resizing.

### install
Available on npm and bower:
`npm install imago-js`, `bower install imago.js` or [directly download](https://github.com/evandroeisinger/imago.js/raw/master/src/editore.js)

### basic usage
```javascript
// create a new imago instance
var imago = new Imago(document.getElementsByTagName('image')[0]);

// to start a edition
imago.edit();

// to save edited image
imago.save();

// to cancel current edition
imago.cancel();

// to reset image edition
imago.reset();
```
if the image element already has editing attributes and/or editing elements it will be rendered according to them.

```html
<!-- image with editing attributes -->
<img src="example.jpg" data-original-width="640" data-original-height="424" data-width="640" data-height="424" data-top="0" data-left="0">

<!-- image with initial editing elements -->
<figure>
  <img src="example.jpg" data-original-width="640" data-original-height="424" data-width="640" data-height="424" data-top="0" data-left="0">
</figure>

<!-- image with all editing elements -->
<figure>
  <img src="example.jpg" data-original-width="640" data-original-height="424" data-width="640" data-height="424" data-top="0" data-left="0">
  <div class="crop__mask"></div>
  <div class="crop__wrapper">
    <img src="example.jpg">
  </div>
  <div class="crop__handlers">
    <div class="crop__move-handler"></div>
    <span class="crop__top-left-handler"></span>
    <span class="crop__bottom-right-handler"></span>
  </div>
</figure>
```
---
### constructor
```javascript
new Imago(imageElement);
```

### parameters
  - **imageElement**: image element used by the imago constructor. 

### editing attributes
- **data-original-width**;
- **data-original-height**;
- **data-width**;
- **data-height**;
- **data-top**;
- **data-left**;

### editing elements
```
figure
├  image
├  .crop__mask
├  .crop__wrapper
├  └  .crop__shadow
└  .crop__handler
   ├  .crop__move-handler
   ├  .crop__top-left-handler
   └  .crop__bottom-right-handler
```

### methods
- imago.**edit()**;
- imago.**save()**;
- imago.**cancel()**;
- imago.**reset()**;

### support
- chrome: **latest**;
- firefox: **latest**;
- safari: **latest**;
- internet explore: **9+**;

---
### contribute
Everyone can contribute! Finding bugs, creating issues, improving documentation, improving editor it self or creating components.
Every contribution will be welcomed! :santa: 

**Fork it** -> **Branch it** -> **Test it** -> **Push it** -> **Pull Request it** :gem:
