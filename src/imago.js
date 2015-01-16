!function(plugins, document) {
  window.Imago = function(image) {
    var self    = this,
        image   = image,
        figure  = document.createElement('figure'),
        actions = document.createElement('div'),
        parent  = image.parentElement;

    figure.className += 'figure';
    image.className  += 'figure__image';
    actions.className = 'figure__actions';

    parent.insertBefore(figure, image);
    figure.appendChild(actions);
    figure.appendChild(image);

    self.plugins  = {};
    self.elements = {
      image: image,
      figure: figure,
      actions: actions,
      parent: parent
    };

    image.onload = function() {
      for (plugin in plugins)
        self.plugins[plugin] = new plugins[plugin](self);
    }
  }

  Imago.prototype.plugins = {};
}(window.imagoPlugins, document);
