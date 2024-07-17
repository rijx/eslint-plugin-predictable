# eslint-plugin-predictable

An ESLint plugin that enforces code patterns for more predictable, maintainable JavaScript. This plugin promotes functional programming principles to create codebases that are easier to reason about, test, and maintain.

## Core Principles

1. **Pure Function Calls**: By disallowing conditional expressions in function arguments, execution paths become more traceable and deterministic. This makes debugging more straightforward and allows for more reliable state extraction during error scenarios, as execution flow isn't obscured by hidden decision points.

2. **Explicit Control Flow**: Enforces separation between decision-making and action execution by ensuring `if` statements contain explicit flow control (returns, throws, breaks). This pushes decision points into visible control flow, making program behavior transparent and creating clearer boundaries between branching logic and business operations.

3. **Limited Nesting**: Restricts conditional nesting depth to encourage function composition over deep nesting. This promotes breaking complex logic into smaller, reusable functions that can be composed together, resulting in code that's more modular, testable, and follows the single responsibility principle.

4. **Focused Objects**: Enforces concise object property implementations, making it easier to understand the shape and purpose of objects at a glance. This encourages better domain modeling with objects that have clear, focused responsibilities rather than serving as catchalls for related functionality.

## Installation

```bash
npm install eslint-plugin-predictable --save-dev
```

Or using yarn:

```bash
yarn add -D eslint-plugin-predictable
```

Or using pnpm:

```bash
pnpm add -D eslint-plugin-predictable
```

## Usage

Add `predictable` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["predictable"]
}
```

Then configure the rules you want to use under the rules section:

```json
{
  "rules": {
    "predictable/complex-objects": "warn",
    "predictable/if-for-flow-control": "error",
    "predictable/max-conditional-depth": ["error", 3],
    "predictable/no-unconditional-function-calls": "warn"
  }
}
```

## Rules

### complex-objects

Enforces that object properties should not be longer than 5 lines. This encourages breaking down complex objects into smaller, more manageable pieces.

```javascript
// ❌ Bad
const config = {
  options: {
    // ... more than 5 lines of code
  }
};

// ✅ Good
const options = {
  // ... code under 5 lines
};

const config = {
  options
};
```

This rule is auto-fixable. It will extract long object properties into separate constants.

### if-for-flow-control

Ensures that `if` statements are only used for flow control by requiring them to end with a flow control statement (`return`, `throw`, `break`, or `continue`).

```javascript
// ❌ Bad
if (condition) {
  doSomething();
}

// ✅ Good
if (condition) {
  doSomething();
  return;
}
```

This pattern encourages early returns and prevents deeply nested code.

### max-conditional-depth

Limits the maximum depth of nested conditional statements. The default maximum is 4, but this can be configured.

```javascript
// ❌ Bad (with max depth of 3)
if (condition1) {
  if (condition2) {
    if (condition3) {
      if (condition4) {
        // This is too deep
      }
    }
  }
}

// ✅ Good
if (condition1) {
  if (condition2) {
    if (condition3) {
      // This is within the limit
    }
  }
}
```

The rule ignores conditional rethrows in catch blocks when calculating depth.

You can configure the maximum depth like so:

```json
{
  "rules": {
    "predictable/max-conditional-depth": ["error", { "maximum": 3 }]
  }
}
```

### no-unconditional-function-calls

Prevents conditional expressions within function arguments to make code execution paths more predictable and easier to reason about.

```javascript
// ❌ Bad
function process() {
  doSomething(condition ? 'yes' : 'no');
}

// ✅ Good
function process() {
  const value = condition ? 'yes' : 'no';
  doSomething(value);
}

// ❌ Bad
function renderTemplate(data) {
  return template(`Value: ${condition ? 'enabled' : 'disabled'}`);
}

// ✅ Good
function renderTemplate(data) {
  const status = condition ? 'enabled' : 'disabled';
  return template(`Value: ${status}`);
}
```

This rule improves code traceability by making conditional logic explicit and separating decision points from function calls. It catches ternary operators (`? :`), logical operators (`||`, `&&`, `??`), and other conditional expressions within function arguments.

## Development

### Setup

```bash
pnpm install
```

### Testing

```bash
pnpm test
```

## License

MIT
