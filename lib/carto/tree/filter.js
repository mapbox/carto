(function(tree) {

tree.Filter = function Filter(key, op, val, index, filename) {
    this.key = key;
    this.op = op;
    this.index = index;
    this.filename = filename;
    this.val = val;
    this.id = key + op;
};

function concat(x) { return function(b) { return x + b; }; }

var ops = {
    '<':  [concat(' &lt; '), 'numeric'],
    '>':  [concat(' &gt; '), 'numeric'],
    '=':  [concat(' = '), 'both'],
    '!=': [concat(' != '), 'both'],
    '<=': [concat(' &lt;= '), 'numeric'],
    '>=': [concat(' &gt;= '), 'numeric'],
    '=~': [function(x) {
        return '.match(' + x + ')';
    }, 'string']
};

tree.Filter.prototype.toXML = function(env) {
    var val = this.val.eval(env),
        key = this.key.eval(env);

    if ((ops[this.op][1] == 'numeric' && isNaN(val)) ||
        (ops[this.op][1] == 'string' && (val || val)[0] != "'")) {
        env.error({
            message: 'Cannot use operator "' + this.op + '" with value ' + val,
            index: this.index,
            filename: this.filename
        });
    }

    return key + ops[this.op][0](val);
};

tree.Filter.prototype.toString = function() {
    return '[' + this.id + ']';
};

})(require('../tree'));
