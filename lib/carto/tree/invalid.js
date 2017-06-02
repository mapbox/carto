(function (tree) {

var util = require('../util'),
    _ = require('lodash');

tree.Invalid = function Invalid(chunk, index, message, filename) {
    this.chunk = chunk;
    this.index = index;
    this.message = message || "Invalid code: " + this.chunk;
    this.filename = filename;
    this.rule = null;
};

tree.Invalid.prototype.is = 'invalid';

tree.Invalid.prototype.ev = function(env) {
    util.error(env, {
        chunk: this.chunk,
        index: this.index,
        message: this.message || "Invalid code: " + this.chunk,
        filename: this.filename
    });
    return {
        is: 'undefined'
    };
};

tree.Invalid.prototype.setRule = function (rule) {
    this.rule = rule;
};

tree.Invalid.prototype.clone = function () {
    return _.clone(this);
};
})(require('../tree'));
