const { RuleTester } = require("eslint");
const rule = require("./if-for-flow-control");

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2021 }
});

ruleTester.run("if-for-flow-control", rule, {
  valid: [
    {
      code: `
        function test() {
          if (condition) {
            return true;
          }
          return false;
        }
      `
    },
    {
      code: `
        function test() {
          if (condition) {
            doSomething();
            return true;
          } else {
            return false;
          }
        }
      `
    },
    {
      code: `
        function test() {
          if (condition) {
            throw new Error('Something went wrong');
          }
          return result;
        }
      `
    },
    {
      code: `
        function test() {
          for (let i = 0; i < 10; i++) {
            if (i === 5) {
              break;
            }
          }
        }
      `
    },
    {
      code: `
        function test() {
          for (let i = 0; i < 10; i++) {
            if (i === 5) {
              continue;
            }
          }
        }
      `
    }
  ],
  invalid: [
    {
      code: `
        function test() {
          if (condition) {
            doSomething();
          }
          return result;
        }
      `,
      errors: [
        {
          messageId: "notFlowControl",
          type: "BlockStatement"
        }
      ]
    },
    {
      code: `
        function test() {
          if (condition) {
            return true;
          } else {
            doSomething();
          }
          return false;
        }
      `,
      errors: [
        {
          messageId: "notFlowControl",
          type: "BlockStatement"
        }
      ]
    },
    {
      code: `
        function test() {
          if (condition) {
            doSomething();
          } else {
            doSomethingElse();
          }
          return result;
        }
      `,
      errors: [
        {
          messageId: "notFlowControl",
          type: "BlockStatement"
        },
        {
          messageId: "notFlowControl",
          type: "BlockStatement"
        }
      ]
    },
    {
      code: `
        function test() {
          if (condition)
            doSomething();
          return result;
        }
      `,
      errors: [
        {
          messageId: "notFlowControl",
          type: "ExpressionStatement"
        }
      ]
    }
  ]
});
