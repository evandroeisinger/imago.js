var image,
    imageWithFigure,
    figureWithImage;

describe('imago.js', function(argument) {
  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = '../../base/test';
    loadFixtures('fixtures.html');

    image = document.getElementById('image');
    imageWithFigure = document.getElementById('imageWithFigure');
    figureWithImage = document.getElementById('figureWithImage');
  });

  it('must exist in the global context', function() {
    expect(Imago).toBeDefined();
  });

  it('throw a error when is a invalid image', function() {
    expect(function() {
      new Imago();
    }).toThrow(TypeError('Invalid image: undefined'));
  });

  it('return a Imago instance', function() {
    var imago = new Imago(image);
    expect(imago.save).toBeDefined();
    expect(imago.edit).toBeDefined();
    expect(imago.undo).toBeDefined();
    expect(imago.reset).toBeDefined();
  });

  describe('initialize imago elements', function() {
    beforeEach(function(done) {
      done();
    }, 1000);

    it('wrap image with a figure', function(done) {
      expect(image.parentElement.id).toEqual('jasmine-fixtures');
      new Imago(image);    
      
      setTimeout(function() {
        expect(image.parentElement.nodeName.toLowerCase()).toEqual('figure');
        done();
      }, 500);
    }, 1000);

    it('use image parent figure', function(done) {
      expect(image.parentElement).toEqual(figureWithImage);
      new Imago(imageWithFigure);

      setTimeout(function() {
        expect(image.parentElement).toEqual(figureWithImage);
        done();
      }, 500);
    }, 1000);

    afterEach(function(done) {
      done();
    }, 1000);
  });
});