// Carto needs a reference to validate input.
// The reference can be either `mapnik-reference` or customly set.
// This file builds indexes from that file for its various
// options, and provides validation methods for property: value
// combinations.
(function(tree) {

var _ = require('lodash'),
    semver = require('semver');

tree.Reference = function Reference(ref) {
    this.data = null;
    this.selector_cache = [];
    this.functions = [];
    this.required_cache = [];

    if (!_.isNil(ref)) {
        if (this.checkCompliance(ref)) {
            this.compliant = true;
            this.ref = ref;
        }
        // fall back to Mapnik reference if non-compliant reference was given
        else {
            this.compliant = false;
            this.ref = require('mapnik-reference');
        }
    }
    // use Mapnik reference if no reference given
    else {
        this.compliant = true;
        this.ref = require('mapnik-reference');
    }
};

tree.Reference.prototype.checkCompliance = function (ref) {
    if (_.has(ref, 'latest') && _.has(ref, 'versions') &&
        _.isArray(ref.versions) && _.has(ref, 'load') &&
        _.isFunction(ref.load)) {
            var data = ref.load(ref.latest);
            if (_.has(data, 'version') && _.isString(data.version) &&
                _.has(data, 'style') && _.isObject(data.style) &&
                _.has(data, 'layer') && _.isObject(data.layer) &&
                _.has(data, 'symbolizers') && _.isObject(data.symbolizers) &&
                _.has(data, 'colors') && _.isObject(data.colors) &&
                _.has(data, 'datasources') && _.isObject(data.datasources)) {

                return true;
            }
    }

    return false;
};

tree.Reference.prototype.getLatest = function () {
    return this.ref.latest;
};

tree.Reference.prototype.setData = function (data) {
    this.data = data;
    this.selector_cache = generateSelectorCache(data);
    this.functions = generateFunctions(data);

    this.functions.matrix = [6];
    this.functions.translate = [1, 2];
    this.functions.scale = [1, 2];
    this.functions.rotate = [1, 3];
    this.functions.skewX = [1];
    this.functions.skewY = [1];

    this.required_cache = generateRequiredProperties(data);
};

tree.Reference.prototype.setVersion = function (version) {
    if (semver.valid(version)) {
        try {
            this.setData(this.ref.load(version));
        }
        catch (err) {
            var e = new Error('Version ' + version + ' is not supported');
            e.stack = null; // do not show stack trace
            throw e;
        }
    }
    else {
        var apiErr = new Error('Invalid API version. A valid version is e.g. 3.0.0 or 3.0.10');
        apiErr.stack = null; // do not show stack trace
        throw apiErr;
    }
};

tree.Reference.prototype.selectorData = function (selector, i) {
    if (this.selector_cache[selector]) return this.selector_cache[selector][i];
};

tree.Reference.prototype.validSelector = function (selector) { return !!this.selector_cache[selector]; };
tree.Reference.prototype.selectorName = function (selector) { return this.selectorData(selector, 3); };
tree.Reference.prototype.selector = function (selector) { return this.selectorData(selector, 1); };
tree.Reference.prototype.symbolizer = function (selector) { return this.selectorData(selector, 2); };

function generateSelectorCache(data) {
    var index = {};
    _.forEach(data.style, function (rule, i) {
        if (_.has(rule, 'css')) {
            index[rule.css] = ['style', rule, '*', i];
        }
    });
    _.forEach(data.layer, function (rule, i) {
        if (_.has(rule, 'css')) {
            index[rule.css] = ['layer', rule, '*', i];
        }
    });
    _.forEach(data.symbolizers, function (symbolizer, i) {
        _.forEach(symbolizer, function (rule, j) {
            if (_.has(rule, 'css')) {
                index[rule.css] = ['symbolizer', rule, i, j];
            }
        });
    });
    return index;
}

function generateFunctions(data) {
    var functions = {};
    _.forEach(data.style, function (rule) {
        if (rule.type === 'functions') {
            _.forEach(rule.functions, function (func) {
                functions[func[0]] = func[1];
            });
        }
    });
    _.forEach(data.layer, function (rule) {
        if (rule.type === 'functions') {
            _.forEach(rule.functions, function (func) {
                functions[func[0]] = func[1];
            });
        }
    });
    _.forEach(data.symbolizers, function (symbolizer) {
        _.forEach(symbolizer, function (rule) {
            if (rule.type === 'functions') {
                _.forEach(rule.functions, function (func) {
                    functions[func[0]] = func[1];
                });
            }
        });
    });
    return functions;
}

function generateRequiredProperties(data) {
    var cache = {};
    for (var symbolizer_name in data.symbolizers) {
        cache[symbolizer_name] = [];
        for (var j in data.symbolizers[symbolizer_name]) {
            if (data.symbolizers[symbolizer_name][j].required) {
                cache[symbolizer_name].push(data.symbolizers[symbolizer_name][j].css);
            }
        }
    }
    return cache;
}

tree.Reference.prototype.requiredProperties = function (symbolizer_name, rules) {
    var req = this.required_cache[symbolizer_name];
    for (var i in req) {
        if (!(req[i] in rules)) {
            return 'Property ' + req[i] + ' required for defining ' +
                symbolizer_name + ' styles.';
        }
    }
};

// TODO: finish implementation - this is dead code
tree.Reference.prototype._validateValue = {
    'font': function(env, value) {
        if (env.validation_data && env.validation_data.fonts) {
            return env.validation_data.fonts.indexOf(value) != -1;
        } else {
            return true;
        }
    }
};

tree.Reference.prototype.isFont = function (selector) {
    return this.selector(selector).validate == 'font';
};

// https://gist.github.com/982927
tree.Reference.prototype.editDistance = function (a, b){
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    var matrix = [];
    for (var i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (var j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i-1) == a.charAt(j-1)) {
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                    Math.min(matrix[i][j-1] + 1, // insertion
                    matrix[i-1][j] + 1)); // deletion
            }
        }
    }
    return matrix[b.length][a.length];
};

