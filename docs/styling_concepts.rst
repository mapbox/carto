Styling Concepts
================

Attachments and Instances
-------------------------

In CSS, a certain object can only have one instance of a property. A ``<div>`` has a specific border width and color,
rules that match better than others (#id instead of .class) override previous definitions.
CartoCSS acts the same way normally for the sake of familiarity and organization, but Mapnik itself is more powerful.

Layers in Mapnik can have multiple `borders <https://github.com/mapnik/mapnik/wiki/LineSymbolizer>`_ and multiple copies
of other attributes. This ability is useful in drawing line outlines, like in the case of road borders or 'glow' effects around coasts.
CartoCSS makes this accessible by allowing attachments to styles::

    #world {
      line-color: #fff;
      line-width: 3;
    }

    #world::outline {
      line-color: #000;
      line-width: 6;
    }

Attachments are optional.

While attachments allow creating implicit "layers" with the same data, using **instances**
allows you to create multiple symbolizers in the same style/layer::

    #roads {
      casing/line-width: 6;
      casing/line-color: #333;
      line-width: 4;
      line-color: #666;
    }

This makes Mapnik first draw the line of color #333 with a width of 6, and then immediately afterwards,
it draws the same line again with width 4 and color #666. Contrast that to attachments:
Mapnik would first draw all casings before proceeding to the actual lines.

Variables & Expressions
-----------------------

CartoCSS inherits from its basis in `LessCSS <http://lesscss.org/>`_ some new features in CSS.
One can define variables in stylesheets, and use expressions to modify them. ::

    @mybackground: #2B4D2D;

    Map {
      background-color: @mybackground
    }

    #world {
      polygon-fill: @mybackground + #222;
      line-color: darken(@mybackground, 10%);
    }

Nested Styles
-------------

CartoCSS also inherits nesting of rules from LessCSS. ::

    /* Applies to all layers with .land class */
    .land {
      line-color: #ccc;
      line-width: 0.5;
      polygon-fill: #eee;
      /* Applies to #lakes.land */
      #lakes {
        polygon-fill: #000;
      }
    }

This can be a convenient way to group style changes by zoom level::

    [zoom > 1] {
      /* Applies to all layers at zoom > 1 */
      polygon-gamma: 0.3;
      #world {
        polygon-fill: #323;
      }
      #lakes {
        polygon-fill: #144;
      }
    }

FontSets
--------

By defining multiple fonts in a ``text-face-name`` definition, you create `FontSets <https://github.com/mapnik/mapnik/wiki/FontSet>`_
in CartoCSS. These are useful for supporting multiple character sets and fallback fonts for distributed styles.

This CartoCSS code ::

    #world {
      text-name: "[NAME]";
      text-size: 11;
      text-face-name: "Georgia Regular", "Arial Italic";
    }

becomes this XML code ::

    <FontSet name="fontset-0">
      <Font face-name="Georgia Regular">
      <Font face-name="Arial Italic">
    </FontSet>
    <Style name="world-text">
      <Rule>
        <TextSymbolizer fontset-name="fontset-0"
          size="11"
          name="[NAME]">
      </Rule>
    </Style>

Filters
-------

CartoCSS supports a variety of filter styles:

Numeric comparisons::

    #world[population > 100]
    #world[population < 100]
    #world[population >= 100]
    #world[population <= 100]

General comparisons::

    #world[population = 100]
    #world[population != 100]


String comparisons::

    /* a regular expression over name */
    #world[name =~ "A.*"]

More complex expressions::

    #world[[population] % 50 = 0]
    #world[[population] * 2 < 1000]
