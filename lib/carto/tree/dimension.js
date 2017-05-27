(function(tree) {
var _ = require('lodash'),
    chroma = require('chroma-js'),
    util = require('../util');
//
// A number with a unit
//
tree.Dimension = function Dimension(value, unit, index, filename) {
    this.value = parseFloat(value);
    this.unit = unit || null;
    this.filename = filename;
    this.index = index;
};

tree.Dimension.prototype = {
    is: 'float',
    physical_units: ['m', 'cm', 'in', 'mm', 'pt', 'pc'],
    screen_units: ['px', '%'],
    all_units: ['m', 'cm', 'in', 'mm', 'pt', 'pc', 'px', '%'],
    densities: {
        m: 0.0254,
        mm: 25.4,
        cm: 2.54,
        pt: 72,
        pc: 6
    },
    ev: function (env) {
        if (this.unit && !_.includes(this.all_units, this.unit)) {
            util.error(env, {
                message: "Invalid unit: '" + this.unit + "'",
                index: this.index,
                filename: this.filename
            });
            return { is: 'undefined', value: 'undefined' };
        }

        // normalize units which are not px or %
        if (this.unit && _.includes(this.physical_units, this.unit)) {
            if (!env.ppi) {
                util.error(env, {
                    message: "ppi is not set, so metric units can't be used",
                    index: this.index,
                    filename: this.filename
                });
                return { is: 'undefined', value: 'undefined' };
            }
            // convert all units to inch
            // convert inch to px using ppi
            this.value = (this.value / this.densities[this.unit]) * env.ppi;
            this.unit = 'px';
        }

        return this;
    },
    toColor: function() {
        return new tree.Color(chroma([this.value, this.value, this.value]).hsl(), 1, false);
    },
    round: function() {
        this.value = Math.round(this.value);
        return this;
    },
    toString: function() {
        return this.value.toString();
    },
    operate: function(env, op, other) {
        if (this.unit === '%' && other.unit !== '%') {
            util.error(env, {
                message: 'If two operands differ, the first must not be %',
                index: this.index,
                filename: this.filename
            });
            return {
                is: 'undefined',
                value: 'undefined'
            };
        }

        if (this.unit !== '%' && other.unit === '%') {
            if (op === '*' || op === '/' || op === '%') {
                util.error(env, {
                    message: 'Percent values can only be added or subtracted from other values',
                    index: this.index,
                    filename: this.filename
                });
                return {
                    is: 'undefined',
                    value: 'undefined'
                };
            }

            return new tree.Dimension(tree.operate(op,
                    this.value, this.value * other.value * 0.01),
                this.unit, this.index, this.filename);
        }

        //here the operands are either the same (% or undefined or px), or one is undefined and the other is px
        return new tree.Dimension(tree.operate(op, this.value, other.value),
            this.unit || other.unit, this.index, this.filename);
    }
};

})(require('../tree'));
