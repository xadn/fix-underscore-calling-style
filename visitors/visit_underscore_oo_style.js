var Syntax                = require('esprima-fb').Syntax
  , escodegen             = require('escodegen')
  , utils                 = require('jstransform/src/utils');

function newStyleTree(property, args) {
  return {
    'type': 'ExpressionStatement',
    'expression': {
      'type': 'CallExpression',
      'callee': {
        'type': 'MemberExpression',
        'computed': false,
        'object': {
          'type': 'Identifier',
          'name': '_'
        },
        'property': property
      },
      'arguments': args
    }
  };
}

function visitUnderscoreOOStyle(traverse, node, path, state) {
  var prop = path[0].property,
      args = node.arguments.concat(path[1].arguments);

  var transformed = escodegen.generate(newStyleTree(prop, args)).replace(/;$/g, ' ');

  debugger

  utils.append(transformed, state);
  utils.catchupWhiteSpace(path[1].range[1], state);
}

visitUnderscoreOOStyle.test = function(node, path, state) {
  return node.type === Syntax.CallExpression
         && node.callee.type === Syntax.Identifier
         && node.callee.name === '_';
};

exports.visitorList = [
  visitUnderscoreOOStyle
];


// function hasChanged(views) {
//   return _.any(views, function() { return true; });
// };