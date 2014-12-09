(function(document) {
	var images = document.getElementsByTagName("img");

	for (var i = 0; i < images.length; i++)
		new Bildbearbeitungs(images[i]);
})(document);