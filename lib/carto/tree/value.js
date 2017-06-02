(function(tree) {

var _ = require('lodash');

tree.Value = function Value(value) {
    this.value = value;
    this.rule = null;
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
        var clone = Object.create(tree.Value.prototype);
        if (_.isArray(this.value)) {
            clone.value = [];
            _.forEach(this.value, function (v) {
                if (typeof v.clone === 'function') {
                    clone.value.push(v.clone());
                }
                else {
                    clone.value.push(v);
                }
            });
        }
        else {
            if (typeof this.value.clone === 'function') {
                clone.value = this.value.clone();
            }
            else {
                clone.value = this.value;
            }
        }
        clone.is = this.is;
        clone.rule = this.rule;
        return clone;
    },
    setRule: function (rule) {
        this.rule = rule;
        if (_.isArray(this.value)) {
            _.forEach(this.value, function (v) {
                if (typeof v.setRule === 'function') {
                    v.setRule(rule);
                }
            });
        }
        else {
            if (typeof this.value.setRule === 'function') {
                this.value.setRule(rule);
            }
        }
    }
};

})(require('../tree'));
