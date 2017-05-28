// An operation is an expression with an op in between two operands,
// like 2 + 1.
(function(tree) {

var util = require('../util');

tree.Operation = function Operation(op, operands, index, filename) {
    this.op = op.trim();
    this.operands = operands;
    this.index = index;
    this.filename = filename;
};

tree.Operation.prototype.is = 'operation';

tree.Operation.prototype.ev = function(env) {
    var a = this.operands[0].ev(env),
        b = this.operands[1].ev(env),
        temp;

    if (a.is === 'undefined' || b.is === 'undefined') {
        return {
            is: 'undefined',
            value: 'undefined'
        };
    }

    if (a instanceof tree.Dimension && b instanceof tree.Color) {
        if (this.op === '*' || this.op === '+') {
            temp = b, b = a, a = temp;
        } else {
            util.error(env, {
                name: "OperationError",
                message: "Can't substract or divide a color from a number",
                index: this.index,
                filename: this.filename
            });
        }
    }

    // Only concatenate plain strings, because this is easily
    // pre-processed
    if (a instanceof tree.Quoted && b instanceof tree.Quoted && this.op !== '+') {
        util.error(env, {
           message: "Can't subtract, divide, or multiply strings.",
           index: this.index,
           filename: this.filename
        });
        return {
            is: 'undefined',
            value: 'undefined'
        };
    }

    // Fields, literals, dimensions, and quoted strings can be combined.
    if (a instanceof tree.Field || b instanceof tree.Field ||
        a instanceof tree.Literal || b instanceof tree.Literal) {
        if (a.is === 'color' || b.is === 'color') {
            util.error(env, {
               message: "Can't subtract, divide, or multiply colors in expressions.",
               index: this.index,
               filename: this.filename
            });
            return {
                is: 'undefined',
                value: 'undefined'
            };
        } else {
            return new tree.Literal(a.ev(env).toString(true) + this.op + b.ev(env).toString(true));
        }
    }

    if (a.operate === undefined) {
        util.error(env, {
           message: 'Cannot do math with type ' + a.is + '.',
           index: this.index,
           filename: this.filename
        });
        return {
            is: 'undefined',
            value: 'undefined'
        };
    }

    return a.operate(env, this.op, b);
};

tree.Operation.prototype.toString = function () {
    return this.operands[0].toString() + this.op  + this.operands[1].toString();
};

tree.operate = function(op, a, b) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '%': return a % b;
        case '/': return a / b;
    }
};

})(require('../tree'));
