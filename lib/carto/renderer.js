var _ = require('lodash'),
    carto = require('./index'),
    util = require('./util');

carto.Renderer = function Renderer(options) {
    this.env = {};
    this.options = options || {};

    // load different reference if given
    if (_.has(this.options, 'reference') && !_.isNil(this.options.reference)) {
        this.ref = new carto.tree.Reference(this.options.reference);
    }
    else {
        this.ref = new carto.tree.Reference();
    }

    this.options.version = this.options.version || this.ref.getLatest();
    this.options.outputFormat = this.options.outputFormat || 'mapnik';

    this.env.ref = this.ref;
    if (_.has(this.options, 'quiet') && _.isBoolean(this.options.quiet)) {
        this.env.quiet = this.options.quiet;
        _.unset(this.options.quiet);
    }
    if (_.has(this.options, 'benchmark') && _.isBoolean(this.options.benchmark)) {
        this.env.benchmark = this.options.benchmark;
        _.unset(this.options.benchmark);
    }
    if (_.has(this.options, 'validationData')) {
        this.env.validation_data = this.options.validationData;
        _.unset(this.options.validationData);
    }
    if (_.has(this.options, 'ppi')) {
        this.env.ppi = this.options.ppi;
        _.unset(this.options.ppi);
    }
    if (_.has(this.options, 'effects')) {
        this.env.effects = this.options.effects;
        _.unset(this.options.effects);
    }
    if (_.has(this.options, 'filename')) {
        this.env.filename = this.options.filename;
        _.unset(this.options.filename);
    }
};

/**
 * Prepare a MSS document (given as an string) into a
 * XML Style fragment (mostly useful for debugging)
 *
 * @param {String} data the mss contents as a string.
 */
carto.Renderer.prototype.renderMSS = function render(data) {
    // effects is a container for side-effects, which currently
    // are limited to FontSets.
    var env = _(this.env).defaults({
        benchmark: false,
        validation_data: false,
        effects: [],
        quiet: false,
    }).value();

    try {
        this.ref.setVersion(this.options.version);
    }
    catch (err) {
        util.error(env, {
            message: err.message
        });
        return {
            msg: env.msg,
            data: null
        };
    }

    // check if given reference is compliant with expectations
    if (!this.ref.compliant) {
        util.error(env, {
            message: 'Could not use the given reference, because it does not adhere to the specification. See the documentation for details.'
        });
        return {
            msg: env.msg,
            data: null
        };
    }

    var output = [];
    var styles = [];

    try {

        if (env.benchmark) console.time('Parsing MSS');
        var parser = (carto.Parser(env)).parse(data);
        if (env.benchmark) console.timeEnd('Parsing MSS');

        if (env.benchmark) console.time('Rule generation');
        var rule_list = parser.toList(env);
        if (env.benchmark) console.timeEnd('Rule generation');

        if (env.benchmark) console.time('Rule inheritance');
        var rules = inheritDefinitions(rule_list, env);
        if (env.benchmark) console.timeEnd('Rule inheritance');

        if (env.benchmark) console.time('Style sort');
        var sorted = sortStyles(rules);
        if (env.benchmark) console.timeEnd('Style sort');

        if (env.benchmark) console.time('Total Style generation');
        for (var k = 0, rule, style_name; k < sorted.length; k++) {
            rule = sorted[k];
            style_name = 'style' + (rule.attachment !== '__default__' ? '-' + rule.attachment : '');
            styles.push(style_name);
            var bench_name = '\tStyle "'+style_name+'" (#'+k+') toXML';
            if (env.benchmark) console.time(bench_name);
            // env.effects can be modified by this call
            output.push(carto.tree.StyleObject(style_name, rule.attachment, rule, env));
            if (env.benchmark) console.timeEnd(bench_name);
        }
        if (env.benchmark) console.timeEnd('Total Style generation');

        if (!util.hasErrors(env.msg)) {
            switch (this.options.outputFormat) {
                case 'json':
                    output = JSON.stringify(output, null, 2);
                    break;
                case 'mapnik':
                default:
                    output = util.jsonToXML(output);
                    break;
            }
        }
        else {
            output = null;
        }

        return {
            msg: env.msg,
            data: output
        };
    }
    catch (err) {
        // do not swallow program errors
        if (err.message !== 'N/A') {
            throw err;
        }

        return {
            msg: env.msg,
            data: null
        };
    }
};

/**
 * Prepare a MML document (given as an object) into a
 * fully-localized XML file ready for Mapnik consumption
 *
 * @param {String} m - the JSON file as a string.
 */
