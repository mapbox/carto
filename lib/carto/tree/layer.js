var semver = require('semver'),
    _ = require('lodash');

(function(tree) {

tree.LayerObject = function(obj, styles, apiVersion) {
    var dsOptions = [],
        layerAttr = {},
        layerContent = [];

    for (var i in obj.Datasource) {
        dsOptions.push({
            '_name': 'Parameter',
            '_attributes': {
                'name': i
            },
            '_content': obj.Datasource[i]
        });
    }

    for (var prop in obj.properties) {
        if (prop === 'minzoom') {
            if (semver.gte(apiVersion, '3.0.0')) {
                _.set(layerAttr, 'maximum-scale-denominator', tree.Zoom.ranges[obj.properties[prop]]);
            }
            else {
                _.set(layerAttr, 'maxzoom', tree.Zoom.ranges[obj.properties[prop]]);
            }
        } else if (prop === 'maxzoom') {
            if (semver.gte(apiVersion, '3.0.0')) {
                _.set(layerAttr, 'minimum-scale-denominator', tree.Zoom.ranges[obj.properties[prop]+1]);
            }
            else {
                _.set(layerAttr, 'minzoom', tree.Zoom.ranges[obj.properties[prop]+1]);
            }
        } else {
            _.set(layerAttr, prop, obj.properties[prop]);
        }
    }

    _.set(layerAttr, 'name', new tree.Quoted(obj.layerId).toString());
    if (typeof obj.status !== 'undefined') {
        _.set(layerAttr, 'status', obj.status);
    }
    if (typeof obj.srs !== 'undefined') {
        _.set(layerAttr, 'srs', obj.srs);
    }

    _.forEach(styles.reverse(), function (s) {
        layerContent.push({
            '_name': 'StyleName',
            '_content': s
        });
    });

    if (dsOptions.length) {
        layerContent.push({
            '_name': 'Datasource',
            '_content': dsOptions
        });
    }

    return {
        '_name': 'Layer',
        '_attributes': layerAttr,
        '_content': layerContent
    };
};

})(require('../tree'));
