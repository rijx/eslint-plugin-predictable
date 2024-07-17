const LOGICAL_ASSIGNMENT_OPERATORS = new Set(["&&=", "||=", "??="]);
const anyFunctionPattern = /^(?:Function(?:Declaration|Expression)|ArrowFunctionExpression)$/u;
const anyLoopPattern = /^(?:DoWhile|For|ForIn|ForOf|While)Statement$/u;

/**
 * Checks whether a given node is a function node or not.
 * The following types are function nodes:
 *
 * - ArrowFunctionExpression
 * - FunctionDeclaration
 * - FunctionExpression
 * @param {ASTNode|null} node A node to check.
 * @returns {boolean} `true` if the node is a function node.
 */
function isFunction(node) {
    return Boolean(node && anyFunctionPattern.test(node.type));
}

function isLogicalAssignmentOperator(operator) {
    return LOGICAL_ASSIGNMENT_OPERATORS.has(operator);
}


/**
 * Checks whether a given node is a loop node or not.
 * The following types are loop nodes:
 *
 * - DoWhileStatement
 * - ForInStatement
 * - ForOfStatement
 * - ForStatement
 * - WhileStatement
 * @param {ASTNode|null} node A node to check.
 * @returns {boolean} `true` if the node is a loop node.
 */
function isLoop(node) {
    return Boolean(node && anyLoopPattern.test(node.type));
}

/**
 * Checks whether the given node is in a loop or not.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node is in a loop.
 */
function isInLoop(node) {
    for (let currentNode = node; currentNode && !isFunction(currentNode); currentNode = currentNode.parent) {
        if (isLoop(currentNode)) {
            return true;
        }
    }

    return false;
}

module.exports = {
    isFunction,
    isLogicalAssignmentOperator,
    isInLoop
};
