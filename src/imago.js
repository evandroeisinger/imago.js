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
      self.elements = self.loadElements(image);
      self.data = self.loadData(self.elements);
      self.initialize(self.elements);
    }

    function _save() {
    }

    function _edit() {
    }

    function _undo() {
    }

    function _reset() {
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

      if (!_shadow) {
        _shadow = _image.cloneNode();
        _shadow.className = 'crop__shadow';
      }

      _shadow.removeAttribute('id');
      
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

      _figure.style.overflow = 'hidden';
      _wrapper.style.overflow = 'hidden';
      
      _image.style.zIndex = '0';
      _mask.style.zIndex = '10';
      _wrapper.style.zIndex = '20';
      _handlers.style.zIndex = '30';    

      _figure.style.position = 'relative';
      _image.style.position = 'absolute';  
      _mask.style.position = 'absolute';
      _wrapper.style.position = 'absolute';
      _handlers.style.position = 'absolute';
      _shadow.style.position = 'absolute';
      _moveHandler.style.position = 'absolute';
      _topLeftHandler.style.position = 'absolute';
      _bottomRightHandler.style.position = 'absolute';

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
    
    loadData: function(elements) {
      var _image = elements.image,
          _origWidth = _image.getAttribute('data-orig-width') * 1,
          _origHeight = _image.getAttribute('data-orig-height') * 1,
          _width = _image.getAttribute('data-width') * 1,
          _height = _image.getAttribute('data-height') * 1,
          _top = _image.getAttribute('data-top') * 1,
          _left = _image.getAttribute('data-left') * 1;

      return {
        origWidth: _origWidth || _image.clientWidth,
        origHeight: _origHeight || _image.clientHeight,
        width: _width || _image.clientWidth,
        height: _height || _image.clientHeight,
        top: _top || 0,
        left: _left || 0,
      }
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