carto.Renderer.prototype.render = function render(m) {
    // effects is a container for side-effects, which currently
    // are limited to FontSets.
    var env = _(this.env).defaults({
        benchmark: false,
        validation_data: false,
        effects: [],
        ppi: 90.714,
        quiet: false
    }).value();

    try {
        this.ref.setVersion(this.options.version);
    }
    catch (err) {
        util.error(env, {
            message: err.message
        });
        return {
            msg: env.msg,
            data: null
        };
    }

    // check if given reference is compliant with expectations
    if (!this.ref.compliant) {
        util.error(env, {
            message: 'Could not use the given reference, because it does not adhere to the specification. See the documentation for details.'
        });
        return {
            msg: env.msg,
            data: null
        };
    }

    var output = [];
    var definitions = [];

    function appliesTo(name, classIndex, zoom) {
        return function(definition) {
            return definition.appliesTo(name, classIndex, zoom);
        };
    }

    try {
        // Transform stylesheets into definitions.
        if (_.has(m, 'Stylesheet') && !_.isNil(m.Stylesheet)) {
            m.Stylesheet = _.castArray(m.Stylesheet);


            definitions = _(m.Stylesheet).chain()
                .map(function(s) {
                    if (_.isString(s) || !_.has(s, 'id') || !_.has(s, 'data') || _.isNil(s.id) || _.isNil(s.data)) {
                        util.error(env, {
                            message: "Expecting a stylesheet object of the form { id: 'x', 'data': 'y' } for the Stylesheet property."
                        });
                        throw new Error('N/A');
                    }
                    // Passing the environment from stylesheet to stylesheet,
                    // allows frames and effects to be maintained.
                    env = _(env).extend({filename:s.id}).value();

                    var time = +new Date(),
                        root = (carto.Parser(env)).parse(s.data);
                    if (env.benchmark)
                        console.warn('Parsing time: ' + (new Date() - time) + 'ms');
                    return root.toList(env);
                })
                .flatten()
                .value();
        }

        // Iterate through layers and create styles custom-built
        // for each of them, and apply those styles to the layers.
        var styles, l, classIndex, rules, sorted, matching;
        for (var i = 0; i < m.Layer.length; i++) {
            l = m.Layer[i];
            styles = [];

            if (_.has(l, 'id')) {
                l.layerId = l.id;
            }
            else {
                util.error(env, {
                    message: 'The id attribute is required for layers.'
                });

                return {
                    msg: env.msg,
                    data: null
                };
            }

            if (definitions.length > 0) {
                classIndex = {};

                if (env.benchmark) console.warn('processing layer: ' + l.id);
                // Classes are given as space-separated alphanumeric strings.
                var classes = (l['class'] || '').split(/\s+/g);
                for (var j = 0; j < classes.length; j++) {
                    classIndex[classes[j]] = true;
                }
                // compile zoom range if given
                var zoom = 0,
                    min = 0,
                    max = Infinity,
                    minOrMaxZoom = false;

                if (_.has(l, 'properties')) {
                    if (_.has(l.properties, 'minzoom') && l.properties.minzoom > 0) {
                        min = l.properties.minzoom;
                        minOrMaxZoom = true;
                    }
                    if (_.has(l.properties, 'maxzoom') && l.properties.maxzoom <= carto.tree.Zoom.maxZoom) {
                        max = l.properties.maxzoom;
                        minOrMaxZoom = true;
                    }
                }

                if (minOrMaxZoom) {
                    for (var z = 0; z <= carto.tree.Zoom.maxZoom; z++) {
                        if (z >= min && z <= max) {
                            zoom |= (1 << z);
                        }
                    }
                    matching = definitions.filter(appliesTo(l.layerId, classIndex, zoom));
                }
                else {
                    matching = definitions.filter(appliesTo(l.layerId, classIndex));
                }

                rules = inheritDefinitions(matching, env);
                sorted = sortStyles(rules);

                if (sorted.length == 0) {
                    util.warning(env, {
                        message: 'Layer ' + l.layerId + ' has no styles associated with it.'
                    });
                }

                for (var k = 0, rule, style_name; k < sorted.length; k++) {
                    rule = foldStyle(sorted[k]);
                    style_name = l.layerId + (rule.attachment !== '__default__' ? '-' + rule.attachment : '');

                    // env.effects can be modified by this call
                    var styleObj = carto.tree.StyleObject(style_name, rule.attachment, rule, env);

                    if (Object.keys(styleObj).length) {
                        output.push(styleObj);
                        styles.push(style_name);
                    }
                }
            }

            // if there is a global _properties object for this layer take it into account
            if (_.has(m, '_properties') && _.has(m._properties, l.layerId)) {
                if (!_.has(l, 'properties')) {
                    l.properties = {};
                }
                var props = {};
                _.assign(props, m._properties[l.layerId], l.properties);
                l.properties = props;
            }

            output.push(carto.tree.LayerObject(l, styles, this.ref.data['version']));
        }

        if (env.effects.length) {
            output = _.concat(env.effects.map(function(e) {
                return e.toObject(env);
            }), output);
        }

        var map_properties = getMapProperties(m, definitions, this.ref.data.symbolizers.map, env);

        if (!util.hasErrors(env.msg)) {

            // Pass TileJSON and other custom parameters through to Mapnik XML.
            var parameters = _(m).reduce(function(memo, v, k) {
                if (!v && v !== 0) return memo;

                switch (k) {
                // Known skippable properties.
                case 'srs':
                case 'Layer':
                case 'Stylesheet':
                    break;
                // Non URL-bound TileJSON properties.
                case 'bounds':
                case 'center':
                case 'minzoom':
                case 'maxzoom':
                case 'version':
                case 'name':
                case 'description':
                case 'legend':
                case 'attribution':
                case 'template':
                case 'format':
                    memo.push({
                        '_name': 'Parameter',
                        '_attributes': {
                            'name': k
                        },
                        '_content': v
                    });
                    break;
                case 'interactivity':
                    memo.push({
                        '_name': 'Parameter',
                        '_attributes': {
                            'name': 'interactivity_layer'
                        },
                        '_content': v.layer
                    });
                    memo.push({
                        '_name': 'Parameter',
                        '_attributes': {
                            'name': 'interactivity_fields'
                        },
                        '_content': v.fields
                    });
                    break;
                // Support any additional scalar properties.
                default:
                    if ('string' === typeof v || 'number' === typeof v || 'boolean' === typeof v) {
                        memo.push({
                            '_name': 'Parameter',
                            '_attributes': {
                                'name': k
                            },
                            '_content': v
                        });
                    }
                    break;
                }
                return memo;
            }, []);
            if (parameters.length) {
                output.unshift({
                    '_name': 'Parameters',
                    '_content': parameters
                });
            }

            // issue warnings for definitions that do not match layers
            _.forEach(definitions, function (v) {
                if (v.matchCount == 0) {
                    var selectorName = '',
                        filename = null,
                        index = null;

                    if (_.isArray(v.elements) && v.elements.length > 0) {
                        selectorName = v.elements[v.elements.length - 1].value;
                    }
                    if (_.isArray(v.rules) && v.rules.length > 0) {
                        filename = v.rules[0].filename;
                        index = v.rules[0].index;
                    }
                    util.warning(env, {
                        message: 'Styles do not match layer selector ' + selectorName + '.',
                        filename: filename,
                        index: index
                    });
                }
            });

            output =  {
                '_name': 'Map',
                '_attributes': map_properties,
                '_content': output
            };

            switch (this.options.outputFormat) {
                case 'json':
                    output = JSON.stringify(output, null, 2);
                    break;
                case 'mapnik':
                default:
                    output = '<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE Map[]>\n' + util.jsonToXML(output);
                    break;
            }

        }
        else {
            output = null;
        }

        return {
            msg: env.msg,
            data: output
        };
    }
    catch (err) {
        // do not swallow program errors
        if (err.message !== 'N/A') {
            throw err;
        }

        return {
            msg: env.msg,
            data: null
        };
    }
};

