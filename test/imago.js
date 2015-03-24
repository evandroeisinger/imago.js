var image,
    imageWithAttributes,
    imageWithFigure,
    figureWithImage;

describe('imago.js', function(argument) {
  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = '../../base/test';
    loadFixtures('fixture.css');
    loadFixtures('fixture.html');
    
    image = document.getElementById('image');
    imageWithAttributes = document.getElementById('imageWithAttributes');
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
      expect(imageWithFigure.parentElement).toEqual(figureWithImage);
      new Imago(imageWithFigure);

      setTimeout(function() {
        expect(imageWithFigure.parentElement).toEqual(figureWithImage);
        done();
      }, 500);
    }, 1000);

    it('apply image data attributes', function(done) {
      expect(image).not.toHaveAttr('data-original-width');
      expect(image).not.toHaveAttr('data-original-height');
      expect(image).not.toHaveAttr('data-width');
      expect(image).not.toHaveAttr('data-height');
      expect(image).not.toHaveAttr('data-top');
      expect(image).not.toHaveAttr('data-left');
      
      new Imago(image);

      setTimeout(function() {
        expect(image).toHaveAttr('data-original-width', '1050');
        expect(image).toHaveAttr('data-original-height', '697');
        expect(image).toHaveAttr('data-width', '1050');
        expect(image).toHaveAttr('data-height', '697');
        expect(image).toHaveAttr('data-top', '0');
        expect(image).toHaveAttr('data-left', '0');
        done();
      }, 500);
    }, 1000);

    it('load image data attributes', function(done) {
      expect(imageWithAttributes).toHaveAttr('data-original-width', '640');
      expect(imageWithAttributes).toHaveAttr('data-original-height', '424');
      expect(imageWithAttributes).toHaveAttr('data-width', '640');
      expect(imageWithAttributes).toHaveAttr('data-height', '424');
      expect(imageWithAttributes).toHaveAttr('data-top', '0');
      expect(imageWithAttributes).toHaveAttr('data-left', '0');
      
      new Imago(imageWithAttributes);

      setTimeout(function() {
        expect(imageWithAttributes).toHaveAttr('data-original-width', '640');
        expect(imageWithAttributes).toHaveAttr('data-original-height', '424');
        expect(imageWithAttributes).toHaveAttr('data-width', '640');
        expect(imageWithAttributes).toHaveAttr('data-height', '424');
        expect(imageWithAttributes).toHaveAttr('data-top', '0');
        expect(imageWithAttributes).toHaveAttr('data-left', '0');
        done();
      }, 500);
    });

    afterEach(function(done) {
      done();
    }, 1000);
  });
});