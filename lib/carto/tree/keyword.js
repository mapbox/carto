(function(tree) {

tree.Keyword = function Keyword(value) {
    this.value = value;
    var special = {
        'transparent': 'color',
        'true': 'boolean',
        'false': 'boolean'
    };
    this.is = special[value] ? special[value] : 'keyword';
    this.rule = null;
};
tree.Keyword.prototype = {
    ev: function() { return this; },
    toString: function() { return this.value; }
};
tree.Keyword.prototype.setRule = function (rule) {
    this.rule = rule;
    if (typeof this.value.setRule === 'function') {
        this.value.setRule(rule);
    }
};
tree.Keyword.prototype.clone = function () {
    var clone = Object.create(tree.Keyword.prototype);
    clone.is = this.is;
    clone.rule = this.rule;
    if (typeof this.value.clone === 'function') {
        clone.value = this.value.clone();
    }
    else {
        clone.value = this.value;
    }
    return clone;
};

})(require('../tree'));
