var chroma = require('chroma-js'),
    hsluv = require('hsluv'),
    _ = require('lodash');

(function (tree) {

tree.functions = {
    rgb: function (r, g, b) {
        return this.rgba(r, g, b, 1.0);
    },
    rgba: function (r, g, b, a) {
        var rgb = [r, g, b].map(function (c) { return number(c); });
        a = number(a);
        if (rgb.some(isNaN) || isNaN(a)) return null;

        this.rgb[0] = Math.max(0, Math.min(this.rgb[0], 255));
        this.rgb[1] = Math.max(0, Math.min(this.rgb[1], 255));
        this.rgb[2] = Math.max(0, Math.min(this.rgb[2], 255));

        var hsl = chroma(rgb).hsl();
        if (isNaN(hsl[0])) {
            hsl[0] = 0;
        }

        return new tree.Color(hsl, a);
    },
    // Only require val
    stop: function (val) {
        var color, mode;
        if (arguments.length > 1) color = arguments[1];
        if (arguments.length > 2) mode = arguments[2];

        return {
            is: 'tag',
            val: val,
            color: color,
            mode: mode,
            toString: function(env) {
                var attr = {};

                _.set(attr, 'value', val.ev(env).toString());
                if (color) {
                    _.set(attr, 'color', color.ev(env).toString());
                }
                if (mode) {
                    _.set(attr, 'mode', mode.ev(env).toString());
                }
                return {
                    '_name': 'stop',
                    '_attributes': attr
                };
            }
        };
    },
    hsl: function (h, s, l) {
        return this.hsla(h, s, l, 1.0);
    },
    hsla: function (h, s, l, a) {
        var hsl = [h, s, l].map(function (c) { return number(c); });
        a = number(a);
        if (hsl.some(isNaN) || isNaN(a)) return null;

        return new tree.Color(hsl, a, false);
    },
    hsluv: function (h, s, l) {
      return this.hsluva(h, s, l, 1.0);
    },
    hsluva: function (h, s, l, a) {
      var hsl = [h, s, l].map(function (c) { return number(c); });
      a = number(a);
      if (hsl.some(isNaN) || isNaN(a)) return null;

      return new tree.Color(hsl, a, true);
    },
    hue: function (color) {
        if (!('getComponents' in color)) return null;
        var comp = color.getComponents();
        if (comp.perceptual) {
            if (!('toStandard' in color)) return null;
            color = color.toStandard();
            comp = color.getComponents();
        }
        return new tree.Dimension(Math.round(comp.h));
    },
    huep: function (color) {
        if (!('getComponents' in color)) return null;
        var comp = color.getComponents();
        if (!comp.perceptual) {
            if (!('toPerceptual' in color)) return null;
            color = color.toPerceptual();
            comp = color.getComponents();
        }
        return new tree.Dimension(Math.round(comp.h));
    },
    saturation: function (color) {
        if (!('getComponents' in color)) return null;
        var comp = color.getComponents();
        if (comp.perceptual) {
            if (!('toStandard' in color)) return null;
            color = color.toStandard();
            comp = color.getComponents();
        }
        return new tree.Dimension(Math.round(comp.s * 100), '%');
    },
    saturationp: function (color) {
        if (!('getComponents' in color)) return null;
        var comp = color.getComponents();
        if (!comp.perceptual) {
            if (!('toPerceptual' in color)) return null;
            color = color.toPerceptual();
            comp = color.getComponents();
        }
        return new tree.Dimension(Math.round(comp.s * 100), '%');
    },
    lightness: function (color) {
        if (!('getComponents' in color)) return null;
        var comp = color.getComponents();
        if (comp.perceptual) {
            if (!('toStandard' in color)) return null;
            color = color.toStandard();
            comp = color.getComponents();
        }
        return new tree.Dimension(Math.round(comp.l * 100), '%');
    },
    lightnessp: function (color) {
        if (!('getComponents' in color)) return null;
        var comp = color.getComponents();
        if (!comp.perceptual) {
            if (!('toPerceptual' in color)) return null;
            color = color.toPerceptual();
            comp = color.getComponents();
        }
        return new tree.Dimension(Math.round(comp.l * 100), '%');
    },
    alpha: function (color) {
        if (!('getComponents' in color)) return null;
        var comp = color.getComponents();
        return new tree.Dimension(comp.a);
    },
    saturate: function (color, amount) {
        if (!('getComponents' in color)) return null;
        var comp = color.getComponents();

        comp.s += amount.value / 100;
        comp.s = clamp(comp.s);
        return new tree.Color([comp.h, comp.s, comp.l], comp.a, comp.perceptual);
    },
    saturatep: function (color, amount) {
        if (!('toPerceptual' in color)) return null;
        return this.saturate(color.toPerceptual(), amount);
    },
    desaturate: function (color, amount) {
        if (!('getComponents' in color)) return null;
        var comp = color.getComponents();

        comp.s -= amount.value / 100;
        comp.s = clamp(comp.s);
        return new tree.Color([comp.h, comp.s, comp.l], comp.a, comp.perceptual);
    },
    desaturatep: function (color, amount) {
        if (!('toPerceptual' in color)) return null;
        return this.desaturate(color.toPerceptual(), amount);
    },
    lighten: function (color, amount) {
        if (!('getComponents' in color)) return null;
        var comp = color.getComponents();

        comp.l += amount.value / 100;
        comp.l = clamp(comp.l);
        return new tree.Color([comp.h, comp.s, comp.l], comp.a, comp.perceptual);
    },
    lightenp: function (color, amount) {
        if (!('toPerceptual' in color)) return null;
        return this.lighten(color.toPerceptual(), amount);
    },
    darken: function (color, amount) {
        if (!('getComponents' in color)) return null;
        var comp = color.getComponents();

        comp.l -= amount.value / 100;
        comp.l = clamp(comp.l);
        return new tree.Color([comp.h, comp.s, comp.l], comp.a, comp.perceptual);
    },
    darkenp: function (color, amount) {
        if (!('toPerceptual' in color)) return null;
        return this.darken(color.toPerceptual(), amount);
    },
    fadein: function (color, amount) {
        if (!('getComponents' in color)) return null;
        var comp = color.getComponents();

        comp.a += amount.value / 100;
        comp.a = clamp(comp.a);
        return new tree.Color([comp.h, comp.s, comp.l], comp.a, comp.perceptual);
    },
    fadeinp: function (color, amount) {
        if (!('toPerceptual' in color)) return null;
        return this.fadein(color.toPerceptual(), amount);
    },
    fadeout: function (color, amount) {
        if (!('getComponents' in color)) return null;
        var comp = color.getComponents();

        comp.a -= amount.value / 100;
        comp.a = clamp(comp.a);
        return new tree.Color([comp.h, comp.s, comp.l], comp.a, comp.perceptual);
    },
    fadeoutp: function (color, amount) {
        if (!('toPerceptual' in color)) return null;
        return this.fadeout(color.toPerceptual(), amount);
    },
    spin: function (color, amount) {
        if (!('getComponents' in color)) return null;
        var comp = color.getComponents();

        var hue = (comp.h + amount.value) % 360;
        comp.h = hue < 0 ? 360 + hue : hue;
        return new tree.Color([comp.h, comp.s, comp.l], comp.a, comp.perceptual);
    },
    spinp: function (color, amount) {
        if (!('toPerceptual' in color)) return null;
        return this.spin(color.toPerceptual(), amount);
    },
    replace: function (entity, a, b) {
        if (entity.is === 'field') {
            return entity.toString + '.replace(' + a.toString() + ', ' + b.toString() + ')';
        } else {
            return entity.replace(a, b);
        }
    },
    mix: function (color1, color2, weight) {
        if (!('isPerceptual' in color1) || !('isPerceptual' in color2)
            || !('toString' in color1) || !('toString' in color2)
            || !('getComponents' in color1) || !('getComponents' in color2)) return null;

        var perceptual = color1.isPerceptual() || color2.isPerceptual();

        if (color1.isPerceptual() && !color2.isPerceptual()) {
            color2 = color2.toPerceptual();
        }
        else if (!color1.toPerceptual() && color2.toPerceptual()) {
            color1 = color1.toPerceptual();
        }

        var rgb1 = chroma(color1.toString()).rgb();
        var rgb2 = chroma(color2.toString()).rgb();

        var p = weight.value / 100.0;
        var alpha = color1.getComponents().a * p + color2.getComponents().a * (1 - p);
        var a = color1.getComponents().a - color2.getComponents().a;

        var w = p * 2 - 1;
        var w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
        var w2 = 1 - w1;

        var rgb = [rgb1[0] * w1 + rgb2[0] * w2,
                   rgb1[1] * w1 + rgb2[1] * w2,
                   rgb1[2] * w1 + rgb2[2] * w2];

        var mix = null;
        if (perceptual) {
            var normalize = function (x) {
                return x / 255;
            };
            mix = hsluv.rgbToHsluv(_.map(rgb, normalize));
            mix[1] = mix[1] / 100;
            mix[2] = mix[2] / 100;
        }
        else {
            mix = chroma(rgb).hsl();
        }

        return new tree.Color(mix, alpha, perceptual);
    },
    greyscale: function (color) {
      if (!('getComponents' in color)) return null;
      var comp = color.getComponents();

      comp.s -= 1;
      comp.s = clamp(comp.s);
      return new tree.Color([comp.h, comp.s, comp.l], comp.a, comp.perceptual);
    },
    greyscalep: function (color) {
        if (!('toPerceptual' in color)) return null;
        return this.greyscale(color.toPerceptual());
    },
    '%': function (quoted /* arg, arg, ...*/) {
        var args = Array.prototype.slice.call(arguments, 1),
            str = quoted.value;

        for (var i = 0; i < args.length; i++) {
            str = str.replace(/%s/,    args[i].value)
                     .replace(/%[da]/, args[i].toString());
        }
        str = str.replace(/%%/g, '%');
        return new tree.Quoted(str);
    }
};

var image_filter_functors = [
    'emboss', 'blur', 'gray', 'sobel', 'edge-detect',
    'x-gradient', 'y-gradient', 'sharpen'];

for (var i = 0; i < image_filter_functors.length; i++) {
    var f = image_filter_functors[i];
    tree.functions[f] = (function(f) {
        return function() {
            return new tree.ImageFilter(f);
        };
    })(f);
}

tree.functions['agg-stack-blur'] = function(x, y) {
    return new tree.ImageFilter('agg-stack-blur', [x, y]);
};

tree.functions['scale-hsla'] = function(h0,h1,s0,s1,l0,l1,a0,a1) {
    return new tree.ImageFilter('scale-hsla', [h0,h1,s0,s1,l0,l1,a0,a1]);
};

function number(n) {
    if (n instanceof tree.Dimension) {
        return parseFloat(n.unit == '%' ? n.value / 100 : n.value);
    } else if (typeof(n) === 'number') {
        return n;
    } else {
        return NaN;
    }
}

function clamp(val) {
    return Math.min(1, Math.max(0, val));
}

})(require('./tree'));
