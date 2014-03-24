var Syntax                = require('esprima-fb').Syntax
  , escodegen             = require('escodegen')
  , utils                 = require('jstransform/src/utils')
  , jstransform            = require('jstransform');

function newStyleTree(prop, args) {
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
        'property': prop
      },
      'arguments': args
    }
  };
}

function visitUnderscoreOOStyle(traverse, node, path, state) {
  var prop = node.callee.property,
      args = [].concat(node.callee.object.arguments, node.arguments);

  var transformed = escodegen.generate(newStyleTree(prop, args)).replace(/;$/g, ' ');
  transformed = jstransform.transform(state.g.visitors, transformed).code

  utils.append(transformed, state);
  utils.catchupWhiteSpace(node.range[1], state);
  return false;
}

visitUnderscoreOOStyle.test = function(node, path, state) {
  return  node.callee
          && node.callee.object
          && node.callee.object.type === Syntax.CallExpression
          && node.callee.object.callee
          && node.callee.object.callee.type === Syntax.Identifier
          && node.callee.object.callee.name === '_';
};

exports.visitorList = [
  visitUnderscoreOOStyle
];
