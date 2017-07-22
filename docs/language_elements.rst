*****************
Language Elements
*****************

Below is a list of values and an explanation of any expression that can be applied to properties in CartoCSS.

Color
=====

CartoCSS accepts a variety of syntaxes for colors - HTML-style hex values, rgb, rgba, hsl, hsla, hsluv, and hsluva.
It also supports the predefined HTML colors names, like `yellow` and `blue`. ::

    #line {
      line-color: #ff0;
      line-color: #ffff00;
      line-color: rgb(255, 255, 0);
      line-color: rgba(255, 255, 0, 1);
      line-color: hsl(100, 50%, 50%);
      line-color: hsla(100, 50%, 50%, 1);
      line-color: hsluv(100, 50%, 50%); // same values yield different color than HSL
      line-color: hsluva(100, 50%, 50%, 1);
      line-color: yellow;
    }

Especially of note is the support for HSL and HSLuv, which can be easier to reason about than RGB.
CartoCSS also includes several color operation functions `borrowed from LessCSS <http://lesscss.org/functions/#color-operations>`_::

    // lighten and darken colors
    lighten(#ace, 10%);
    darken(#ace, 10%);

    // saturate and desaturate
    saturate(#550000, 10%);
    desaturate(#00ff00, 10%);

    // increase or decrease the opacity of a color
    fadein(#fafafa, 10%);
    fadeout(#fefefe, 14%);

    // spin rotates a color around the color wheel by degrees
    spin(#ff00ff, 10);

    // mix generates a color in between two other colors.
    mix(#fff, #000, 50%);

    // get color components
    hue(#ff00ff);
    saturation(#ff00ff);
    lightness(#ff00ff);
    alpha(hsla(100, 50%, 50%, 0.5));

These functions all take arguments which can be color variables, literal colors, or the results of other functions operating on colors.
All the above mentioned functions also come in a *functionp*-variant (e.g. ``lightenp``), which force a given color into HSLuv color space.

Float
=====

Float is a fancy way of saying 'number'. In CartoCSS, you specify *just a number* - unlike CSS, there are no units,
but everything is specified in pixels. ::

    #line {
      line-width: 2;
    }

It's also possible to do simple math with number values::

    #line {
      line-width: 4 / 2; // division
      line-width: 4 + 2; // addition
      line-width: 4 - 2; // subtraction
      line-width: 4 * 2; // multiplication
      line-width: 4 % 2; // modulus
    }

URI
===

URI is a fancy way of saying URL. When an argument is a URI, you use the same kind of ``url('place.png')``
notation that you would with HTML. Quotes around the URL aren't required, but are highly recommended.
URIs can be paths to places on your computer, or on the internet. ::

    #markers {
      marker-file: url('marker.png');
    }

String
======

A string is basically just text. In the case of CartoCSS, you're going to put it in quotes. Strings can be anything,
though pay attention to the cases of ``text-name`` and ``shield-name`` - they actually will refer to features,
which you refer to by putting them in brackets, as seen in the example below. ::

    #labels {
      text-name: "[MY_FIELD]";
    }

Boolean
=======

Boolean means yes or no, so it accepts the values ``true`` or ``false``. ::

    #markers {
      marker-allow-overlap: true;
    }

Expressions
===========

Expressions are statements that can include fields, numbers, and other types in a really flexible way.
You have run into expressions before, in the realm of 'fields', where you'd specify ``"[FIELD]"``,
but expressions allow you to drop the quotes and also do quick addition, division, multiplication,
and concatenation from within CartoCSS syntax. ::

    #buildings {
      building-height: [HEIGHT_FIELD] * 10;
    }

Numbers
=======

Numbers are comma-separated lists of one or more number in a specific order.
They're used in line dash arrays, in which the numbers specify intervals of line, break, and line again. ::

    #disputedboundary {
      line-dasharray: 1, 4, 2;
    }

Percentages
===========

In CartoCSS, the percentage symbol, ``%`` universally means ``value/100``.
It's meant to be used with ratio-related properties, like opacity rules.

.. attention:: You should not use percentages as widths, heights, or other properties - unlike CSS,
   percentages are not relative to cascaded classes or page size, they're, as stated,
   simply the value divided by one hundred.

In an example::

    #world {
      // this syntax
      polygon-opacity: 50%;

      // is equivalent to
      polygon-opacity: 0.5;
    }

Functions
=========

Functions are comma-separated lists of one or more functions. For instance, transforms use the ``functions`` type
to allow for transforms within CartoCSS, which are optionally chainable. ::

    #point {
      point-transform: scale(2, 2);
    }

Mapnik Render-Time Variables
============================

Mapnik >= 3.0.0 supports variables of the form ``@var``. These can be used from CartoCSS by specifying them as strings. For example::

    #layer {
      line-width: '@zoom';
    }

For this to have any effect you have to pass the variables to Mapnik at render time in a hashmap of the form ``variable_name:variable_value``.

Controlling output of symbolizers and symbolizer attributes
===========================================================

You can control symbolizer output by using rules that work on the whole symbolizer. E.g. ``line`` works on the
line symbolizer. By using the keywords ``none`` or ``auto`` you can either suppress the symbolizer or output it with
default values. The keyword ``auto`` does not work on shield and text symbolizers because they have attributes without
default values. Here is an example how this works::

    #layer {
      line: none;
      line-width: 2;
      [feature = 'redfeature'] {
        line-color: red;
      }
      [feature = 'bluefeature'] {
        line-color: blue;
      }
    }

Without ``line: none`` carto would output a line symbolizer with default values for all features
other than redfeature and bluefeature, that is a black line with width 1. In contrast, you can
quickly output a symbolizer with default value by using ``auto``::

    #layer {
      [feature = 'quickfeature'] {
        marker: auto;
      }
    }

This outputs a default markers symbolizer for all quickfeature features.

You can also control the output of individual symbolizer properties by specifying them with the keyword ``none`` e.g. ``line-color: none``.
They will then be removed from the symbolizer thus using their default value
or not using them at all. This does not work or makes sense for all properties like e.g. not for ``text-face-name`` as it does not have a default value. For an overview over properties
where this works or makes sense see `this list <https://github.com/mapbox/carto/blob/master/test/rendering-mss/issue_214.mss>`_.
In this case the use of ``none`` and ``auto`` is equivalent. In both cases the default
value will be used as Mapnik uses the default value automatically when the property is not present.
