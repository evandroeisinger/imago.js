(function (global, Imago) {
  'use strict';

  if (typeof define === 'function' && define.amd)
    define('imago-js', [], Imago);
  else if (typeof exports !== 'undefined')
    exports.Imago = Imago();
  else
    global.Imago = Imago();
}(window, function() {
  'use strict';

  function Imago(image, plugins) {
    var self = this,
        figure,
        actions;

    if (!image || !image.nodeName.toLowerCase() == 'img')
      return new Error('No image was passed!');

    figure = self.getFigureFrom(image);
    actions = self.getActionsFrom(image);

    if (!figure) {
      figure = document.createElement('figure');
      figure.className += 'figure';
      image.parentElement.insertBefore(figure, image);
      figure.appendChild(image);
    }

    if (!actions) {
      actions = document.createElement('div'),
      actions.className = 'figure__actions';
      figure.appendChild(actions);
    }
    
    if (!image.className.indexOf('figure__image') <= 0)
      image.className = 'figure__image';

    if (image.style.cssText.length)
      image.style.cssText = "";
    
    while (actions.firstChild) {
      actions.removeChild(actions.firstChild);
    }

    self.elements = {
      image: image,
      figure: figure,
      actions: actions
    };

    image.onload = function() {
      for (var plugin in plugins)
        actions.appendChild(new plugins[plugin](self));
    }
  }

  Imago.prototype = {
    getFigureFrom: function(element) {
      var parent = element.parentElement;
      if (parent && parent.nodeName.toLowerCase() == 'figure')
        return parent;

      return false;
    },

    getActionsFrom: function(element) {
      if (element.children) {
        for (var i = 0; i < element.children.length; i++) {
          if ( element.children[i].nodeName.toLowerCase() == 'div' &&  element.children[i].className.indexOf('figure__actions') <= 0)
            return  element.children[i];  
        }
      }

      return false;
    }
  }

  return Imago;
}));
