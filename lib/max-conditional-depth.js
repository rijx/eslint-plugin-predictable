function isConditionalRethrow(node) {
    if (node.type != 'CatchClause' || !node.param?.name) return;

    const defaultBehavior = node.body.body.length == 1 && node.body.body[0].type == 'IfStatement' ? node.body.body[0].consequent : node.body;

    const lastStatement = defaultBehavior.body[defaultBehavior.body.length - 1];

    if (!lastStatement) return;

    return lastStatement.type == 'ThrowStatement'
      && lastStatement.argument?.type == 'Identifier'
      && node.param.name == lastStatement.argument.name;
}

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Enforce a maximum depth that conditionals have",
            recommended: false,
        },

        schema: [
            {
                oneOf: [
                    {
                        type: "integer",
                        minimum: 0
                    },
                    {
                        type: "object",
                        properties: {
                            maximum: {
                                type: "integer",
                                minimum: 0
                            },
                            max: {
                                type: "integer",
                                minimum: 0
                            }
                        },
                        additionalProperties: false
                    }
                ]
            }
        ],
        messages: {
            tooDeeply: "Conditionals are nested too deeply ({{depth}}). Maximum allowed is {{maxDepth}}. Conditional rethrows are ignored."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        const functionStack = [],
            option = context.options[0];
        let maxDepth = 4;

        if (
            typeof option === "object" &&
            (Object.hasOwn(option, "maximum") || Object.hasOwn(option, "max"))
        ) {
            maxDepth = option.maximum || option.max;
        }
        if (typeof option === "number") {
            maxDepth = option;
        }

        /**
         * When parsing a new function, store it in our function stack
         * @returns {void}
         * @private
         */
        function startFunction() {
            functionStack.push([]);
        }

        /**
         * When parsing is done then pop out the reference
         * @returns {void}
         * @private
         */
        function endFunction() {
            functionStack.pop();
        }

        /**
         * Save the block and Evaluate the node
         * @param {ASTNode} node node to evaluate
         * @returns {void}
         * @private
         */
        function pushBlock(node) {
            if (isConditionalRethrow(node)) return;

            const currentStack = functionStack[functionStack.length - 1];
            currentStack.push(node);

            if (currentStack.length > maxDepth) {
                context.report({ node, messageId: "tooDeeply", data: { depth: currentStack.length, maxDepth } });
            }
        }

        /**
         * Pop the saved block
         * @returns {void}
         * @private
         */
        function popBlock(node) {
            if (isConditionalRethrow(node)) return;

            functionStack[functionStack.length - 1].pop();
        }

        //--------------------------------------------------------------------------
        // Public API
        //--------------------------------------------------------------------------

        return {
            Program: startFunction,
            FunctionDeclaration: startFunction,
            FunctionExpression: startFunction,
            ArrowFunctionExpression: startFunction,
            StaticBlock: startFunction,

            IfStatement(node) {
                if (node.parent.type !== "IfStatement") {
                    pushBlock(node);
                }
            },
            SwitchStatement: pushBlock,
            CatchClause: pushBlock,
            DoWhileStatement: pushBlock,
            WhileStatement: pushBlock,
            WithStatement: pushBlock,
            ForStatement: pushBlock,
            ForInStatement: pushBlock,
            ForOfStatement: pushBlock,
            ConditionalExpression: pushBlock,

            "IfStatement:exit": popBlock,
            "SwitchStatement:exit": popBlock,
            "CatchClause:exit": popBlock,
            "DoWhileStatement:exit": popBlock,
            "WhileStatement:exit": popBlock,
            "WithStatement:exit": popBlock,
            "ForStatement:exit": popBlock,
            "ForInStatement:exit": popBlock,
            "ForOfStatement:exit": popBlock,
            "ConditionalExpression:exit": popBlock,

            "FunctionDeclaration:exit": endFunction,
            "FunctionExpression:exit": endFunction,
            "ArrowFunctionExpression:exit": endFunction,
            "StaticBlock:exit": endFunction,
            "Program:exit": endFunction
        };

    }
};