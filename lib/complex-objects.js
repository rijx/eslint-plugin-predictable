module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Object keys should not be longer than 5 lines',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      ObjectExpression(node) {
        const sourceCode = context.getSourceCode();

        for (const property of node.properties) {
          if (!property.key || !property.value) continue;

          const text = sourceCode.getText(property.value);

          if (text.trim().split(/\r\n|\r|\n/g).length > 5) {
            context.report({
              node: property,
              message: 'Object value should not be longer than 5 lines.',
              *fix(fixer) {
                let top = node;
                while (top.parent.type != 'Program' && top.parent.type != 'BlockStatement') {
                  top = top.parent;
                }
                yield fixer.insertTextBefore(top, `const ${property.key.name} = ${text};\n`);

                yield fixer.replaceText(property.value, property.key.name);
              }
            });
          }
        }
      },
    };
  },
};
