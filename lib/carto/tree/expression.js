(function(tree) {

var _ = require('lodash');

tree.Expression = function Expression(value) {
    this.value = value;
};

tree.Expression.prototype = {
    is: 'expression',
    ev: function(env) {
        if (this.value.length > 1) {
            return new tree.Expression(this.value.map(function(e) {
                return e.ev(env);
            }));
        } else {
            return this.value[0].ev(env);
        }
    },

    toString: function(env) {
        var containsObj = false,
            mappedVal = this.value.map(function(e) {
                var result = e.toString(env);

                if (_.isObject(result)) {
                    containsObj = true;
                }
                return result;
            });

        if (containsObj) {
            return mappedVal;
        }
        return mappedVal.join(' ');
    }
};

})(require('../tree'));
