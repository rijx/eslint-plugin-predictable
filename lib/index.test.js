const { expect } = require("chai");
const plugin = require("./index");

describe("eslint-plugin-predictable", () => {
  it("should export all rules", () => {
    expect(plugin.rules).to.be.an("object");
    expect(plugin.rules).to.have.property("complex-objects");
    expect(plugin.rules).to.have.property("if-for-flow-control");
    expect(plugin.rules).to.have.property("max-conditional-depth");
    expect(plugin.rules).to.have.property("no-unconditional-function-calls");
  });

  it("each rule should have required properties", () => {
    Object.entries(plugin.rules).forEach(([ruleName, rule]) => {
      expect(rule, `Rule ${ruleName}`).to.have.property("meta").that.is.an("object");
      expect(rule.meta, `Rule ${ruleName}`).to.have.property("type").that.is.a("string");
      expect(rule.meta, `Rule ${ruleName}`).to.have.property("docs").that.is.an("object");
      expect(rule.meta.docs, `Rule ${ruleName}`).to.have.property("description").that.is.a("string");
      
      expect(rule, `Rule ${ruleName}`).to.have.property("create").that.is.a("function");
    });
  });

  it("complex-objects rule should be properly configured", () => {
    const rule = plugin.rules["complex-objects"];
    expect(rule.meta.type).to.equal("suggestion");
    expect(rule.meta.docs.category).to.equal("Best Practices");
    expect(rule.meta).to.have.property("fixable", "code");
  });

  it("if-for-flow-control rule should be properly configured", () => {
    const rule = plugin.rules["if-for-flow-control"];
    expect(rule.meta.type).to.equal("suggestion");
    expect(rule.meta).to.have.property("messages").that.is.an("object");
    expect(rule.meta.messages).to.have.property("notFlowControl");
  });

  it("max-conditional-depth rule should be properly configured", () => {
    const rule = plugin.rules["max-conditional-depth"];
    expect(rule.meta.type).to.equal("suggestion");
    expect(rule.meta).to.have.property("schema").that.is.an("array");
    expect(rule.meta).to.have.property("messages").that.is.an("object");
    expect(rule.meta.messages).to.have.property("tooDeeply");
  });

  it("no-unconditional-function-calls rule should be properly configured", () => {
    const rule = plugin.rules["no-unconditional-function-calls"];
    expect(rule.meta.type).to.equal("problem");
    expect(rule.meta.docs.category).to.equal("Best Practices");
    expect(rule.meta).to.have.property("schema").that.is.an("array");
  });
});
