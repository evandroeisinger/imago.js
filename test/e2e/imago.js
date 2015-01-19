describe("imago.js - e2e", function() {
    var f = jasmine.getFixtures(),
        i = jasmine.getFixtures(),
        figure,
        image;

    f.fixturesPath = 'base';
    i.fixturesPath = 'base';

    beforeEach(function(){
      f.load('test/e2e/figure.html');
      i.load('test/e2e/figure.html');
      figure = $j('#figure');
      image = $j('#image');
    });
 
    afterEach(function() {
        f.cleanUp();
        f.clearCache();
        i.cleanUp();
        i.clearCache();
    });
 
    it("dummy", function() {
      expect(true).toBe(true);
    });
});