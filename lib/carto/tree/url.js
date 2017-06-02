(function(tree) {

tree.URL = function URL(val, paths) {
    this.value = val;
    this.paths = paths;
    this.rule = null;
};

tree.URL.prototype = {
    is: 'uri',
    toString: function() {
        return this.value.toString();
    },
    ev: function(ctx) {
        return new tree.URL(this.value.ev(ctx), this.paths);
    },
    setRule: function (rule) {
        this.rule = rule;
        if (typeof this.value.setRule === 'function') {
            this.value.setRule(rule);
        }
    },
    clone: function () {
        var clone = Object.create(tree.URL.prototype);
        clone.rule = this.rule;
        clone.paths = this.paths;
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
