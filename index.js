var jstransform            = require('jstransform')
  , visitUnderscoreOOStyle = require('./visitors/visit_underscore_oo_style').visitorList
  , fs                     = require('fs')
  , glob                   = require('glob');

var name = process.argv[2];

if (fs.lstatSync(name).isDirectory()) {
  glob(name + "/**/*.js", {}, function (er, files) {
    files.forEach(transformFile);
  });
} else {
  transformFile(name);
}

function transformFile(fileName) {
  fs.readFile(fileName, 'utf-8', function(err, data) {
    if (err) return;
    fs.writeFile(fileName, jstransform.transform(visitUnderscoreOOStyle, data).code);
  });
}