function validateFunctions(ref, value, selector) {
    if (value.value[0].is === 'string') return true;
    for (var i in value.value) {
        for (var j in value.value[i].value) {
            if (value.value[i].value[j].is !== 'call') return false;
            var f = _.find(ref
                .selector(selector).functions, function(x) {
                    return x[0] == value.value[i].value[j].name;
                });
            if (!(f && f[1] == -1)) {
                // This filter is unknown or given an incorrect number of arguments
                if (!f || f[1] !== value.value[i].value[j].args.length) return false;
            }
        }
    }
    return true;
}

function validateKeyword(ref, value, selector) {
    if (typeof ref.selector(selector).type === 'object') {
        return ref.selector(selector).type
            .indexOf(value.value[0].value) !== -1;
    } else {
        // allow unquoted keywords as strings
        return ref.selector(selector).type === 'string' ||
            ref.selector(selector)['default-value'] === value.value[0].value;
    }
}

tree.Reference.prototype.selectorStatus = function (selector) {
    var selectorRef = this.selector(selector);

    if (_.has(selectorRef, 'status')) {
        return selectorRef.status;
    }

    return 'stable';
};

tree.Reference.prototype.validValue = function (env, selector, value) {
    var i;
    // TODO: handle in reusable way
    if (!this.selector(selector)) {
        return false;
    } else if (value.value[0].is == 'keyword') {
        return validateKeyword(this, value, selector);
    } else if (value.value[0].is == 'undefined') {
        // caught earlier in the chain - ignore here so that
        // error is not overridden
        return true;
    } else if (this.selector(selector).type == 'numbers') {
        for (i in value.value) {
            if (value.value[i].is !== 'float') {
                return false;
            }
        }
        return true;
    } else if (this.selector(selector).type == 'tags') {
        if (!value.value) return false;
        if (!value.value[0].value) {
            return value.value[0].is === 'tag';
        }
        for (i = 0; i < value.value[0].value.length; i++) {
            if (value.value[0].value[i].is !== 'tag') return false;
        }
        return true;
    } else if (this.selector(selector).type == 'functions') {
        // For backwards compatibility, you can specify a string for `functions`-compatible
        // values, though they will not be validated.
        return validateFunctions(this.ref, value, selector);
    } else if (this.selector(selector).type === 'unsigned') {
        if (value.value[0].is === 'float') {
            value.value[0].round();
            return true;
        } else {
            return false;
        }
    } else if ((this.selector(selector).expression)) {
        return true;
    } else {
        if (this.selector(selector).validate) {
            for (i = 0; i < value.value.length; i++) {
                if (this.selector(selector).type == value.value[i].is &&
                    this._validateValue[this.selector(selector).validate](env, value.value[i].value)) {
                    return true;
                }
            }
            return false;
        } else {
            return this.selector(selector).type == value.value[0].is;
        }
    }
};
})(require('../tree'));
