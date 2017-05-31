(function(tree) {

var util = require('../util');

tree.Variable = function Variable(name, index, filename) {
    this.name = name;
    this.index = index;
    this.filename = filename;
};

tree.Variable.prototype = {
    is: 'variable',
    toString: function() {
        return this.name;
    },
    ev: function(env) {
        if (this._css) return this._css;

        var thisframe = env.frames.filter(function(f) {
            return f.name == this.name;
        }.bind(this));
        if (thisframe.length) {
            return thisframe[thisframe.length - 1].value.ev(env);
        } else {
            util.error(env, {
                message: 'variable ' + this.name + ' is undefined',
                index: this.index,
                filename: this.filename
            });
            return {
                is: 'undefined',
                value: 'undefined'
            };
        }
    }
};

})(require('../tree'));
