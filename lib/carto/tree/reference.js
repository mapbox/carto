// Carto pulls in a reference from the `mapnik-reference`
// module. This file builds indexes from that file for its various
// options, and provides validation methods for property: value
// combinations.
(function(tree) {

var _ = require('underscore'),
    mapnik_reference = require('mapnik-reference'),
    ref = {};

ref.setData = function(data) {
    ref.data = data;
    ref.selector_cache = generateSelectorCache(data);
    ref.child_cache = generateChildTypes(data);
    ref.pseudo_cache = generatePseudoElementCache(data);
    ref.mapnikFunctions = generateMapnikFunctions(data);
    ref.required_cache = generateRequiredProperties(data);
};

ref.setVersion = function(version) {
    if (mapnik_reference.version.hasOwnProperty(version)) {
        ref.setData(mapnik_reference.version[version]);
        return true;
    } else {
        return false;
    }
};

ref.selectorData = function(selector, element, i) {
    if (element) {
        if (ref.selector_cache.elements[element] &&
            ref.selector_cache.elements[element][selector]) {
            return ref.selector_cache.elements[element][selector][i]; 
        }
    }
    else if (ref.selector_cache.symbolizers[selector]) {
        return ref.selector_cache.symbolizers[selector][i];
    }
};

ref.pseudoElementData = function(pseudo, i) {
    if (ref.pseudo_cache[pseudo]) return ref.pseudo_cache[pseudo][i];
};

ref.validSelector = function(selector, element) {
    if (element) {
        return !!ref.selector_cache.elements[element][selector];
    }
    return !!ref.selector_cache.symbolizers[selector];
};
ref.selectorName = function(selector, element) { return ref.selectorData(selector, element, 2); };
ref.selector = function(selector, element) { return ref.selectorData(selector, element, 0); };
ref.selectorType = function(selector, element) { return ref.selectorData(selector, element, 1); };

ref.validElement = function(pseudo) { return !!ref.pseudo_cache[pseudo]; };
ref.elementName = function(pseudo) { return ref.pseudoElementData(pseudo, 1); };
ref.pseudoProperties = function(pseudo) { return ref.pseudoElementData(pseudo, 0); };

ref.elementSelectorName = function(type, selector) {
    return type + '/' + selector;
};

function generateSelectorCache(data) {
    var index = {'symbolizers': {}, 'elements': {}};
    for (var i in data.symbolizers) {
        for (var j in data.symbolizers[i]) {
            if (data.symbolizers[i][j].hasOwnProperty('css')) {
                index.symbolizers[data.symbolizers[i][j].css] = [data.symbolizers[i][j], i, j];
            }
        }
    }
    for (var i in data.elements) {
        index.elements[i] = {};
        for (var j in data.elements[i]) {
            if (data.elements[i][j].hasOwnProperty('css')) {
                index.elements[i][data.elements[i][j].css] = [data.elements[i][j], i, j];
            }
        }
    }
    return index;
}

function generatePseudoElementCache(data) {
    var index = {};
    for (var i in data.elements) {
        if (data.elements[i].pseudo) {
            for (var j in data.elements[i].pseudo) {
                index[j] = [data.elements[i].pseudo[j], i];
            }
        }
    }
    return index;
}

function generateMapnikFunctions(data) {
    var functions = {};
    for (var i in data.symbolizers) {
        for (var j in data.symbolizers[i]) {
            if (data.symbolizers[i][j].type === 'functions') {
                for (var k = 0; k < data.symbolizers[i][j].functions.length; k++) {
                    var fn = data.symbolizers[i][j].functions[k];
                    functions[fn[0]] = fn[1];
                }
            }
        }
    }
    for (var i in data.elements) {
        for (var j in data.elements[i]) {
            if (data.elements[i][j].type === 'functions') {
                for (var k = 0; k < data.elements[i][j].functions.length; k++) {
                    var fn = data.elements[i][j].functions[k];
                    functions[fn[0]] = fn[1];
                }
            }
        }
    }
    return functions;
}

function generateChildTypes(data) {
    var child_elements, cache = {};
    for (var name in data.symbolizers) {
        child_elements = data.symbolizers[name]['child-elements'];
        if (child_elements && child_elements.length) {
            cache[name] = child_elements;
        }
    }
    for (var name in data.elements) {
        child_elements = data.elements[name]['child-elements'];
        if (child_elements && child_elements.length) {
            cache[name] = child_elements;
        }
    }
    return cache;
}

ref.childTypes = function(name) {
    return ref.child_cache[name];
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
    for (var element_name in data.elements) {
        cache[element_name] = [];
        for (var j in data.elements[element_name]) {
            if (data.elements[element_name][j].required) {
                cache[element_name].push(data.elements[element_name][j].css);
            }
        }
    }
    return cache;
}

ref.requiredProperties = function(symbolizer_name, rules) {
    var req = ref.required_cache[symbolizer_name];
    for (var i in req) {
        if (!(req[i] in rules)) {
            return 'Property ' + req[i] + ' required for defining ' +
                symbolizer_name + ' styles.';
        }
    }
};

// TODO: finish implementation - this is dead code
ref._validateValue = {
    'font': function(env, value) {
        if (env.validation_data && env.validation_data.fonts) {
            return env.validation_data.fonts.indexOf(value) != -1;
        } else {
            return true;
        }
    }
};

ref.isFont = function(selector, element) {
    return ref.selector(selector, element).validate == 'font';
};

// https://gist.github.com/982927
ref.editDistance = function(a, b){
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

function validateFunctions(value, selector, element) {
    if (value.value[0].is === 'string') return true;
    for (var i in value.value) {
        for (var j in value.value[i].value) {
            if (value.value[i].value[j].is !== 'call') return false;
            var f = _.find(ref
                .selector(selector, element).functions, function(x) {
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

function validateKeyword(value, selector, element) {
    if (typeof ref.selector(selector, element).type === 'object') {
        return ref.selector(selector, element).type
            .indexOf(value.value[0].value) !== -1;
    } else {
        // allow unquoted keywords as strings
        return ref.selector(selector, element).type === 'string';
    }
}

ref.validValue = function(env, selector, element, value) {
    var i, j;
    // TODO: handle in reusable way
    if (!ref.selector(selector, element)) {
        return false;
    } else if (value.value[0].is == 'keyword') {
        return validateKeyword(value, selector, element);
    } else if (value.value[0].is == 'undefined') {
        // caught earlier in the chain - ignore here so that
        // error is not overridden
        return true;
    } else if (ref.selector(selector, element).type == 'numbers') {
        for (i in value.value) {
            if (value.value[i].is !== 'float') {
                return false;
            }
        }
        return true;
    } else if (ref.selector(selector, element).type == 'tags') {
        if (!value.value) return false;
        if (!value.value[0].value) {
            return value.value[0].is === 'tag';
        }
        for (i = 0; i < value.value[0].value.length; i++) {
            if (value.value[0].value[i].is !== 'tag') return false;
        }
        return true;
    } else if (ref.selector(selector, element).type == 'functions') {
        // For backwards compatibility, you can specify a string for `functions`-compatible
        // values, though they will not be validated.
        return validateFunctions(value, selector, element);
    } else if (ref.selector(selector, element).type === 'expression') {
        return true;
    } else if (ref.selector(selector, element).type === 'unsigned') {
        if (value.value[0].is === 'float') {
            value.value[0].round();
            return true;
        } else {
            return false;
        }
    } else {
        if (ref.selector(selector, element).validate) {
            var valid = false;
            for (i = 0; i < value.value.length; i++) {
                if (ref.selector(selector, element).type == value.value[i].is &&
                    ref
                        ._validateValue
                            [ref.selector(selector, element).validate]
                            (env, value.value[i].value)) {
                    return true;
                }
            }
            return valid;
        } else {
            return ref.selector(selector, element).type == value.value[0].is;
        }
    }
};

ref.setVersion('latest');

tree.Reference = ref;

})(require('../tree'));
