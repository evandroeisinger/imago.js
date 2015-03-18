describe('imago.js', function(argument) {
  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = '../../base/test';
    loadFixtures('fixtures.html');
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
});