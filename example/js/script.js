(function(document) {
	var images = document.getElementsByTagName("img"),
      imagos = [];

	for (var i = 0; i < images.length; i++)
		imagos.push(new Imago(images[i]));

  setTimeout(function(){
    for (var i = 0; i < imagos.length; i++)
      console.log(imagos[i].export());
  }, 2000)
  
})(document);