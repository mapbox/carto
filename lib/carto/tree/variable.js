(function(tree) {

    var util = require('../util'),
        _ = require('lodash');

    var findSelector = function (ruleset) {
        if (ruleset.selectors.length && ruleset.selectors[0].elements.length) {
            return ruleset.selectors[0];
        }
        else {
            if (ruleset.parent) {
                return findSelector(ruleset.parent);
            }
            return null;
        }
    };

    var findFilter = function (ruleset) {
        if (ruleset.selectors.length && ruleset.selectors[0].filters) {
            return ruleset.selectors[0].filters;
        }
        else {
            if (ruleset.parent) {
                return findFilter(ruleset.parent);
            }
            return null;
        }
    };

    tree.Variable = function Variable(name, index, filename) {
        this.name = name;
        this.index = index;
        this.filename = filename;
        this.rule = null;
    };

    tree.Variable.prototype.is = 'variable';

    tree.Variable.prototype.toString = function() {
        return this.name;
    };

    tree.Variable.prototype.ev = function (env) {
        var that = this,
            variableDefs = [],
            ruleSpecificity = null;

        if (this._css) return this._css;

        _.forEach(_.filter(env.frames, function (f) {
            return f.name == that.name;
        }), function (f) {
            var selector = findSelector(f.parent),
                specificity = [0, 0, 0, tree.Zoom.all, f.index],
                parentSelectorSpecificity = null;

            if (f.parent.selectors.length) {
                parentSelectorSpecificity = f.parent.selectors[0].specificity(env);
            }

            if (selector) {
                selector = selector.elements;
                specificity = selector[0].specificity(env);
                if (specificity.length == 2 && parentSelectorSpecificity) {
                    specificity = [
                        specificity[0],
                        specificity[1],
                        parentSelectorSpecificity[2],
                        parentSelectorSpecificity[3],
                        parentSelectorSpecificity[4]
                    ];
                }
            }

            variableDefs.push({
                selector: selector,
                filter: findFilter(f.parent),
                specificity: specificity,
                rule: f
            });
        });
        if (variableDefs.length) {
            // only bother with complex evaluations if there is more than one alternative
            if (variableDefs.length > 1) {
                variableDefs.sort(tree.specificitySort);
                var rSpec = null;

                if (that.rule instanceof tree.Selector ||
                    that.rule instanceof tree.Definition) {
                    if (typeof that.rule.specificity === 'function') {
                        rSpec = that.rule.specificity(env);
                    }
                    else {
                        rSpec = that.rule.specificity;
                    }

                    ruleSpecificity = {
                        specificity: rSpec
                    };
                }
                else {
                    if (that.rule.parent && that.rule.parent.selectors.length) {
                        var pSpec = findSelector(that.rule.parent).specificity(env);

                        rSpec = that.rule.parent.selectors[0].specificity(env);
                        ruleSpecificity = {
                            specificity: [pSpec[0], pSpec[1], rSpec[2], rSpec[3], rSpec[4]]
                        };
                    }
                    else {
                        ruleSpecificity = {
                            specificity: [0, 0, 0, tree.Zoom.all, that.rule.index]
                        };
                    }
                }

                for (var i = 0; i < variableDefs.length &&
                     tree.specificitySort(variableDefs[i], ruleSpecificity) < 0; i++);
                i = Math.min(i, variableDefs.length - 1);

                return variableDefs[i].rule.value.ev(env);
            }
            else {
                return variableDefs[0].rule.value.ev(env);
            }
        } else {
            util.error(env, {
                message: 'variable ' + that.name + ' is undefined',
                index: that.index,
                filename: that.filename
            });
            return {
                is: 'undefined',
                value: 'undefined'
            };
        }
    };

    tree.Variable.prototype.setRule = function (rule) {
        this.rule = rule;
    };

    tree.Variable.prototype.clone = function () {
        return _.clone(this);
    };

})(require('../tree'));
