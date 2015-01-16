## [imago.js](evandroeisinger.github.io/imago.js/example)

> It's a wonderful image library! With the purpose to facilitate the manipulation of images, imago.js enables you to perform trimming and resizing.

### Usage
First you need to load the library dependencies. (yup, it's agnostic!)

```html
<link rel="stylesheet" type="text/css" href="imago.css">
<link rel="stylesheet" type="text/css" href="imagoCrop.css">
```
```html
<script type="text/javascript" src="imagoCrop.js"></script>
<script type="text/javascript" src="imago.js"></script>
```
Now you can use it!
```html
<img src="http://farm6.staticflickr.com/5539/11186937945_4d288cc8fa_o_d.jpg" alt="Davide Gabino">
<img src="http://farm9.staticflickr.com/8246/8662153499_08938cb34d_b_d.jpg" alt="Davide Gabino">
```
```javascript
var images = document.getElementsByTagName('img'),
    imagos = [];
    
for (var i = 0; i < images.length; i++)
    imagos.push(new Imago(images[i]));
```
If you want to load a already edited image, just apply imago.js again!
```html
<figure class="figure" data-orig-width="640" data-orig-height="427" data-width="985" data-height="657" data-top="0" data-left="0">
  <img id="image"src="http://farm9.staticflickr.com/8246/8662153499_08938cb34d_b_d.jpg" alt="Davide Gabino" class="figure__image">
</figure>
```
```javascript
var editedImage = new Imago(document.getElementsById('image')),
```
