Bildbearbeitungs = (function(window, document) {
	function editor(image) {
		this.image = image;
		this.figure = document.createElement('figure');

		this
			.wrapImage(this.image, this.figure)
			.unwrapImage(this.image, this.figure)
			.wrapImage(this.image, this.figure);
	}

	editor.prototype = {
		wrapImage: function(image, figure) {
			image.parentElement.insertBefore(figure, image);
			figure.appendChild(image);
			return this;
		},

		unwrapImage: function(image, figure) {
			figure.parentElement.insertBefore(image, figure);
			document.removeChild(figure);
			return this;
		}
	}

	return editor;
})(window, document);