(function(tree) {

tree.Comment = function Comment(value, silent) {
    this.value = value;
    this.silent = !!silent;
};

tree.Comment.prototype = {
    toString: function() {
        return '<!--' + this.value + '-->';
    },
    'ev': function() { return this; }
};

})(require('../tree'));