/**
 * This function currently modifies 'current'
 * @param {Array}  current  current list of rules
 * @param {Object} definition a Definition object to add to the rules
 * @param {Object} byFilter an object/dictionary of existing filters. This is
 * actually keyed `attachment->filter`
*/
function addRules(current, definition, byFilter) {
    var newFilters = definition.filters,
        newRules = definition.rules,
        updatedFilters, clone, previous;

    // The current definition might have been split up into
    // multiple definitions already.
    for (var k = 0; k < current.length; k++) {
        updatedFilters = current[k].filters.cloneWith(newFilters);
        if (updatedFilters) {
            previous = byFilter[updatedFilters];
            if (previous) {
                // There's already a definition with those exact
                // filters. Add the current definitions' rules
                // and stop processing it as the existing rule
                // has already gone down the inheritance chain.
                previous.addRules(newRules);
            } else {
                clone = current[k].clone(updatedFilters);
                // Make sure that we're only maintaining the clone
                // when we did actually add rules. If not, there's
                // no need to keep the clone around.
                if (clone.addRules(newRules)) {
                    // We inserted an element before this one, so we need
                    // to make sure that in the next loop iteration, we're
                    // not performing the same task for this element again,
                    // hence the k++.
                    byFilter[updatedFilters] = clone;
                    current.splice(k, 0, clone);
                    k++;
                }
            }
        } else if (updatedFilters === null) {
            // if updatedFilters is null, then adding the filters doesn't
            // invalidate or split the selector, so we addRules to the
            // combined selector

            // Filters can be added, but they don't change the
            // filters. This means we don't have to split the
            // definition.
            //
            // this is cloned here because of shared classes, see
            // sharedclass.mss
            current[k] = current[k].clone();
            current[k].addRules(newRules);
        }
        // if updatedFeatures is false, then the filters split the rule,
        // so they aren't the same inheritance chain
    }
    return current;
}

