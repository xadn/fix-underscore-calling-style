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

      assert.equal(normalize(transform(original)), normalize(expected));
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

      assert.equal(normalize(transform(original)), normalize(expected));
    });
  });

  describe('with nesting in the arguments', function() {
    it('should transform the style of the outer function', function() {
      var original =    'function hasChanged(views) {'
                      +   'return _(views).any(function(view) { return _(view).isObject(); });'
                      + '}';

      var expected =    'function hasChanged(views) {'
                      +   'return _.any(views, function(view) { return _(view).isObject(); });'
                      + '}'

      assert.equal(normalize(transform(original)), normalize(expected));
    });
  });

  function transform(original) {
    return jstransform.transform(visitUnderscoreOOStyle, original).code;
  }

  function normalize(text) {
    return text.replace(/\s+/g, '');
  }
});
