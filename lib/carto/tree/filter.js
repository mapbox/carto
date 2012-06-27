(function(tree) {

tree.Filter = function Filter(key, op, val, index, filename) {
    // TODO: figure out what the f
    this.key = key;
    this.op = op;
    this.index = index;
    this.filename = filename;
    this.val = val;

    this.id = this.key + this.op + this.val;
};


// xmlsafe, numeric, suffix
var ops = {
    '<': [' &lt; ', 'numeric'],
    '>': [' &gt; ', 'numeric'],
    '=': [' = ', 'both'],
    '!=': [' != ', 'both'],
    '<=': [' &lt;= ', 'numeric'],
    '>=': [' &gt;= ', 'numeric'],
    '=~': ['.match(', 'string', ')']
};

tree.Filter.prototype.toXML = function(env) {
    return (this.key.eval(env).toString(true)) +
        ops[this.op][0] + '' +
        (this.val.eval(env).toString(true)) +
        // This section is only for operators
        // which can wrap, like .match
        (ops[this.op][2] || '');
};

tree.Filter.prototype.toString = function() {
    return '[' + this.id + ']';
};

})(require('../tree'));
