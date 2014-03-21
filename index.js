var jstransform            = require('jstransform')
  , visitUnderscoreOOStyle = require('./visitors/visit_underscore_oo_style').visitorList
  , fs                     = require('fs');

var fileName = process.argv[2],
    transformedFileData = jstransform.transform(visitUnderscoreOOStyle, fs.readFileSync(fileName, 'utf-8')).code;

fs.writeFileSync(fileName, transformedFileData);