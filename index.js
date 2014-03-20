// app/assets/javascripts/tracker/views.js

/**
 * Reads a source file that may (or may not) contain ES6 classes, transforms it
 * to ES5 compatible code using the pre-bundled ES6 class visitors, and prints
 * out the result.
 */
var es6ClassVisitors = require('jstransform/visitors/es6-class-visitors').visitorList;
var fs = require('fs');
var jstransform = require('jstransform');

var originalFileContents = fs.readFileSync('examples/views.js', 'utf-8');

var transformedFileData = jstransform.transform(
  es6ClassVisitors,
  originalFileContents
);

console.log(transformedFileData.code);