(function(tree) {

tree.Field = function Field(content) {
    this.value = content || '';
    this.is = 'field';
};

tree.Field.prototype = {
    toString: function() {
        return '[' + this.value + ']';
    },
    'eval': function(env) {
        if (this.value.eval) {
            this.value = this.value.eval(env);
        }
        return this;
    }
};

})(require('../tree'));
