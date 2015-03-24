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

    function _fetch() {
      self.tmp = {};
      self.data = self.loadAttributes(image);
      self.elements = self.loadElements(image);
      
      self.applyStyles(self.elements);
      self.applyDimensions(self.data, self.elements);
      self.applyPositions(self.data, self.elements);
      self.applyAttributes(self.data, self.elements);
      self.initialize(self.elements);
    }

    function _edit() {
      self.showElements(self.elements);
    }

    function _save() {
      self.hideElements(self.elements);
    }

    function _undo() {
      self.hideElements(self.elements);
    }

    function _reset() {
      self.hideElements(self.elements);
    }

    if (!image || !image.tagName || image.tagName.toLowerCase() !== 'img')
      throw new TypeError('Invalid image: ' + image);

    if (!image.complete)
      image.onload = _fetch;
    else
      _fetch();

    return {
      save: _save,
      edit: _edit,
      undo: _undo,
      reset: _reset
    };
  }

  Imago.prototype = {
    showElements: function(elements) {
      elements.figure.style.overflow = 'inherit';
    
      elements.figure.appendChild(elements.mask);
      elements.figure.appendChild(elements.wrapper);
      elements.figure.appendChild(elements.handlers);
    },

    hideElements: function(elements) {
      elements.figure.style.overflow = 'hidden';
    
      elements.figure.removeChild(elements.mask);
      elements.figure.removeChild(elements.wrapper);
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
        _moveHandler.className = 'crop__move';
      }
      
      if (!_topLeftHandler) {
        _topLeftHandler = document.createElement('span');
        _topLeftHandler.className = 'crop__top-left-handler';
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
      // handler elements
      elements.moveHandler.style.position = 'absolute';
      elements.topLeftHandler.style.position = 'absolute';
      elements.bottomRightHandler.style.position = 'absolute';
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

    initialize: function(elements) {
      var _image = elements.image,
          _figure = elements.figure,
          _shadow = elements.shadow,
          _mask = elements.mask,
          _wrapper = elements.wrapper,
          _handlers = elements.handlers;
    
      if (!_figure.parentElement)
        _image.parentElement.insertBefore(_figure, _image);
      
      _figure.appendChild(_image);

      if (_mask.parentElement)
        _figure.removeChild(_mask);
        
      if (_wrapper.parentElement)
        _figure.removeChild(_wrapper);

      if (_handlers.parentElement)
        _figure.removeChild(_handlers);
    },
  };

  return Imago;
}));
