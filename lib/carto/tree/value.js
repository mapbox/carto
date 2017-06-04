(function(tree) {

var _ = require('lodash');

tree.Value = function Value(value) {
    this.value = value;
};

tree.Value.prototype = {
    is: 'value',
    ev: function(env) {
        if (this.value.length === 1) {
            return this.value[0].ev(env);
        } else {
            return new tree.Value(this.value.map(function(v) {
                return v.ev(env);
            }));
        }
    },
    toString: function(env, selector, sep, format) {
        var containsObj = false,
            mappedVal = this.value.map(function(e) {
                var result = e.toString(env, format);

                if (_.isObject(result)) {
                    containsObj = true;
                }
                return result;
            });

        if (containsObj) {
            return _.flatten(mappedVal);
        }
        return mappedVal.join(sep || ', ');
    },
    clone: function() {
        var obj = Object.create(tree.Value.prototype);
        if (Array.isArray(obj)) obj.value = this.value.slice();
        else obj.value = this.value;
        obj.is = this.is;
        return obj;
    }
};

})(require('../tree'));
