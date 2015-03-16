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

  function Imago(image, plugins) {
  }

  Imago.prototype = {};

  return Imago;
}));
