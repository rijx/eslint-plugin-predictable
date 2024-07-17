const FLOW_CONTROL_TYPES = ["ReturnStatement", "ThrowStatement", "ContinueStatement", "BreakStatement"];

function missingControlFlow(node) {
    const statements = node.type == "BlockStatement" ? node.body : [node];
    const lastStatement = statements[statements.length - 1];

    if (!lastStatement) return;

    return !FLOW_CONTROL_TYPES.includes(lastStatement?.type);
}

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Only allow if statements to control the flow",
            recommended: false,
        },
        messages: {
            notFlowControl: "If statements can only be used for flow control. Add a return statement."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        return {
            "IfStatement:exit"(node) {
                if (missingControlFlow(node.consequent)) {
                    context.report({
                        node: node.consequent,
                        messageId: "notFlowControl",
                    });
                }

                if (node.alternate && missingControlFlow(node.alternate)) {
                    context.report({
                        node: node.alternate,
                        messageId: "notFlowControl",
                    });
                }
            },
        };
    }
};
