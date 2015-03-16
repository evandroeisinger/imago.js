(function (global, constructor) {
  'use strict';

  if (typeof define === 'function' && define.amd)
    define('imago-js', [], constructor);
  else if (typeof exports !== 'undefined')
    exports.Imago = constructor();
  else
    global.Imago = constructor();
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

    return {
      save: _save,
      edit: _edit,
      undo: _undo,
      reset: _reset
    };
  }

  Imago.prototype = {};

  return Imago;
}));
