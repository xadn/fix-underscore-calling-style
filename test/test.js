var assert                 = require('assert'),
    jstransform            = require('jstransform'),
    visitUnderscoreOOStyle = require('../visitors/visit_underscore_oo_style').visitorList;

describe('visitUnderscoreOOStyle', function() {
  describe('with simple arguments', function() {
    it('should transform the style', function() {
      var original =    'function hasChanged(views) {'
                      +   'return _(views).any(function() { return true; });'
                      + '}'

      var expected =    'function hasChanged(views) {'
                      +   'return _.any(views, function() { return true; });'
                      + '}'

      console.log(transform(original))

      assert.equal(normalize(expected), normalize(transform(original)));
    });
  });

  describe('with a function in the arguments', function() {
    it('should transform the style', function() {
      var original =    'function hasChanged(views) {'
                      +   'return _(function() { return [1, 2, 3]; }).any(function() { return true; });'
                      + '}'

      var expected =    'function hasChanged(views) {'
                      +   'return _.any(function() { return [1, 2, 3]; }, function() { return true; });'
                      + '}'

      console.log(transform(original))

      assert.equal(normalize(expected), normalize(transform(original)));
    });
  });
});

function transform(original) {
  return jstransform.transform(visitUnderscoreOOStyle, original).code;
}

function normalize(text) {
  // return text.replace(/\s+/g, ' ');
  return text.replace(/\s+/g, '');
}