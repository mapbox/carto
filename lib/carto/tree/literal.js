// A literal is a literal string for Mapnik - the
// result of the combination of a `tree.Field` with any
// other type.
(function(tree) {

tree.Literal = function Field(content) {
    this.value = content || '';
    this.is = 'field';
    this.rule = null;
};

tree.Literal.prototype = {
    toString: function() {
        return this.value;
    },
    'ev': function() {
        return this;
    }
};

tree.Literal.prototype.setRule = function (rule) {
    this.rule = rule;
    if (typeof this.value.setRule === 'function') {
        this.value.setRule(rule);
    }
};

tree.Literal.prototype.clone = function () {
    var clone = Object.create(tree.Literal.prototype);
    clone.is = this.is;
    clone.rule = this.rule;
    if (typeof this.value.clone === 'function') {
        clone.value = this.value.clone();
    }
    else {
        clone.value = this.value;
    }
};

})(require('../tree'));
