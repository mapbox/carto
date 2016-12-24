(function (tree) {
tree.Invalid = function Invalid(chunk, index, message, filename) {
    this.chunk = chunk;
    this.index = index;
    this.type = 'syntax';
    this.message = message || "Invalid code: " + this.chunk;
    this.filename = filename;
};

tree.Invalid.prototype.is = 'invalid';

tree.Invalid.prototype.ev = function(env) {
    env.error({
        chunk: this.chunk,
        index: this.index,
        type: 'syntax',
        message: this.message || "Invalid code: " + this.chunk,
        filename: this.filename
    });
    return {
        is: 'undefined'
    };
};
})(require('../tree'));
