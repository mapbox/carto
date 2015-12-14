var chroma = require('chroma-js');
(function(tree) {
// RGB Colors - #ff0014, #eee
// can be initialized with a 3 or 6 char string or a 3 or 4 element
// numerical array
tree.Color = function Color(rgb, a) {
    // The end goal here, is to parse the arguments
    // into an integer triplet, such as `128, 255, 0`
    //
    // This facilitates operations and conversions.
    if (Array.isArray(rgb)) {
        this.rgb = rgb.slice(0, 3);
    } else if (rgb.length == 6) {
        this.rgb = rgb.match(/.{2}/g).map(function(c) {
            return parseInt(c, 16);
        });
    } else {
        this.rgb = rgb.split('').map(function(c) {
            return parseInt(c + c, 16);
        });
    }

    if (typeof(a) === 'number') {
        this.alpha = a;
    } else if (rgb.length === 4) {
        this.alpha = rgb[3];
    } else {
        this.alpha = 1;
    }
};

tree.Color.prototype = {
    is: 'color',
    'ev': function() { return this; },

    // If we have some transparency, the only way to represent it
    // is via `rgba`. Otherwise, we use the hex representation,
    // which has better compatibility with older browsers.
    // Values are capped between `0` and `255`, rounded and zero-padded.
    toString: function() {
        if (this.alpha < 1.0) {
            return 'rgba(' + this.rgb.map(function(c) {
                return Math.round(c);
            }).concat(this.alpha).join(', ') + ')';
        } else {
            return '#' + this.rgb.map(function(i) {
                i = Math.round(i);
                i = (i > 255 ? 255 : (i < 0 ? 0 : i)).toString(16);
                return i.length === 1 ? '0' + i : i;
            }).join('');
        }
    },

    // Operations have to be done per-channel, if not,
    // channels will spill onto each other. Once we have
    // our result, in the form of an integer triplet,
    // we create a new Color node to hold the result.
    operate: function(env, op, other) {
        var result = [];

        if (! (other instanceof tree.Color)) {
            other = other.toColor();
        }

        for (var c = 0; c < 3; c++) {
            result[c] = tree.operate(op, this.rgb[c], other.rgb[c]);
        }
        return new tree.Color(result);
    },

    toHSL: function() {
        var color = chroma.rgb(this.rgb[0], this.rgb[1], this.rgb[2]).hsl(),
            a = this.alpha;

        return { h: color[0] || 0, s: color[1], l: color[2], a: a }
    }
};

})(require('../tree'));
