!function(window, document) {
  function Crop(editor) {
    var self = this;

    self.crop     = {};
    self.tmp      = {};
    self.editor   = editor;
    self.figure   = editor.elements.figure;
    self.image    = editor.elements.image;
    self.actions  = self.editor.elements.actions;

    self.shadowImage        = self.image.cloneNode();
    self.cropButton         = document.createElement('button');
    self.cropMask           = document.createElement('div');
    self.cropWrapper        = document.createElement('div');
    self.cropActions        = document.createElement('div');
    self.saveCropButton     = document.createElement('button');
    self.cancelCropButton   = document.createElement('button');
    self.cropHandlers       = document.createElement('div');
    self.moveHandler        = document.createElement('div');
    self.topLeftHandler     = document.createElement('span');
    self.bottomRightHandler = document.createElement('span');

    self.cropButton.innerText       = 'Crop';
    self.saveCropButton.innerText   = 'Save';
    self.cancelCropButton.innerText = 'Cancel';
    
    this.applyCrop = function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      self
        .insertHandlers()
        .insertMask()
        .insertActions()
        .insertWrapper()
        .applyDimensions()
        .applyPositions();

      self.figure.className.replace(' figure--modified', '');
      self.figure.className += ' figure--cropping';

      self.saveCropButton.addEventListener('click', self.saveCrop);
      self.cancelCropButton.addEventListener('click', self.cancelCrop);
      self.moveHandler.addEventListener('mousedown', self.applyDrag);
      self.topLeftHandler.addEventListener('mousedown', self.applyResize);
      self.bottomRightHandler.addEventListener('mousedown', self.applyResize);
    }

    this.saveCrop = function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (self.figure.className.indexOf('figure--modified') < 0)
        self.figure.className += ' figure--modified';

      self
        .applyDataAttributes()
        .removeElements();
    }

    this.cancelCrop = function(e) {
      e.preventDefault();
      e.stopPropagation();

      self
        .restoreCropping()
        .removeElements();
    }

    this.applyResize = function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (e.which !== 1)
        return;

      self.tmp.currentHandler = e.target.className;
      self.tmp.width = self.image.clientWidth
      self.tmp.height = self.image.clientHeight
      self.tmp.top = 0;
      self.tmp.left = 0;
      self.tmp.figureWidth = self.figure.clientWidth
      self.tmp.figureHeight = self.figure.clientHeight
      self.tmp.figureTop = 0;
      self.tmp.figureLeft = 0;

      do {
        self.tmp.left += self.image.offsetLeft;
        self.tmp.top  += self.image.offsetTop;  
      } while (self.image = self.image.offsetParent);

      do {
        self.tmp.figureLeft += self.figure.offsetLeft;
        self.tmp.figureTop  += self.figure.offsetTop; 
      } while (self.figure = self.figure.offsetParent);

      self.image  = self.editor.elements.image;
      self.figure = self.editor.elements.figure;

      document.addEventListener('mousemove', self.resize);
      document.addEventListener('mouseup', self.stopResize);
    }

    this.resize = function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      self
        .calculateCropping(e)
        .applyPositions()
        .applyDimensions();
    }

    this.stopResize = function(e) {
      e.preventDefault();

      document.removeEventListener('mousemove', self.resize);
      document.removeEventListener('mouseup', self.stopResize);
    }

    this.applyDrag = function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (e.which !== 1)
        return;

      self.tmp.currentHandler = e.target.className;
      self.tmp.width = self.image.clientWidth
      self.tmp.height = self.image.clientHeight
      self.tmp.top = 0;
      self.tmp.left = 0;
      self.tmp.figureWidth = self.figure.clientWidth
      self.tmp.figureHeight = self.figure.clientHeight
      self.tmp.figureTop = 0;
      self.tmp.figureLeft = 0;
      self.tmp.mouseX = e.pageX;
      self.tmp.mouseY = e.pageY; 

      do {
        self.tmp.left += self.image.offsetLeft;
        self.tmp.top  += self.image.offsetTop;  
      } while (self.image = self.image.offsetParent);

      do {
        self.tmp.figureLeft += self.figure.offsetLeft;
        self.tmp.figureTop  += self.figure.offsetTop; 
      } while (self.figure = self.figure.offsetParent);

      self.image  = self.editor.elements.image;
      self.figure = self.editor.elements.figure;

      document.addEventListener('mousemove', self.drag);
      document.addEventListener('mouseup', self.stopDrag);
    }

    this.drag = function(e) {
      e.preventDefault();
      e.stopPropagation();

      self
        .calculateDragging(e)
        .render(self.applyPositions);
    }

    this.stopDrag = function (e) {
      e.preventDefault();
      e.stopPropagation();

      document.removeEventListener('mouseup', self.stopDrag);
      document.removeEventListener('mousemove', self.drag);
    }

    self.cropButton.className         += 'crop';
    self.cropMask.className           += 'crop__mask';
    self.cropWrapper.className        += 'crop__wrapper';
    self.cropActions.className        += 'crop__actions';
    self.saveCropButton.className     += 'crop__actions__save';
    self.cancelCropButton.className   += 'crop__actions__cancel';
    self.cropHandlers.className       += 'crop__handlers';
    self.moveHandler.className        += 'crop__handlers__move';
    self.topLeftHandler.className     += 'crop__handlers__top-left';
    self.bottomRightHandler.className += 'crop__handlers__bottom-right';

    self
      .loadDataAttributes()
      .applyDataAttributes()
      .applyDimensions()
      .applyPositions();

    self.cropButton.addEventListener('click', self.applyCrop);
    self.actions.appendChild(self.cropButton);
  }

  Crop.prototype = {
    render: function(method) {
      var self = this;

      self.tmp.renderId = window.setTimeout(function(){
        window.clearTimeout(self.tmp.renderId);
        method.call(self);
      }, 25);
    },

    insertMask: function() {
      var self = this;

      self.figure.appendChild(self.cropMask);

      return self;
    },

    insertWrapper: function() {
      var self = this;

      self.cropWrapper.appendChild(self.shadowImage);
      self.figure.appendChild(self.cropWrapper);

      return self;
    },

    insertActions: function() {
      var self = this;

      self.cropActions.appendChild(self.saveCropButton);
      self.cropActions.appendChild(self.cancelCropButton);
      self.figure.appendChild(self.cropActions);

      return self;
    },

    insertHandlers: function() {
      var self = this;

      self.cropHandlers.appendChild(self.moveHandler);
      self.cropHandlers.appendChild(self.topLeftHandler);
      self.cropHandlers.appendChild(self.bottomRightHandler);
      self.figure.appendChild(self.cropHandlers);

      return self;
    },

    loadDataAttributes: function() {
      var self            = this,
          originalWidth   = self.image.getAttribute('data-orig-width'),
          originalHeight  = self.image.getAttribute('data-orig-height'),
          width           = self.image.getAttribute('data-width'),
          height          = self.image.getAttribute('data-height') ,
          top             = self.image.getAttribute('data-top'),
          left            = self.image.getAttribute('data-left');

      if (originalWidth && originalHeight && width && height && top && left)
        self.figure.className += ' figure--modified';

      self.crop.originalWidth  = originalWidth  || self.image.clientWidth;
      self.crop.originalHeight = originalHeight || self.image.clientHeight;
      self.crop.width          = width          || self.image.clientWidth;
      self.crop.height         = height         || self.image.clientHeight;
      self.crop.top            = top            || 0;
      self.crop.left           = left           || 0;

      return self;
    },

    applyDataAttributes: function() {
      var self = this;

      self.figure.setAttribute('data-orig-width', self.crop.originalWidth);
      self.figure.setAttribute('data-orig-height', self.crop.originalHeight);
      self.figure.setAttribute('data-width', self.crop.width);
      self.figure.setAttribute('data-height', self.crop.height);
      self.figure.setAttribute('data-top', self.crop.top);
      self.figure.setAttribute('data-left', self.crop.left);

      return self;
    },

    applyDimensions: function() {
      var self        = this;

      self.figure.style.width       = [self.crop.originalWidth ,'px'].join('');
      self.image.style.width        = [self.crop.width ,'px'].join('');
      self.shadowImage.style.width  = [self.crop.width ,'px'].join('');
      self.cropMask.style.width     = [self.crop.width ,'px'].join('');
      self.cropHandlers.style.width = [self.crop.width ,'px'].join('');

      self.figure.style.height       = [self.crop.originalHeight ,'px'].join('');
      self.image.style.height        = [self.crop.height ,'px'].join('');
      self.shadowImage.style.height  = [self.crop.height ,'px'].join('');
      self.cropMask.style.height     = [self.crop.height ,'px'].join('');
      self.cropHandlers.style.height = [self.crop.height ,'px'].join('');

      return self;
    },

    applyPositions: function() {
      var self = this;

      self.image.style.top        = [self.crop.top, 'px'].join('');
      self.shadowImage.style.top  = [self.crop.top, 'px'].join('');
      self.cropMask.style.top     = [self.crop.top, 'px'].join('');
      self.cropHandlers.style.top = [self.crop.top, 'px'].join('');

      self.image.style.left         = [self.crop.left, 'px'].join('');
      self.shadowImage.style.left   = [self.crop.left, 'px'].join('');
      self.cropMask.style.left      = [self.crop.left, 'px'].join('');
      self.cropHandlers.style.left  = [self.crop.left, 'px'].join('');

      return self;
    },

    calculateCropping: function(e) {
      var self = this,
          mouseX = e.pageX,
          mouseY = e.pageY,
          minBottom,
          minRight,
          width,
          height,
          left,
          top;

      switch(self.tmp.currentHandler) {
        case 'crop__handlers__top-left':
          width = self.tmp.width - (mouseX - self.tmp.left);
          left  = mouseX;
          top   = mouseY - ((width / self.crop.originalWidth * self.crop.originalHeight) - (self.tmp.height - (mouseY - self.tmp.top)));
          break;

        case 'crop__handlers__bottom-right':
          width = mouseX - self.tmp.left;
          left  = self.tmp.left;
          top   = self.tmp.top;
          break;
      }
      
      height  = (width / self.crop.originalWidth) * self.crop.originalHeight;
      right   = (self.tmp.figureLeft + self.tmp.figureWidth) - (left + width);
      bottom  = (self.tmp.figureTop + self.tmp.figureHeight) - (top + height);
      top     = top - self.tmp.figureTop;
      left    = left - self.tmp.figureLeft;
      
      if (width < self.crop.originalWidth)
        width = self.crop.originalWidth;
      if (height < self.crop.originalHeight)
        height = self.crop.originalHeight;
      if (top > 0)
        top = 0;
      if (left > 0)
        left = 0;
      if (bottom > 0)
        height = (top * -1) + self.tmp.figureHeight;
      if (right > 0)
        width = (left * -1) + + self.tmp.figureWidth;

      self.crop.top       = Math.round(top);
      self.crop.left      = Math.round(left);
      self.crop.width     = Math.round(width);
      self.crop.height    = Math.round(height);
      self.crop.right     = Math.round(right);
      self.crop.bottom    = Math.round(bottom);

      return self;
    },

    calculateDragging: function(e) {
      var self    = this,
          mouseX  = e.pageX,
          mouseY  = e.pageY,
          left    = (mouseX - self.tmp.figureLeft) - (self.tmp.mouseX - self.tmp.left),
          top     = (mouseY - self.tmp.figureTop) - (self.tmp.mouseY - self.tmp.top) ,
          diffLeft  = ((self.tmp.figureLeft - (left * -1)) + self.tmp.width) - (self.tmp.figureLeft + self.tmp.figureWidth),
          diffTop   = ((self.tmp.figureTop - (top * -1)) + self.tmp.height) - (self.tmp.figureTop + self.tmp.figureHeight);

      if (left > 0)
        left = 0;
      if (top > 0)
        top = 0;
      if (diffLeft < 0)
        left = (self.tmp.width - self.tmp.figureWidth) * -1;
      if (diffTop < 0)
        top = (self.tmp.height - self.tmp.figureHeight) * -1;

      self.crop.top  = Math.round(top);
      self.crop.left = Math.round(left);

      return self;
    },

    restoreCropping: function() {
      var self    = this,
          width   = [self.figure.getAttribute('data-width'), 'px'].join(''),
          height  = [self.figure.getAttribute('data-height'), 'px'].join(''),
          top     = [self.figure.getAttribute('data-top'), 'px'].join(''),
          left    = [self.figure.getAttribute('data-left'), 'px'].join('');
      
      console.log(width, height, top, left)

      self.image.style.width        = width;
      self.shadowImage.style.width  = width;
      self.cropMask.style.width     = width;
      self.cropHandlers.style.width = width;

      self.image.style.height        = height;
      self.shadowImage.style.height  = height;
      self.cropMask.style.height     = height;
      self.cropHandlers.style.height = height;
      
      self.image.style.top        = top;
      self.shadowImage.style.top  = top;
      self.cropMask.style.top     = top;
      self.cropHandlers.style.top = top;
      
      self.image.style.left        = left;
      self.shadowImage.style.left  = left;
      self.cropMask.style.left     = left;
      self.cropHandlers.style.left = left;

      return self;
    },

    removeElements: function() {
      var self = this;

      self.figure.className = self.figure.className.replace(' figure--cropping','');
      self.figure.removeChild(self.cropMask);
      self.cropWrapper.removeChild(self.shadowImage);
      self.figure.removeChild(self.cropWrapper);
      self.cropActions.removeChild(self.saveCropButton);
      self.cropActions.removeChild(self.cancelCropButton);
      self.figure.removeChild(self.cropActions);
      self.cropHandlers.removeChild(self.topLeftHandler);
      self.cropHandlers.removeChild(self.bottomRightHandler);
      self.figure.removeChild(self.cropHandlers);

      self.saveCropButton.removeEventListener('click', self.saveCrop);
      self.cancelCropButton.removeEventListener('click', self.cancelCrop);
      self.moveHandler.removeEventListener('mousedown', self.applyDrag);
      self.topLeftHandler.removeEventListener('mousedown', self.applyResize);
      self.bottomRightHandler.removeEventListener('mousedown', self.applyResize);

      return self;
    }
  }

  if (window.imagoPlugins)
    return window.imagoPlugins.Crop = Crop;

  window.imagoPlugins = {
    crop: Crop
  };
}(window, document);
