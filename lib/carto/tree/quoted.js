(function(tree) {

tree.Quoted = function Quoted(content) {
    this.value = content || '';
    this.rule = null;
};

tree.Quoted.prototype = {
    is: 'string',

    toString: function(quotes) {
        var escapedValue = this.value
            .replace(/&/g, '&amp;')
        var xmlvalue = escapedValue
            .replace(/\'/g, '\\\'')
            .replace(/\"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/\>/g, '&gt;');
        return (quotes === true) ? "'" + xmlvalue + "'" : escapedValue;
    },

    'ev': function() {
        return this;
    },

    operate: function(env, op, other) {
        return new tree.Quoted(tree.operate(op, this.toString(), other.toString(this.contains_field)));
    },

    setRule: function (rule) {
        this.rule = rule;
        if (typeof this.value.setRule === 'function') {
            this.value.setRule(rule);
        }
    },

    clone: function () {
        var clone = Object.create(tree.Quoted.prototype);
        clone.rule = this.rule;
        if (typeof this.value.clone === 'function') {
            clone.value = this.value.clone();
        }
        else {
            clone.value = this.value;
        }
        return clone;
    }
};

})(require('../tree'));
