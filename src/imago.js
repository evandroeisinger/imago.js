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

    image.onload = function() {
      self.elements = self.getElements(image);
      self.setElements(self.elements);
    };

    return {
      save: _save,
      edit: _edit,
      undo: _undo,
      reset: _reset
    };
  }

  Imago.prototype = {
    getElements: function(image) {
      var _image = image,
          _figure;

      if (_image.parentElement && _image.parentElement.nodeName.toLowerCase() == 'figure')
        _figure = _image.parentElement;
      else
        _figure = document.createElement('figure');

      return {
        image: _image,
        figure: _figure
      };
    },

    setElements: function(elements) {
      var _image = elements.image,
          _figure = elements.figure;
          
      if (!_figure.parentElement)
        _image.parentElement.insertBefore(_figure, _image);

      _figure.appendChild(_image);
    }
  };

  return Imago;
}));
