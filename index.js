var jstransform            = require('jstransform')
  , visitUnderscoreOOStyle = require('./visitors/visit_underscore_oo_style').visitorList
  , fs                     = require('fs');

var transformedFileData = jstransform.transform(visitUnderscoreOOStyle, fs.readFileSync('examples/simple.js', 'utf-8'));

console.log(transformedFileData.code);