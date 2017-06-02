(function(tree) {

var _ = require('lodash');

tree.Selector = function Selector(filters, zoom, elements, attachment, conditions, index) {
    var that = this;

    this.elements = elements || [];
    this.attachment = attachment;
    this.filters = filters || {};
    this.zoom = typeof zoom !== 'undefined' ? zoom : tree.Zoom.all;
    this.conditions = conditions;
    this.index = index;

    if (this.filters) {
        if (_.isArray(this.filters)) {
            _.forEach(this.filters, function (f) {
                if (typeof f.setRule === 'function') {
                    f.setRule(that);
                }
            });
        }
        else {
            if (typeof this.filters.setRule === 'function') {
                this.filters.setRule(that);
            }
        }
    }

    if (this.zoom) {
        if (_.isArray(this.zoom)) {
            _.forEach(this.zoom, function (f) {
                if (typeof f.setRule === 'function') {
                    f.setRule(that);
                }
            });
        }
        else {
            if (typeof this.zoom.setRule === 'function') {
                this.zoom.setRule(that);
            }
        }
    }
};

// Determine the specificity of this selector
// based on the specificity of its elements - calling
// Element.specificity() in order to do so
//
// [ID, Class, Filters, Zoom, Position in document]
tree.Selector.prototype.specificity = function(env) {
    var zoomVal = -1;
    // if we would evaluate zooms here we would enter an infinite loop
    if (!_.isArray(this.zoom)) {
        zoomVal = this.zoom;
    }

    return this.elements.reduce(function(memo, e) {
        var spec = e.specificity(env);
        memo[0] += spec[0];
        memo[1] += spec[1];
        return memo;
    }, [0, 0, this.conditions, zoomVal, this.index]);
};

})(require('../tree'));
