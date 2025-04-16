const { RuleTester } = require("eslint");
const rule = require("./complex-objects");

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2021 }
});

ruleTester.run("complex-objects", rule, {
  valid: [
    {
      code: `
        const obj = {
          simple: 'value',
          method() {
            return true;
          }
        };
      `
    },
    {
      code: `
        const obj = {
          propWithFourLines: function() {
            if (true) {
              return 'something';
            }
          }
        };
      `
    },
    {
      code: `
        const obj = {
          ...supportSpread
        };
      `
    }
  ],
  invalid: [
    {
      code: `
        const obj = {
          tooLong: function() {
            if (true) {
              console.log('line1');
              console.log('line2');
              console.log('line3');
              return 'something';
            }
          }
        };
      `,
      errors: [
        {
          message: "Object keys should not be longer than 5 lines.",
          type: "Property"
        }
      ],
      output: `
        const tooLong = function() {
            if (true) {
              console.log('line1');
              console.log('line2');
              console.log('line3');
              return 'something';
            }
          };
const obj = {
          tooLong: tooLong
        };
      `
    },
    {
      code: `
        const data = {
          complexArray: [
            1,
            2,
            3,
            4,
            5,
            6
          ]
        };
      `,
      errors: [
        {
          message: "Object keys should not be longer than 5 lines.",
          type: "Property"
        }
      ],
      output: `
        const complexArray = [
            1,
            2,
            3,
            4,
            5,
            6
          ];
const data = {
          complexArray: complexArray
        };
      `
    }
  ]
});
