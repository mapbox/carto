(function(tree) {

var _ = require('lodash');

tree.Expression = function Expression(value) {
    this.value = value;
    this.rule = null;
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
    },

    clone: function () {
        var clone = Object.create(tree.Expression.prototype);
        clone.rule = this.rule;
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
        return clone;
    }
};

})(require('../tree'));