/**
 * Apply inherited styles from their ancestors to them.
 *
 * called either once per render (in the case of mss) or per layer
 * (for mml)
 *
 * @param {Object} definitions - a list of definitions objects
 *   that contain .rules
 * @param {Object} env - the environment
 * @return {Array<Array>} an array of arrays is returned,
 *   in which each array refers to a specific attachment
 */
function inheritDefinitions(definitions, env) {
    var inheritTime = +new Date();
    // definitions are ordered by specificity,
    // high (index 0) to low
    var byAttachment = {},
        byFilter = {};
    var result = [];
    var current, attachment;

    // Evaluate the filters specified by each definition with the given
    // environment to correctly resolve variable references
    definitions.forEach(function(d) {
        d.filters.ev(env);
    });

    for (var i = 0; i < definitions.length; i++) {

        attachment = definitions[i].attachment;
        current = [definitions[i]];

        if (!byAttachment[attachment]) {
            byAttachment[attachment] = [];
            byAttachment[attachment].attachment = attachment;
            byFilter[attachment] = {};
            result.push(byAttachment[attachment]);
        }

        // Iterate over all subsequent rules.
        for (var j = i + 1; j < definitions.length; j++) {
            if (definitions[j].attachment === attachment) {
                // Only inherit rules from the same attachment.
                current = addRules(current, definitions[j], byFilter[attachment]);
            }
        }

        for (var k = 0; k < current.length; k++) {
            byFilter[attachment][current[k].filters] = current[k];
            byAttachment[attachment].push(current[k]);
        }
    }

    if (env.benchmark) console.warn('Inheritance time: ' + ((new Date() - inheritTime)) + 'ms');

    return result;

}

// Sort styles by the minimum index of their rules.
// This sorts a slice of the styles, so it returns a sorted
// array but does not change the input.
function sortStylesIndex(a, b) { return b.index - a.index; }
function sortStyles(styles) {
    for (var i = 0; i < styles.length; i++) {
        var style = styles[i];
        style.index = Infinity;
        for (var b = 0; b < style.length; b++) {
            var rules = style[b].rules;
            for (var r = 0; r < rules.length; r++) {
                var rule = rules[r];
                if (rule.index < style.index) {
                    style.index = rule.index;
                }
            }
        }
    }

    var result = styles.slice();
    result.sort(sortStylesIndex);
    return result;
}

// Removes dead style definitions that can never be reached
// when filter-mode="first". The style is modified in-place
// and returned. The style must be sorted.
function foldStyle(style) {
    for (var i = 0; i < style.length; i++) {
        for (var j = style.length - 1; j > i; j--) {
            if (style[j].filters.cloneWith(style[i].filters) === null) {
                style.splice(j, 1);
            }
        }
    }
    return style;
}

/**
 * Find a rule like Map { background-color: #fff; },
 * if any, and return a list of properties to be inserted
 * into the <Map element of the resulting XML. Translates
 * properties of the mml object at `m` directly into XML
 * properties.
 *
 * @param {Object} m the mml object.
 * @param {Array} definitions the output of toList.
 * @param {Array} symbolizers map symbolizers
 * @param {Object} env
 * @return {String} rendered properties.
 */
function getMapProperties(m, definitions, symbolizers, env) {
    var rules = {};

    _(m).each(function(value, key) {
        if (key in symbolizers) rules[key] = value;
    });

    definitions.filter(function(r) {
        return r.elements.join('') === 'Map';
    }).forEach(function(r) {
        for (var i = 0; i < r.rules.length; i++) {
            var key = r.rules[i].name;
            if (!(key in symbolizers)) {
                util.error(env, {
                    message: 'Rule ' + key + ' not allowed for Map.',
                    index: r.rules[i].index
                });
            }
            rules[key] = r.rules[i].ev(env).toObject(env)[key];
        }
    });
    return rules;
}

module.exports = carto;
module.exports.addRules = addRules;
module.exports.inheritDefinitions = inheritDefinitions;
module.exports.sortStyles = sortStyles;
