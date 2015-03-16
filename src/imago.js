(function (global, Imago) {
  'use strict';

  if (typeof define === 'function' && define.amd)
    define('imago-js', [], new Imago());
  else if (typeof exports !== 'undefined')
    exports.Imago = new Imago();
  else
    global.Imago = new Imago();
}(window, function() {
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

    self.elements = self.generateElements(image);

    return {
      save: _save,
      edit: _edit,
      undo: _undo,
      reset: _reset
    };
  }

  Imago.prototype = {
    generateElements: function(image) {
      if (!image || !image.tagName || image.tagName.toLowerCase() !== 'img')
        throw new TypeError('Invalid image: ' + image);
    }
  };

  return Imago;
}));
