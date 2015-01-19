describe("imago.js - unit", function() {
  it("return a new instance", function() {
    var image = $j('<img src="http://farm9.staticflickr.com/8246/8662153499_08938cb34d_b_d.jpg"/>')[0],
        imago;

    $j(document.body).append(image);
    
    imago = new Imago(image);
    
    expect(imago instanceof Imago).toBe(true);
    expect(imago.elements.image).toBeDefined(true);
    expect(imago.elements.figure).toBeDefined(true);
    expect(imago.elements.actions).toBeDefined(true);
  });

  it("return figure wrapper", function() {
    var $figure = $j('<figure id="figure"><img id="image"></figure>')[0],
        $image  = $j('#image', $figure)[0];

    expect(Imago.prototype.getFigureFrom).toBeDefined();
    expect(Imago.prototype.getFigureFrom($image)).toEqual($figure);
    expect(Imago.prototype.getFigureFrom($figure)).toBe(false);
  });

  it("return figure actions", function() {
    var $figure  = $j('<figure id="figure"><div class="figure__actions"></div></figure>')[0],
        $actions = $j('.figure__actions', $figure)[0];

    expect(Imago.prototype.getActionsFrom).toBeDefined();
    expect(Imago.prototype.getActionsFrom($figure)).toEqual($actions);
    expect(Imago.prototype.getActionsFrom($actions)).toEqual(false);
  });
});