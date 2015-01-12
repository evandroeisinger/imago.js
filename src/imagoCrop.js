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
    self.topLeftHandler     = document.createElement('span');
    self.bottomRightHandler = document.createElement('span');

    self.cropButton.innerText       = 'Crop';
    self.saveCropButton.innerText   = 'Save';
    self.cancelCropButton.innerText = 'Cancel';
    
    self.cropButton.className         += 'crop';
    self.cropMask.className           += 'crop__mask';
    self.cropWrapper.className        += 'crop__wrapper';
    self.cropActions.className        += 'crop__actions';
    self.saveCropButton.className     += 'crop__actions__save';
    self.cancelCropButton.className   += 'crop__actions__cancel';
    self.cropHandlers.className       += 'crop__handlers';
    self.topLeftHandler.className     += 'crop__handlers__top-left';
    self.bottomRightHandler.className += 'crop__handlers__bottom-right';

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

    this.stopResize = function(e) {
      e.preventDefault();
      document.removeEventListener('mousemove', self.resize);
      document.removeEventListener('mouseup', self.stopResize);
    }

    this.resize = function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      self
        .generateDimensions(e)
        .applyDimensions();
    },

    this.save = function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (self.figure.className.indexOf('figure--modified') < 0)
        self.figure.className += ' figure--modified';

      self.figure.setAttribute('data-orig-width', self.crop.originalWidth);
      self.figure.setAttribute('data-orig-height', self.crop.originalHeight);
      self.figure.setAttribute('data-width', self.crop.width);
      self.figure.setAttribute('data-height', self.crop.height);
      self.figure.setAttribute('data-top', self.crop.top);
      self.figure.setAttribute('data-left', self.crop.left);
      self.removeElements();
    }

    this.cancel = function(e) {
      e.preventDefault();
      e.stopPropagation();

      self
        .restoreDimensions()
        .removeElements();
    }

    this.apply = function() {
      self
        .getDimensions()
        .insertHandlers()
        .insertMask()
        .insertActions()
        .insertWrapper()
        .applyDimensions();

      self.figure.className.replace(' figure--modified', '');
      self.figure.className += ' figure--cropping';

      self.figure.setAttribute('style',[
        'width:', self.crop.originalWidth, 'px;', 
        'height:', self.crop.originalHeight, 'px;'
      ].join(''));

      self.saveCropButton.addEventListener('click', self.save);
      self.cancelCropButton.addEventListener('click', self.cancel);
      self.topLeftHandler.addEventListener('mousedown', self.applyResize);
      self.bottomRightHandler.addEventListener('mousedown', self.applyResize);
    }

    self.cropButton.addEventListener('click', self.apply);
    self.actions.appendChild(self.cropButton);
  }

  Crop.prototype = {
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

      self.cropHandlers.appendChild(self.topLeftHandler);
      self.cropHandlers.appendChild(self.bottomRightHandler);
      self.figure.appendChild(self.cropHandlers);

      return self;
    },

    getDimensions: function(old) {
      var self = this;

      self.crop.originalWidth  = self.figure.getAttribute('data-orig-width') || self.image.clientWidth;
      self.crop.originalHeight = self.figure.getAttribute('data-orig-height') || self.image.clientHeight;
      self.crop.width          = self.figure.getAttribute('data-width') || self.image.clientWidth;
      self.crop.height         = self.figure.getAttribute('data-height') || self.image.clientHeight;
      self.crop.top            = self.figure.getAttribute('data-top') || 0;
      self.crop.left           = self.figure.getAttribute('data-left') || 0;

      return self;
    },

    restoreDimensions: function() {
      var self        = this,
          dimensions  = [];
          
      dimensions.push(
        'width:', self.figure.getAttribute('data-width'), 'px;',
        'height:', self.figure.getAttribute('data-height'), 'px;',
        'top:', self.figure.getAttribute('data-top'), 'px;',
        'left:', self.figure.getAttribute('data-left'), 'px;');

      dimensions = dimensions.join('');

      self.image.setAttribute('style', dimensions);
      self.shadowImage.setAttribute('style', dimensions);
      self.cropMask.setAttribute('style', dimensions);
      self.cropHandlers.setAttribute('style', dimensions);

      return self;
    },

    applyDimensions: function() {
      var self        = this,
          dimensions  = [];

      if (self.crop.width)
        dimensions.push('width:', self.crop.width, 'px;');
      if (self.crop.height)
        dimensions.push('height:', self.crop.height, 'px;');
      if (self.crop.top)
        dimensions.push('top:', self.crop.top, 'px;');
      if (self.crop.left)
        dimensions.push('left:', self.crop.left, 'px;');

      dimensions = dimensions.join('');

      self.image.setAttribute('style', dimensions);
      self.shadowImage.setAttribute('style', dimensions);
      self.cropMask.setAttribute('style', dimensions);
      self.cropHandlers.setAttribute('style', dimensions);

      return self;
    },

    generateDimensions: function(e) {
      var self = this,
          mouseX = e.clientX || e.pageX,
          mouseY = e.clientY || e.pageY,
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

      self.saveCropButton.removeEventListener('click', self.save);
      self.cancelCropButton.removeEventListener('click', self.cancel);
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
