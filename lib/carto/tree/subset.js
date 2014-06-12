(function(tree) {

tree.Subset = function Subset(symbolizer, pseudoelements, rules, subsets) {
    if (symbolizer) {
        var parts = symbolizer.split('/');
        this.symbolizer = parts.pop();
        this.instance = parts.length ? parts[0] : '__default__';
    }
    this.pseudoelements = pseudoelements || [];
    this.rules = rules || [];
    this.subsets = subsets || [];
};

tree.Subset.prototype.collectRules = function(rules) {
    var start = rules.length;
    for (i = 0; i < this.rules.length; i++) {
        var rule = this.rules[i];

        if (rule instanceof tree.Subset) {
            rule.collectRules(rules);
        } else if (rule instanceof tree.Rule) {
            rules.push(rule);
        }
    }
    for (i = start; i < rules.length; i++) {
        var rule = rules[i];
        if (this.pseudoelements.length) {
            if (rule.pseudoelements.length) {
                rule.pseudoelements = this.pseudoelements.concat(rule.pseudoelements);
            }
            else {
                rule.pseudoelements = this.pseudoelements;
                rule.pseudoname = this.pseudoelements[this.pseudoelements.length - 1].name;
            }
        }
        if (this.symbolizer) {
            rule.symbolizer = this.symbolizer;
            rule.instance = this.instance;
        }
    }
};

})(require('../tree'));
