!function(plugins, document) {
	window.Imago = function(image) {
		var image 	= image,
				figure 	= document.createElement('figure'),
				actions = document.createElement('div'),
				parent 	= image.parentElement;

		figure.className += 'figure';
		image.className  += 'figure__image';
		actions.className = 'figure__actions';

		parent.insertBefore(figure, image);
		figure.appendChild(actions);
		figure.appendChild(image);

		this.elements = {
			image: image,
			figure: figure,
			actions: actions,
			parent: parent
		}

		for (plugin in plugins)
			this.plugins[plugin] = new plugins[plugin](this);
	}

	Imago.prototype.plugins = {};
}(window.imagoPlugins, document);
