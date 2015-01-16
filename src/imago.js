!function(plugins, document) {
  'use strict';

  window.Imago = function(image) {
    var self    = this,
        image   = image,
        figure  = self.getParent(image, 'figure', 'figure'),
        actions = self.getElement(figure, 'figure__actions', 'div');

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
      console.log(plugins)
      for (var name in plugins)
        actions.appendChild(new plugins[name](self));
    }
  }

  Imago.prototype = {
    getParent: function(element, className, nodeName) {
      if (!element.parentElement || 
          !element.parentElement.nodeName.toLowerCase() == nodeName ||
          !element.parentElement.className.indexOf(className) <= 0)
        return false;

      return element.parentElement;
    },

    getElement: function(wrapper, className, nodeName) {
      if (wrapper.children) {
        for (var i = 0; i < wrapper.children.length; i++) {
          if ( wrapper.children[i].nodeName.toLowerCase() == nodeName &&  wrapper.children[i].className.indexOf(className) <= 0)
            return  wrapper.children[i];  
        }
      }

      return false;
    }
  }
}(window.imagoPlugins, document);
