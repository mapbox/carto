(function(tree) {
var _ = require('lodash'),
    util = require('../util');

tree.Call = function Call(name, args, filename, index) {
    this.name = name;
    this.args = args;
    this.filename = filename;
    this.index = index;
};

tree.Call.prototype = {
    is: 'call',
    // When evuating a function call,
    // we either find the function in `tree.functions` [1],
    // in which case we call it, passing the  evaluated arguments,
    // or we simply print it out as it appeared originally [2].
    // The *functions.js* file contains the built-in functions.
    // The reason why we evaluate the arguments, is in the case where
    // we try to pass a variable to a function, like: `saturate(@color)`.
    // The function should receive the value, not the variable.
    'ev': function(env) {
        var args = this.args.map(function(a) { return a.ev(env); });

        for (var i = 0; i < args.length; i++) {
            if (args[i].is === 'undefined') {
                return {
                    is: 'undefined',
                    value: 'undefined'
                };
            }
        }

        if (this.name in tree.functions) {
            if (tree.functions[this.name].length <= args.length) {
                var val = tree.functions[this.name].apply(tree.functions, args);
                if (val === null) {
                    util.error(env, {
                        message: 'incorrect arguments given to ' + this.name + '()',
                        index: this.index,
                        filename: this.filename
                    });
                    return { is: 'undefined', value: 'undefined' };
                }
                return val;
            } else {
                util.error(env, {
                    message: 'incorrect number of arguments for ' + this.name +
                        '(). ' + tree.functions[this.name].length + ' expected.',
                    index: this.index,
                    filename: this.filename
                });
                return {
                    is: 'undefined',
                    value: 'undefined'
                };
            }
        } else {
            var fn = env.ref.functions[this.name];
            if (fn === undefined) {
                var functions = _.toPairs(env.ref.functions);
                // cheap closest, needs improvement.
                var name = this.name;
                var mean = functions.map(function(f) {
                    return [f[0], env.ref.editDistance(name, f[0]), f[1]];
                }).sort(function(a, b) {
                    return a[1] - b[1];
                });
                util.error(env, {
                    message: 'unknown function ' + this.name + '(), did you mean ' +
                        mean[0][0] + '(' + mean[0][2] + ')',
                    index: this.index,
                    filename: this.filename
                });
                return {
                    is: 'undefined',
                    value: 'undefined'
                };
            }
            if (fn !== args.length &&
                !(Array.isArray(fn) && _.includes(fn, args.length)) &&
                // support variable-arg functions like `colorize-alpha`
                fn !== -1) {
                util.error(env, {
                    message: 'function ' + this.name + '() takes ' +
                        fn + ' arguments and was given ' + args.length,
                    index: this.index,
                    filename: this.filename
                });
                return {
                    is: 'undefined',
                    value: 'undefined'
                };
            } else {
                // Save the evaluated versions of arguments
                this.args = args;
                return this;
            }
        }
    },

    toString: function() {
        if (this.args.length) {
            return this.name + '(' + this.args.join(',') + ')';
        } else {
            return this.name;
        }
    }
};

})(require('../tree'));
