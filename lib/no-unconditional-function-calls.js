// We should basically treat ConditionalExpression as a contamination
// The resulting value can be used in if statements (actually preferably not) and return statements
// What we can do: every argument is checked for ConditionalExpressions, recursively, so every identifier is followed through on
function findWithPredicate(arr, predicate) {
  for (let i = 0; i < arr.length; i++) {
    const result = predicate(arr[i], i, arr);
    if (result) {
      return result;
    }
  }
  return undefined;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow ConditionalExpression in CallExpression arguments',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [], // no options
  },
  create(context) {
    const sourceCode = context.getSourceCode();

    function isConditionalExpression(node) {
      return node.type === 'ConditionalExpression'
              || (node.type == 'LogicalExpression' && ["??", "||", "&&"].includes(node.operator));
    }

    function checkNode(node) {
      if (!node) return false;
      if (isConditionalExpression(node)) {
        return node;
      }

      switch (node.type) {
        case 'ArrayExpression':
          return findWithPredicate(node.elements, checkNode);
        case 'ObjectExpression':
          return findWithPredicate(node.properties, prop => checkNode(prop.value));
        case 'Identifier':
          const variable = findVariable(node);
          return variable && findWithPredicate(variable);
        // case 'CallExpression':
          // return findWithPredicate(node.arguments, checkNode);
        case 'LogicalExpression':
        case 'BinaryExpression':
          return checkNode(node.left) || checkNode(node.right);
        case 'TemplateLiteral':
          return findWithPredicate(node.expressions, checkNode);
        case 'CallExpression':
        case 'Literal':
          return false;
        default:
          return false;
      }
    }

    function findVariable(node) {
      const scope = sourceCode.getScope(node);
      const variable = scope.variables.find(variable => variable.name === node.name);
      if (!variable || !variable.defs.length) return null;
      const def = variable.defs[0];
      if (def.node.init) {
        return def.node.init;
      }
      return null;
    }

    return {
      ConditionalExpression(node) {
        let parentNode = node;
        while (parentNode) {
          parentNode = parentNode.parent;
        }
      },
      CallExpression(node) {
        for (const argument of node.arguments) {
          const conditional = checkNode(argument);

          if (!conditional) continue;

          context.report({
            node: conditional,
            message: 'CallExpression arguments should not contain ConditionalExpressions.',
          });
        }
      },
    };
  },
};
