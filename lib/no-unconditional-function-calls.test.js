const { RuleTester } = require("eslint");
const rule = require("./no-unconditional-function-calls");

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2021 }
});

ruleTester.run("no-unconditional-function-calls", rule, {
  valid: [
    {
      code: `
        function test() {
          doSomething('static string');
        }
      `
    },
    {
      code: `
        function test() {
          doSomething(123);
        }
      `
    },
    {
      code: `
        function test() {
          const value = condition ? 'yes' : 'no';
          doSomething(value);
        }
      `,
    },
    {
      code: `
        function test() {
          const value = 'static';
          doSomething(value);
        }
      `
    },
    {
      code: `
        function test() {
          doSomething({ prop: 'value' });
        }
      `
    },
    {
      code: `
        function test() {
          doSomething([1, 2, 3]);
        }
      `
    },
    {
      code: `
        function test() {
          const arr = [1, 2, 3];
          doSomething(arr);
        }
      `
    },
    {
      code: `
        function test() {
          doSomething(\`template string\`);
        }
      `
    },
    {
      code: `
        function test() {
          doSomething(nestedCall());
        }
      `
    }
  ],
  invalid: [
    {
      code: `
        function test() {
          doSomething(condition ? 'yes' : 'no');
        }
      `,
      errors: [
        {
          message: "CallExpression arguments should not contain ConditionalExpressions.",
          type: "ConditionalExpression"
        }
      ]
    },
    {
      code: `
        function test() {
          doSomething(a || b);
        }
      `,
      errors: [
        {
          message: "CallExpression arguments should not contain ConditionalExpressions.",
          type: "LogicalExpression"
        }
      ]
    },
    {
      code: `
        function test() {
          doSomething(a && b);
        }
      `,
      errors: [
        {
          message: "CallExpression arguments should not contain ConditionalExpressions.",
          type: "LogicalExpression"
        }
      ]
    },
    {
      code: `
        function test() {
          doSomething(a ?? b);
        }
      `,
      errors: [
        {
          message: "CallExpression arguments should not contain ConditionalExpressions.",
          type: "LogicalExpression"
        }
      ]
    },
    {
      code: `
        function test() {
          doSomething({ prop: condition ? 'yes' : 'no' });
        }
      `,
      errors: [
        {
          message: "CallExpression arguments should not contain ConditionalExpressions.",
          type: "ConditionalExpression"
        }
      ]
    },
    {
      code: `
        function test() {
          doSomething([1, 2, condition ? 3 : 4]);
        }
      `,
      errors: [
        {
          message: "CallExpression arguments should not contain ConditionalExpressions.",
          type: "ConditionalExpression"
        }
      ]
    },
    {
      code: `
        function test() {
          doSomething(\`Value: \${condition ? 'yes' : 'no'}\`);
        }
      `,
      errors: [
        {
          message: "CallExpression arguments should not contain ConditionalExpressions.",
          type: "ConditionalExpression"
        }
      ]
    }
  ]
});
