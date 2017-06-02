(function(tree) {

var _ = require('lodash');

tree._flattenFontArray = function (fonts) {
    var result = [];

    for (var i = 0; i < fonts.length; i++) {
        if (Array.isArray(fonts[i].value)) {
            result = result.concat(tree._flattenFontArray(fonts[i].value));
        } else {
            result.push(fonts[i]);
        }
    }
    return result;
}

tree._getFontSet = function(env, fonts) {
    var fontKey = fonts.join('');
    if (env._fontMap && env._fontMap[fontKey]) {
        return env._fontMap[fontKey];
    }

    var new_fontset = new tree.FontSet(env, tree._flattenFontArray(fonts));
    env.effects.push(new_fontset);
    if (!env._fontMap) env._fontMap = {};
    env._fontMap[fontKey] = new_fontset;
    return new_fontset;
};

tree.FontSet = function FontSet(env, fonts) {
    this.fonts = fonts;
    this.name = 'fontset-' + env.effects.length;
    this.rule = null;
};

tree.FontSet.prototype.toObject = function() {
    return {
        '_name': 'FontSet',
        '_attributes': {
            name: this.name
        },
        '_content': this.fonts.map(function (f) {
                return {
                    '_name': 'Font',
                    '_attributes': {
                        'face-name': f.value
                    }
                }
            })
    };
};

tree.FontSet.prototype.setRule = function (rule) {
    this.rule = rule;
    _.forEach(this.fonts, function (f) {
        if (typeof f.setRule === 'function') {
            f.setRule(rule);
        }
    });
};

tree.FontSet.prototype.clone = function () {
    var clone = Object.create(tree.FontSet.prototype);
    clone.rule = this.rule;
    clone.name = this.name;
    clone.fonts = [];
    _.forEach(this.fonts, function (f) {
        if (typeof f.clone === 'function') {
            clone.fonts.push(f.clone());
        }
        else {
            clone.fonts.push(f);
        }
    });
    return clone;
};

})(require('../tree'));
