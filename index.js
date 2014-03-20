var jstransform           = require('jstransform')
  , Syntax                = require('esprima-fb').Syntax
  , utils                 = require('jstransform/src/utils')
  , fs                    = require('fs');

var originalFileContents = fs.readFileSync('examples/simple.js', 'utf-8');
// var originalFileContents = fs.readFileSync('examples/views.js', 'utf-8');

function visitEvalCallExpressions(traverse, node, path, state) {
  utils.append('UNDERSCORE', state);
  utils.catchup(node.range[1], state);
}

visitEvalCallExpressions.test = function(node, path, state) {
  var val = node.type === Syntax.CallExpression
         && node.callee.type === Syntax.Identifier
         && node.callee.name === '_';

  if (val) debugger

  return val;
};

var transformedFileData = jstransform.transform([
    visitEvalCallExpressions
  ],
  originalFileContents
);

// alert("...eval?...really?...");eval('foo');
console.log(transformedFileData.code);