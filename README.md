## imago.js [![Build Status](https://travis-ci.org/evandroeisinger/imago.js.svg?branch=master)](https://travis-ci.org/evandroeisinger/imago.js)

> It's a wonderful image library! With the purpose to facilitate the manipulation of images, imago.js enables you to perform trimming and resizing.

#### install
Available on npm and bower:
`npm install imago`, `bower install imago` or [directly download](https://github.com/evandroeisinger/imago.js/raw/master/src/editore.js)

#### basic usage
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

---
### constructor
if the image element already has editing attributes and/or editing elements it will be rendered according to them.
```javascript
new Imago(imageElement);
```
##### parameters
  - **imageElement**: element where imago will initialize.
  
##### editing attributes
  - **data-original-width**;
  - **data-original-height**;
  - **data-width**;
  - **data-height**;
  - **data-top**;
  - **data-left**;

##### editing elements
  - **figure**:
    - **image**;
    - *.crop__mask*;
    - *.crop__wrapper*:
      - .crop__shadow;
    - *.crop__handlers*:
      - .crop__move-handler;
      - .crop__top-left-handler;
      - .crop__bottom-right-handler;

##### methods
  - **imago.edit()**;
  - **imago.save()**;
  - **imago.cancel()**;
  - **imago.reset()**;

---
### support
- chrome: latest;
- firefox: latest;
- safari: latest;
- internet explore: 9+;

---
### contribute
Everyone can contribute! Finding bugs, creating issues, improving documentation, improving editor it self or creating components.
Every contribution will be welcomed! :santa: 

**Fork it** -> **Branch it** -> **Test it** -> **Push it** -> **Pull Request it** :gem:
