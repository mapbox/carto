var tree = require('../tree');

// Storage for zoom ranges. Only supports continuous ranges,
// and stores them as bit-sequences so that they can be combined,
// inverted, and compared quickly.
tree.Zoom = function(op, value, index) {
    this.op = op;
    this.value = value;
    this.index = index;
};

tree.Zoom.prototype.setZoom = function(zoom) {
    this.zoom = zoom;
    return this;
};

tree.Zoom.prototype.ev = function(env) {
    var start = 0,
        end = Infinity,
        value = parseInt(this.value.ev(env).toString(), 10),
        zoom = 0;

    if (value > tree.Zoom.maxZoom || value < 0) {
        env.error({
            message: 'Only zoom levels between 0 and ' +
                tree.Zoom.maxZoom + ' supported.',
            index: this.index
        });
    }

    switch (this.op) {
        case '=':
            this.zoom = 1 << value;
            return this;
        case '>':
            start = value + 1;
            break;
        case '>=':
            start = value;
            break;
        case '<':
            end = value - 1;
            break;
        case '<=':
            end = value;
            break;
    }
    for (var i = 0; i <= tree.Zoom.maxZoom; i++) {
        if (i >= start && i <= end) {
            zoom |= (1 << i);
        }
    }
    this.zoom = zoom;
    return this;
};

tree.Zoom.prototype.toString = function() {
    return this.zoom;
};

// Covers all zoomlevels from 0 to 22
tree.Zoom.all = 0x7FFFFF;

tree.Zoom.maxZoom = 22;

tree.Zoom.ranges = {
     0: 1000000000,
     1: 500000000,
     2: 200000000,
     3: 100000000,
     4: 50000000,
     5: 25000000,
     6: 12500000,
     7: 6500000,
     8: 3000000,
     9: 1500000,
    10: 750000,
    11: 400000,
    12: 200000,
    13: 100000,
    14: 50000,
    15: 25000,
    16: 12500,
    17: 5000,
    18: 2500,
    19: 1500,
    20: 750,
    21: 500,
    22: 250,
    23: 100
};

// Only works for single range zooms. `[XXX....XXXXX.........]` is invalid.
tree.Zoom.prototype.toXML = function(env, indentation) {
    var indent = new Array((indentation || 2) + 1).join('  ');
    var conditions = [];
    if (this.zoom != tree.Zoom.all) {
        var start = null, end = null;
        for (var i = 0; i <= tree.Zoom.maxZoom; i++) {
            if (this.zoom & (1 << i)) {
                if (start === null) start = i;
                end = i;
            }
        }
        if (start > 0) conditions.push(indent + '<MaxScaleDenominator>' +
            tree.Zoom.ranges[start] + '</MaxScaleDenominator>\n');
        if (end < 22) conditions.push(indent + '<MinScaleDenominator>' +
            tree.Zoom.ranges[end + 1] + '</MinScaleDenominator>\n');
    }
    return conditions;
};

tree.Zoom.prototype.toString = function() {
    var str = '';
    for (var i = 0; i <= tree.Zoom.maxZoom; i++) {
        str += (this.zoom & (1 << i)) ? 'X' : '.';
    }
    return str;
};
