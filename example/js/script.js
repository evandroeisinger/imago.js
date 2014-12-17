(function(document) {
	var images = document.getElementsByTagName("img");

	for (var i = 0; i < images.length; i++)
		new Imago(images[i]);
})(document);