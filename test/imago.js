describe('imago.js', function(argument) {
  it('must exist in the global context', function() {
    expect(Imago).toBeDefined();
  });

  it('return a Imago instance', function() {
    var imago = new Imago();
    expect(imago.save).toBeDefined();
    expect(imago.edit).toBeDefined();
    expect(imago.undo).toBeDefined();
    expect(imago.reset).toBeDefined();
  });
});