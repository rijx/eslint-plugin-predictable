const { expect } = require("chai");
const astUtils = require("./ast-utils");

describe("ast-utils", () => {
  describe("isFunction", () => {
    it("should return true for FunctionDeclaration", () => {
      const node = { type: "FunctionDeclaration" };
      expect(astUtils.isFunction(node)).to.be.true;
    });

    it("should return true for FunctionExpression", () => {
      const node = { type: "FunctionExpression" };
      expect(astUtils.isFunction(node)).to.be.true;
    });

    it("should return true for ArrowFunctionExpression", () => {
      const node = { type: "ArrowFunctionExpression" };
      expect(astUtils.isFunction(node)).to.be.true;
    });

    it("should return false for other node types", () => {
      const node = { type: "VariableDeclaration" };
      expect(astUtils.isFunction(node)).to.be.false;
    });

    it("should return false for null", () => {
      expect(astUtils.isFunction(null)).to.be.false;
    });
  });

  describe("isLogicalAssignmentOperator", () => {
    it("should return true for logical assignment operators", () => {
      expect(astUtils.isLogicalAssignmentOperator("&&=")).to.be.true;
      expect(astUtils.isLogicalAssignmentOperator("||=")).to.be.true;
      expect(astUtils.isLogicalAssignmentOperator("??=")).to.be.true;
    });

    it("should return false for other operators", () => {
      expect(astUtils.isLogicalAssignmentOperator("=")).to.be.false;
      expect(astUtils.isLogicalAssignmentOperator("+=")).to.be.false;
      expect(astUtils.isLogicalAssignmentOperator("-=")).to.be.false;
      expect(astUtils.isLogicalAssignmentOperator("*=")).to.be.false;
    });
  });

  describe("isInLoop", () => {
    it("should return true for nodes inside loops", () => {
      const node = { 
        type: "Identifier",
        parent: {
          type: "ForStatement"
        }
      };
      expect(astUtils.isInLoop(node)).to.be.true;
    });

    it("should return true for deeply nested nodes inside loops", () => {
      const node = { 
        type: "Identifier",
        parent: {
          type: "BlockStatement",
          parent: {
            type: "IfStatement",
            parent: {
              type: "WhileStatement"
            }
          }
        }
      };
      expect(astUtils.isInLoop(node)).to.be.true;
    });

    it("should return false for nodes not inside loops", () => {
      const node = { 
        type: "Identifier",
        parent: {
          type: "BlockStatement",
          parent: {
            type: "IfStatement"
          }
        }
      };
      expect(astUtils.isInLoop(node)).to.be.false;
    });

    it("should stop searching at function boundaries", () => {
      const node = { 
        type: "Identifier",
        parent: {
          type: "BlockStatement",
          parent: {
            type: "FunctionDeclaration",
            parent: {
              type: "WhileStatement"
            }
          }
        }
      };
      expect(astUtils.isInLoop(node)).to.be.false;
    });
  });
});
