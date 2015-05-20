(function (Imago) {
  'use strict';

  if (typeof define === 'function' && define.amd)
    define('imago-js', [], new Imago());
  else if (typeof exports !== 'undefined')
    exports.Imago = new Imago();
  else
    window.Imago = new Imago();
}(function() {
  'use strict';

  function Imago(image) {
    var self = this;

    function initialize() {
      self.tmp = {};
      self.data = self.loadAttributes(image);
      self.tmp.data = self.data;
      self.elements = self.loadElements(image);

      self.elements.moveHandler.addEventListener('mousedown', startDragging);
      self.elements.topLeftHandler.addEventListener('mousedown', startCropping);
      self.elements.topRightHandler.addEventListener('mousedown', startCropping);
      self.elements.bottomLeftHandler.addEventListener('mousedown', startCropping);
      self.elements.bottomRightHandler.addEventListener('mousedown', startCropping);

      self.applyStyles(self.elements);
      self.applyDimensions(self.data, self.elements);
      self.applyPositions(self.data, self.elements);
      self.applyAttributes(self.data, self.elements);
      self.applyElements(self.elements);
    }

    function startDragging(e) {
      e.preventDefault();
      e.stopPropagation();

      if (e.which !== 1)
        return;

      var figurePosition = self.calculatePosition(self.elements.figure),
          imagePosition = self.calculatePosition(self.elements.image);

      self.tmp.image = {
        top: imagePosition.top,
        left: imagePosition.left,
        width: self.elements.image.clientWidth,
        height: self.elements.image.clientHeight,
      };

      self.tmp.figure = {
        top: figurePosition.top,
        left: figurePosition.left,
        width: self.elements.figure.clientWidth,
        height: self.elements.figure.clientHeight,
      };

      self.tmp.mouse = {
        x: e.pageX,
        y: e.pageY,
      };

      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDragging);
    }

    function drag(e) {
      e.preventDefault();

      var draggingData = self.calculateDragging(self.data, self.tmp, {
        x: e.pageX,
        y: e.pageY,
      });

      self.tmp.data.top = draggingData.top;
      self.tmp.data.left = draggingData.left;

      self.applyPositions(self.tmp.data, self.elements);
      self.applyDimensions(self.tmp.data, self.elements);
    }

    function stopDragging(e) {
      e.preventDefault();
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDragging);
    }

    function startCropping(e) {
      e.preventDefault();
      e.stopPropagation();

      if (e.which !== 1)
        return;

      var figurePosition = self.calculatePosition(self.elements.figure),
          imagePosition = self.calculatePosition(self.elements.image);

      self.tmp.handler = e.currentTarget.className;

      self.tmp.image = {
        top: imagePosition.top,
        left: imagePosition.left,
        width: self.elements.image.clientWidth,
        height: self.elements.image.clientHeight,
      };

      self.tmp.figure = {
        top: figurePosition.top,
        left: figurePosition.left,
        width: self.elements.figure.clientWidth,
        height: self.elements.figure.clientHeight,
      };

      document.addEventListener('mousemove', crop);
      document.addEventListener('mouseup', stopCropping);
    }

    function crop(e) {
      e.preventDefault();

      var croppingData = self.calculateCropping(self.data, self.tmp, {
        x: e.pageX,
        y: e.pageY,
      });

      self.tmp.data.width = croppingData.width;
      self.tmp.data.height = croppingData.height;
      self.tmp.data.top = croppingData.top;
      self.tmp.data.left = croppingData.left;

      self.applyPositions(self.tmp.data, self.elements);
      self.applyDimensions(self.tmp.data, self.elements);
    }

    function stopCropping(e) {
      e.preventDefault();
      document.removeEventListener('mousemove', crop);
      document.removeEventListener('mouseup', stopCropping);
    }

    if (!image || !image.tagName || image.tagName.toLowerCase() !== 'img')
      throw new TypeError('Invalid image: ' + image);

    if (!image.complete)
      image.onload = initialize;
    else
      initialize();

    return {
      edit: function() {
        self.tmp.data = {};
        self.showElements(self.elements);
      },

      save: function() {
        self.data.width = self.tmp.data.width || self.data.width;
        self.data.height = self.tmp.data.height || self.data.height;
        self.data.top = self.tmp.data.top || self.data.top;
        self.data.left = self.tmp.data.left || self.data.left;

        self.applyAttributes(self.data, self.elements);
        self.hideElements(self.elements);
      },

      cancel: function() {
        self.applyPositions(self.data, self.elements);
        self.applyDimensions(self.data, self.elements);
        self.applyAttributes(self.data, self.elements);
        self.hideElements(self.elements);
      },

      reset: function() {
        self.data.width = self.data.originalWidth;
        self.data.height = self.data.originalHeight;
        self.data.top = 0;
        self.data.left = 0;

        self.applyPositions(self.data, self.elements);
        self.applyDimensions(self.data, self.elements);
        self.applyAttributes(self.data, self.elements);
        self.hideElements(self.elements);
      }
    };
  }

  Imago.prototype = {
    calculatePosition: function(element) {
      var _top = 0,
          _left = 0;

      do {
        _left += element.offsetLeft;
        _top  += element.offsetTop;
        element = element.offsetParent;
      } while (element.offsetParent);

      return {
        top: _top,
        left: _left
      };
    },

    calculateCropping: function(data, tmp, mouse) {
      var _top = 0,
          _left = 0,
          _right = 0,
          _bottom = 0,
          _width = 0,
          _height = 0;

      switch(tmp.handler) {
        case 'crop__top-left-handler':
          _width = tmp.image.width - (mouse.x - tmp.image.left);
          _left = mouse.x;
          _top = mouse.y - ((_width / data.originalWidth * data.originalHeight) - (tmp.image.height - (mouse.y - tmp.image.top)));
          break;

        case 'crop__top-right-handler':
          _width = mouse.x - tmp.image.left;
          _left = tmp.image.left;
          _top = mouse.y - ((_width / data.originalWidth * data.originalHeight) - (tmp.image.height - (mouse.y - tmp.image.top)));
          break;

        case 'crop__bottom-left-handler':
          _width = tmp.image.width - (mouse.x - tmp.image.left);
          _left = mouse.x;
          _top = tmp.image.top;
          break;

        case 'crop__bottom-right-handler':
          _width = mouse.x - tmp.image.left;
          _left  = tmp.image.left;
          _top   = tmp.image.top;
          break;

      }

      _height = (_width / data.originalWidth) * data.originalHeight;
      _right = (tmp.figure.left + tmp.figure.width) - (_left + _width);
      _bottom = (tmp.figure.top + tmp.figure.height) - (_top + _height);
      _top = _top - tmp.figure.top;
      _left = _left - tmp.figure.left;

      if (_top > 0) {
        _top = 0;
      }

      if (_left > 0) {
        _left = 0;
      }

      if (_bottom > 0) {
        _top = _top - (_bottom * -1);
        _height = (_top * -1) + tmp.figure.height;
      }

      if (_right > 0) {
        _left = _left - (_right * -1);
        _width = (_left * -1) + tmp.figure.width;
      }

      if (_width < data.originalWidth) {
        _left = 0;
        _width = data.originalWidth;
      }

      if (_height < data.originalHeight) {
        _top = 0;
        _height = data.originalHeight;
      }

      return {
        top: Math.round(_top),
        left: Math.round(_left),
        width: Math.round(_width),
        height: Math.round(_height),
        right: Math.round(_right),
        bottom: Math.round(_bottom),
      };
    },

    calculateDragging: function(data, tmp, mouse) {
      var _left = (mouse.x - tmp.figure.left) - (tmp.mouse.x - tmp.image.left),
          _top = (mouse.y - tmp.figure.top) - (tmp.mouse.y - tmp.image.top) ,
          diffLeft = ((tmp.figure.left - (_left * -1)) + tmp.image.width) - (tmp.figure.left + tmp.figure.width),
          diffTop = ((tmp.figure.top - (_top * -1)) + tmp.image.height) - (tmp.figure.top + tmp.figure.height);

      if (_left > 0)
        _left = 0;
      if (_top > 0)
        _top = 0;
      if (diffLeft < 0)
        _left = (tmp.image.width - tmp.figure.width) * -1;
      if (diffTop < 0)
        _top = (tmp.image.height - tmp.figure.height) * -1;

      return {
        top: Math.round(_top),
        left: Math.round(_left),
      };
    },

    showElements: function(elements) {
      elements.figure.style.overflow = 'inherit';

      elements.figure.appendChild(elements.mask);
      elements.figure.appendChild(elements.wrapper);
      elements.figure.appendChild(elements.handlers);
    },

    hideElements: function(elements) {
      elements.figure.style.overflow = 'hidden';

      if (elements.mask.parentElement)
        elements.figure.removeChild(elements.mask);
      if (elements.wrapper.parentElement)
        elements.figure.removeChild(elements.wrapper);
      if (elements.handlers.parentElement)
        elements.figure.removeChild(elements.handlers);
    },

    loadElements: function(image) {
      var _image = image,
          _figure,
          _shadow,
          _mask,
          _wrapper,
          _handlers,
          _moveHandler,
          _topLeftHandler,
          _topRightHandler,
          _bottomLeftHandler,
          _bottomRightHandler;

      if (_image.parentElement && _image.parentElement.nodeName.toLowerCase() == 'figure')
        _figure = _image.parentElement;
      else
        _figure = document.createElement('figure');

      _shadow = _figure.getElementsByClassName('crop__shadow')[0];
      _mask = _figure.getElementsByClassName('crop__mask')[0];
      _wrapper = _figure.getElementsByClassName('crop__wrapper')[0];
      _handlers = _figure.getElementsByClassName('crop__handlers')[0];
      _moveHandler = _figure.getElementsByClassName('crop__move-handler')[0];
      _topLeftHandler = _figure.getElementsByClassName('crop__top-left-handler')[0];
      _topRightHandler = _figure.getElementsByClassName('crop__top-right-handler')[0];
      _bottomLeftHandler = _figure.getElementsByClassName('crop__bottom-left-handler')[0];
      _bottomRightHandler = _figure.getElementsByClassName('crop__bottom-right-handler')[0];

      if (!_mask) {
        _mask = document.createElement('div');
        _mask.className = 'crop__mask';
      }

      if (!_wrapper) {
        _wrapper = document.createElement('div');
        _wrapper.className = 'crop__wrapper';
      }

      if (!_handlers) {
        _handlers = document.createElement('div');
        _handlers.className = 'crop__handlers';
      }

      if (!_moveHandler) {
        _moveHandler = document.createElement('div');
        _moveHandler.className = 'crop__move-handler';
      }

      if (!_topLeftHandler) {
        _topLeftHandler = document.createElement('span');
        _topLeftHandler.className = 'crop__top-left-handler';
      }

      if (!_topRightHandler) {
        _topRightHandler = document.createElement('span');
        _topRightHandler.className = 'crop__top-right-handler';
      }

      if (!_bottomLeftHandler) {
        _bottomLeftHandler = document.createElement('span');
        _bottomLeftHandler.className = 'crop__bottom-left-handler';
      }

      if (!_bottomRightHandler) {
        _bottomRightHandler = document.createElement('span');
        _bottomRightHandler.className = 'crop__bottom-right-handler';
      }

      _shadow = _shadow || _image.cloneNode();
      _shadow.className = 'crop__shadow';
      _shadow.removeAttribute('id');

      _handlers.appendChild(_moveHandler);
      _handlers.appendChild(_topLeftHandler);
      _handlers.appendChild(_topRightHandler);
      _handlers.appendChild(_bottomLeftHandler);
      _handlers.appendChild(_bottomRightHandler);
      _wrapper.appendChild(_shadow);

      return {
        image: _image,
        figure: _figure,
        shadow: _shadow,
        mask: _mask,
        wrapper: _wrapper,
        handlers: _handlers,
        moveHandler: _moveHandler,
        topLeftHandler: _topLeftHandler,
        topRightHandler: _topRightHandler,
        bottomLeftHandler: _bottomLeftHandler,
        bottomRightHandler: _bottomRightHandler
      };
    },

    loadAttributes: function(image) {
      var _originalWidth = image.getAttribute('data-original-width') * 1,
          _originalHeight = image.getAttribute('data-original-height') * 1,
          _width = image.getAttribute('data-width') * 1,
          _height = image.getAttribute('data-height') * 1,
          _top = image.getAttribute('data-top') * 1,
          _left = image.getAttribute('data-left') * 1;

      return {
        originalWidth: _originalWidth || image.clientWidth,
        originalHeight: _originalHeight || image.clientHeight,
        width: _width || image.clientWidth,
        height: _height || image.clientHeight,
        top: _top || 0,
        left: _left || 0,
      };
    },

    applyAttributes: function(data, elements) {
      elements.image.setAttribute('data-original-width', data.originalWidth);
      elements.image.setAttribute('data-original-height', data.originalHeight);
      elements.image.setAttribute('data-width', data.width);
      elements.image.setAttribute('data-height', data.height);
      elements.image.setAttribute('data-top', data.top);
      elements.image.setAttribute('data-left', data.left);
    },

    applyDimensions: function(data, elements) {
      // left
      elements.figure.style.width = data.originalWidth + 'px';
      elements.image.style.width = data.width + 'px';
      elements.shadow.style.width = data.width + 'px';
      elements.mask.style.width = data.width + 'px';
      elements.handlers.style.width = data.width + 'px';
      // height
      elements.figure.style.height = data.originalHeight + 'px';
      elements.image.style.height = data.height + 'px';
      elements.shadow.style.height = data.height + 'px';
      elements.mask.style.height = data.height + 'px';
      elements.handlers.style.height = data.height + 'px';
    },

    applyPositions: function(data, elements) {
      // left
      elements.image.style.top = data.top + 'px';
      elements.shadow.style.top = data.top + 'px';
      elements.mask.style.top = data.top + 'px';
      elements.handlers.style.top = data.top + 'px';
      // right
      elements.image.style.left = data.left + 'px';
      elements.shadow.style.left = data.left + 'px';
      elements.mask.style.left = data.left + 'px';
      elements.handlers.style.left = data.left + 'px';
    },

    applyStyles: function(elements) {
      // figure
      elements.figure.style.overflow = 'hidden';
      elements.figure.style.position = 'relative';
      // image
      elements.image.style.position = 'absolute';
      elements.image.style.zIndex = '0';
      // wrapper
      elements.wrapper.style.position = 'absolute';
      elements.wrapper.style.overflow = 'hidden';
      elements.wrapper.style.top = '0';
      elements.wrapper.style.left = '0';
      elements.wrapper.style.right = '0';
      elements.wrapper.style.bottom = '0';
      elements.wrapper.style.zIndex = '20';
      // shadow
      elements.shadow.style.position = 'absolute';
      // mask
      elements.mask.style.position = 'absolute';
      elements.mask.style.zIndex = '10';
      // handlers
      elements.handlers.style.position = 'absolute';
      elements.handlers.style.zIndex = '30';
      // move handler
      elements.moveHandler.style.position = 'absolute';
      elements.moveHandler.style.top = '0';
      elements.moveHandler.style.left = '0';
      elements.moveHandler.style.right = '0';
      elements.moveHandler.style.bottom = '0';
      // top left handler
      elements.topLeftHandler.style.position = 'absolute';
      elements.topLeftHandler.style.top = '0';
      elements.topLeftHandler.style.left = '0';
      // top right handler
      elements.topRightHandler.style.position = 'absolute';
      elements.topRightHandler.style.top = '0';
      elements.topRightHandler.style.right = '0';
      // bottom left handler
      elements.bottomLeftHandler.style.position = 'absolute';
      elements.bottomLeftHandler.style.bottom = '0';
      elements.bottomLeftHandler.style.left = '0';
      // bottom right handler
      elements.bottomRightHandler.style.position = 'absolute';
      elements.bottomRightHandler.style.bottom = '0';
      elements.bottomRightHandler.style.right = '0';
    },

    applyElements: function(elements) {
      if (!elements.figure.parentElement)
        elements.image.parentElement.insertBefore(elements.figure, elements.image);

      elements.figure.appendChild(elements.image);

      if (elements.mask.parentElement)
        elements.figure.removeChild(elements.mask);

      if (elements.wrapper.parentElement)
        elements.figure.removeChild(elements.wrapper);

      if (elements.handlers.parentElement)
        elements.figure.removeChild(elements.handlers);
    },
  };

  return Imago;
}));
