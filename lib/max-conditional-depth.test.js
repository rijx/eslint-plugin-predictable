const { RuleTester } = require("eslint");
const rule = require("./max-conditional-depth");

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2021 }
});

ruleTester.run("max-conditional-depth", rule, {
  valid: [
    // Default max depth is 4
    {
      code: `
        function test() {
          if (condition1) {
            if (condition2) {
              if (condition3) {
                if (condition4) {
                  return true;
                }
              }
            }
          }
          return false;
        }
      `
    },
    // Custom max depth
    {
      code: `
        function test() {
          if (condition1) {
            if (condition2) {
              return true;
            }
          }
          return false;
        }
      `,
      options: [2]
    },
    // Conditional rethrow (should be ignored)
    {
      code: `
        function test() {
          try {
            doSomething();
          } catch (error) {
            if (error.code === 'SPECIAL_ERROR') {
              doSomethingElse();
            }
            throw error;
          }
        }
      `
    },
    // Mixed conditionals but not exceeding max
    {
      code: `
        function test() {
          if (condition1) {
            for (let i = 0; i < 10; i++) {
              if (condition2) {
                switch (value) {
                  case 1:
                    return 'one';
                }
              }
            }
          }
          return false;
        }
      `
    }
  ],
  invalid: [
    // Exceeds default max depth
    {
      code: `
        function test() {
          if (condition1) {
            if (condition2) {
              if (condition3) {
                if (condition4) {
                  if (condition5) {
                    return true;
                  }
                }
              }
            }
          }
          return false;
        }
      `,
      errors: [
        {
          messageId: "tooDeeply",
          data: { depth: 5, maxDepth: 4 },
          type: "IfStatement"
        }
      ]
    },
    // Exceeds custom max depth
    {
      code: `
        function test() {
          if (condition1) {
            if (condition2) {
              if (condition3) {
                return true;
              }
            }
          }
          return false;
        }
      `,
      options: [2],
      errors: [
        {
          messageId: "tooDeeply",
          data: { depth: 3, maxDepth: 2 },
          type: "IfStatement"
        }
      ]
    },
    // Different types of conditionals
    {
      code: `
        function test() {
          if (condition1) {
            for (let i = 0; i < 10; i++) {
              while (condition2) {
                switch (value) {
                  case 1:
                    if (extraCondition) {
                      return 'one';
                    }
                    break;
                }
              }
            }
          }
          return false;
        }
      `,
      options: [4],
      errors: [
        {
          messageId: "tooDeeply",
          data: { depth: 5, maxDepth: 4 },
          type: "IfStatement"
        }
      ]
    },
    // Using object-based option format
    {
      code: `
        function test() {
          if (condition1) {
            if (condition2) {
              if (condition3) {
                return true;
              }
            }
          }
          return false;
        }
      `,
      options: [{ max: 2 }],
      errors: [
        {
          messageId: "tooDeeply",
          data: { depth: 3, maxDepth: 2 },
          type: "IfStatement"
        }
      ]
    },
    // Using object-based option format with 'maximum'
    {
      code: `
        function test() {
          if (condition1) {
            if (condition2) {
              if (condition3) {
                return true;
              }
            }
          }
          return false;
        }
      `,
      options: [{ maximum: 2 }],
      errors: [
        {
          messageId: "tooDeeply",
          data: { depth: 3, maxDepth: 2 },
          type: "IfStatement"
        }
      ]
    }
  ]
});
