var chroma = require('chroma-js');

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
                return '\n\t<stop value="' + val.ev(env) + '"' +
                    (color ? ' color="' + color.ev(env) + '" ' : '') +
                    (mode ? ' mode="' + mode.ev(env) + '" ' : '') +
                    '/>';
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
    husl: function (h, s, l) {
      return this.husla(h, s, l, 1.0);
    },
    husla: function (h, s, l, a) {
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
    //
    // Copyright (c) 2006-2009 Hampton Catlin, Nathan Weizenbaum, and Chris Eppstein
    // http://sass-lang.com
    //
    mix: function (color1, color2, weight) {
        if (!('getComponents' in color1) || !('getComponents' in color2)) return null;

        var p = weight.value / 100.0;
        var w = p * 2 - 1;
        var comp1 = color1.getComponents();
        var comp2 = color2.getComponents();
        var perceptual = comp1.perceptual || comp2.perceptual;
        var a = comp1.a - comp2.a;

        if (comp1.perceptual && !comp2.perceptual) {
            comp2 = color2.toPerceptual().getComponents();
        }
        else if (!comp1.perceptual && comp2.perceptual) {
            comp1 = color1.toPerceptual().getComponents();
        }

        var w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
        var w2 = 1 - w1;

        var hsl = [comp1.h * w1 + comp2.h * w2,
                   comp1.s * w1 + comp2.s * w2,
                   comp1.l * w1 + comp2.l * w2];

        var alpha = comp1.a * p + comp2.a * (1 - p);

        return new tree.Color(hsl, alpha, perceptual);
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
