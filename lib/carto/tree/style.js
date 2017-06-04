(function(tree) {
var _ = require('lodash');

// Given a style's name, attachment, definitions, and an environment object,
// return a style object resembling Mapnik XML
tree.StyleObject = function(name, attachment, definitions, env) {
    var existing = {};
    var image_filters = [], image_filters_inflate = [], direct_image_filters = [], comp_op = [], opacity = [];

    for (var i = 0; i < definitions.length; i++) {
        for (var j = 0; j < definitions[i].rules.length; j++) {
            var isNone = false;

            if (_.has(definitions[i].rules[j].value.value[0], 'value') &&
                _.has(definitions[i].rules[j].value.value[0].value[0], 'is') &&
                definitions[i].rules[j].value.value[0].value[0].is === 'keyword' &&
                definitions[i].rules[j].value.value[0].value[0].value === 'none') {
                isNone = true;
            }

            if (definitions[i].rules[j].name === 'image-filters' && !isNone) {
                image_filters.push(definitions[i].rules[j]);
            }
            if (definitions[i].rules[j].name === 'image-filters-inflate') {
                image_filters_inflate.push(definitions[i].rules[j]);
            }
            if (definitions[i].rules[j].name === 'direct-image-filters' && !isNone) {
                direct_image_filters.push(definitions[i].rules[j]);
            }
            if (definitions[i].rules[j].name === 'comp-op' && !isNone) {
                comp_op.push(definitions[i].rules[j]);
            }
            if (definitions[i].rules[j].name === 'opacity') {
                opacity.push(definitions[i].rules[j]);
            }
        }
    }

    var styleContent = definitions.map(function(definition) {
        return definition.toObject(env, existing);
    }).filter(function (definition) {
        // filter empty
        if (_.isArray(definition) && !definition.length) {
            return false;
        }
        else if (!Object.keys(definition).length) {
            return false;
        }
        return true;
    });

    var styleAttrs = {};

    if (image_filters.length) {
        _.set(styleAttrs, 'image-filters', _.chain(image_filters)
            // prevent identical filters from being duplicated in the style
            .uniq(function(i) { return i.id; }).map(function(f) {
            return f.ev(env).toObject(env, true, ',', 'image-filter');
        }).value().join(','));
    }

    if (image_filters_inflate.length) {
        _.set(styleAttrs, 'image-filters-inflate', image_filters_inflate[0].value.ev(env).toString());
    }

    if (direct_image_filters.length) {
        _.set(styleAttrs, 'direct-image-filters', _.chain(direct_image_filters)
            // prevent identical filters from being duplicated in the style
            .uniq(function(i) { return i.id; }).map(function(f) {
            return f.ev(env).toObject(env, true, ',', 'direct-image-filter');
        }).value().join(','));
    }

    if (comp_op.length && comp_op[0].value.ev(env).value != 'src-over') {
        _.set(styleAttrs, 'comp-op', comp_op[0].value.ev(env).toString());
    }

    if (opacity.length && opacity[0].value.ev(env).value != 1) {
        _.set(styleAttrs, 'opacity', opacity[0].value.ev(env).toString());
    }

    if (!Object.keys(styleAttrs).length && !styleContent.length) {
        return {};
    }

    _.set(styleAttrs, 'name', new tree.Quoted(name).toString());
    _.set(styleAttrs, 'filter-mode', 'first');

    return {
        '_name': 'Style',
        '_attributes': styleAttrs,
        '_content': styleContent
    }
};

})(require('../tree'));
