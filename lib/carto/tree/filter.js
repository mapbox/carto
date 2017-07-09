(function(tree) {

var util = require('../util');

tree.Filter = function Filter(key, op, val, index, filename) {
    this.key = key;
    this.op = op;
    this.val = val;
    this.index = index;
    this.filename = filename;

    this.id = this.key + this.op + this.val;
};

// xmlsafe (removed), numeric, suffix
var ops = {
    '<': [' < ', 'numeric'],
    '>': [' > ', 'numeric'],
    '=': [' = ', 'both'],
    '!=': [' != ', 'both'],
    '<=': [' <= ', 'numeric'],
    '>=': [' >= ', 'numeric'],
    '=~': ['.match(', 'string', ')']
};

tree.Filter.prototype.ev = function(env) {
    this.key = this.key.ev(env);
    this.val = this.val.ev(env);
    return this;
};

tree.Filter.prototype.toObject = function(env) {
    if (env.ref.data.filter) {
        if (this.key.is === 'keyword' && -1 === env.ref.data.filter.value.indexOf(this.key.toString())) {
            util.error(env, {
                message: this.key.toString() + ' is not a valid keyword in a filter expression',
                index: this.index,
                filename: this.filename
            });
        }
        if (this.val.is === 'keyword' && -1 === env.ref.data.filter.value.indexOf(this.val.toString())) {
            util.error(env, {
                message: this.val.toString() + ' is not a valid keyword in a filter expression',
                index: this.index,
                filename: this.filename
            });
        }
    }
    var key = this.key.toString(false);
    var val = this.val.toString(this.val.is == 'string');

    if (
        (ops[this.op][1] == 'numeric' && isNaN(val) && this.val.is !== 'field') ||
        (ops[this.op][1] == 'string' && (val)[0] != "'")
    ) {
        util.error(env, {
            message: 'Cannot use operator "' + this.op + '" with value ' + this.val,
            index: this.index,
            filename: this.filename
        });
    }

    return key + ops[this.op][0] + val + (ops[this.op][2] || '');
};

tree.Filter.prototype.toString = function() {
    return '[' + this.id + ']';
};

})(require('../tree'));
