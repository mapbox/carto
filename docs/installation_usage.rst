********************
Installation & Usage
********************

Installation
============

If you are using a map design application like Kosmtik, Mapbox Studio Classic or Tilemill you already have CartoCSS installed
and might be more interested in the language reference.

Else you can install the *carto* binary with NPM by running::

    npm install -g carto

You should consider using a Node.js version manager like `NVM <https://github.com/creationix/nvm>`_.

Optionally you may also want to install millstone which is required for resolving data in the same way as Mapbox Studio Classic does::

    npm install -g millstone


Having *millstone* installed specifically enables support for localizing external resources (URLs and local files) referenced in your MML file,
and detecting projections (using `node-srs <https://github.com/mapbox/node-srs>`_).

Usage from the command line
===========================

Now that Carto is installed you should have a *carto* command line tool available that can be run on a CartoCSS project::

    carto project.mml > mapnik.xml

The following command line options are available:

-a / --api VERSION
    Specify Mapnik API version (e.g. --api 3.0.10) (default: latest Mapnik API version)

-b / --benchmark
    Outputs total compile time

-f / --file
    Outputs to the specified file instead of stdout

-h / --help
    Display help message

-l / --localize
    Use millstone to localize resources when loading an MML (default: off)

-n / --nosymlink
    Use absolute paths instead of symlinking files

-o / --output
    Specify output format, possible values are ``mapnik`` and ``json`` (default: ``mapnik``)

-ppi RESOLUTION
    Pixels per inch used to convert m, mm, cm, in, pt, pc to pixels (default: 90.714)

-q / --quiet
    Do not output any warnings (default: off)

-v / --version
    Display version information

Usage from JavaScript (Carto API)
=================================

Alternatively, Carto can be used from JavaScript. While you theoretically could
instantiate almost all of the classes the main outward facing stable interfaces
are the ``Renderer`` and the ``MML`` interface. We start with an example and describe
the details afterwards::

    // defined variables:
    // - input (the name or identifier of the file being parsed)
    var carto = require('carto');

    try {
        var data = fs.readFileSync(input, 'utf-8');
        var mml = new carto.MML({});
        mml.load(path.dirname(input), data, function (err, data) {
            var output = {};

            if (!err) {
                output = new carto.Renderer({
                    filename: input
                }).render(data);
            }

            if (output.msg) {
                output.msg.forEach(function (v) {
                    if (v.type === 'error') {
                        console.error(carto.Util.getMessageToPrint(v));
                    }
                    else if (v.type === 'warning') {
                        console.warn(carto.Util.getMessageToPrint(v));
                    }
                });
            }

            // output content (if no errors)
            if (output.data) {
                console.log(output.data);
            }
        });
    } catch (err) {
        // program failures
        ...
    }

MML
---

The MML interface loads and processes a MML file (see :ref:`mml-file-structure` for details).
You instantiate the class with ``carto.MML``. The constructor takes a options object with
the following possible attributes:

* ``localize`` *boolean* (same as -l / --localize on the command line) - this uses
  `millstone <https://github.com/tilemill-project/millstone>`_ to localize stylesheet resources
* ``nosymlink`` *boolean* (same as -n / --nosymlink on the command line) - for millstone, tells
  it to use unmodified paths instead of symlinking files

By calling ``load(basedir, data, callback)`` the MML file is loaded and processed.
This method does not perform reading from a file, so you have to read the contents
of the file yourself and provide it as string to the method via the ``data`` parameter to the
load function. The ``basedir`` parameter is used to resolve stylesheet references.
When the processing is finished the specified ``callback`` function is called, which
has the following signature::

    function (err, data) {}

If an error occurred you find the message within ``err`` and ``data`` is ``null``.
When successful you find the processed MML data structure in ``data`` and ``err`` is ``null``.
The structure within ``data`` is excpected by the ``Renderer`` interface's ``render`` method.

.. note:: If you want to use Carto within the browser you should not use MML loading via ``carto.MML.load``.
   Instead you should supply the JSON of the MML including the Stylesheet strings directly to ``carto.Renderer.render``.

Renderer
--------

The Renderer interface performs the parsing and transformation for rendering from
a MML file string (either self loaded or loaded through the MML interface) or from a MSS
file string (without layers). You instantiate the class with ``carto.Renderer``.
The constructor takes a options object with the following possible attributes:

* ``benchmark`` *boolean* (similar to -b / --benchmark on the command line) - specifies
  if carto should run in benchmarking mode
* ``effects`` *array* - a container for side-effects limited to FontSets
* ``filename`` *string* - name of the input file, used to format errors and warnings
* ``outputFormat`` *string [mapnik|json]* (similar to -o / --output on the command line)
  - specifies which format the output should have, either Mapnik XML or JSON similar to Mapnik XML
* ``ppi`` *float* (similar to -ppi on the command line) - Pixels per inch used to convert m, mm, cm, in, pt, pc to pixels
* ``quiet`` *boolean* (similar to -q / --quiet on the command line) - if carto should output
  warnings or not
* ``reference`` *class* - carto uses a reference to validate input. You can specify your own
  which has to adhere to the specification. (see :ref:`reference`)
* ``validationData`` *object*

  * ``fonts`` *array* - a list of fonts that carto should use to validate if used fonts are valid/present

* ``version`` *string (semver)* (similar to -a / --api on the command line) - specify which
  Mapnik API version carto should use

``carto.Renderer`` offers two methods for actual rendering. You can either use ``render(data)`` or
``renderMSS(data)``. Both accept a string of either a processed MML file or a MSS style fragment.
The ``render`` method produces a full-featured style output while the ``renderMSS`` outputs only
a style fragment. Both return the following object::

    {
      msg: [],
      data: ''
    }

If errors or warnings occurred during rendering you will find them in ``msg`` and ``data``
will be ``null`` (in case of errors). The actual output is found in ``data`` if no errors
occurred.

Util
----

Carto provides a Util class to assist you with e.g. message formatting. Like in the
example you can call ``getMessageToPrint`` with a received message object to output it
nicely formatted as string.

.. _reference:

Using a custom reference
------------------------

Carto uses a reference to validate input. This reference specifies which rules and functions
are valid and which types a rule can take. It also describes how rules are transformed for
the output. By default carto uses `mapnik-reference <https://github.com/mapnik/mapnik-reference>`_
as reference, but you can also use your own. It has to adhere to the following specification::

    {
      versions: [], // array of versions (semver) as strings
      latest: '', // latest version (semver) as strings
      load: function (version) {} // return data structure for specified version
    }

The data structure returned by ``load`` has to look like this::

    {
      version: '', // version (semver) as string
      style: {}, // rules that apply to the style as a whole
      layer: {}, // rules that apply to a layer as a whole
      symbolizers: {}, // rules that apply to different elements of the renderer, this elements make up the map
      colors: {}, // color names and their mapping to RGB values
      datasources: {} // possible data sources for the rendering library and their parameters
    }

.. note:: ``datasources`` is not yet used by carto for validation.

All entries that contain rules are objects where there attributes are named after
a color, symbolizer or rule. ``style`` and ``layer`` have the same inner structure.
Here is an example::

    {
      'filter-mode': {
        type: {},
        doc: '',
        'default-value': '',
        'default-meaning': ''
      }
      ...
    }

``symbolizer`` first contains the possible symbolizers and then their rules::

    {
      polygon: {
        fill: {},
        'fill-opacity': {}
        ...
      }
      ...
    }

``colors`` maps color names to their RGB values::

    {
      aliceblue: [ 240, 248, 255 ],
      antiquewhite: [ 250, 235, 215 ]
      ...
    }

``datasources`` is similar to ``symbolizers`` and contains first the possible data sources
and then their possible parameters::

    {
      csv: {
        file: {},
        base: {}
        ...
      }
    }

Rules (all the parts that where specified with ``{}`` with a little preview at ``filter-mode``)
can have several attributes that are evaluated::

    name: {
        css: '', // rule name which is used in CartoCSS
        default-meaning: '', // meaning of the default value
        default-value: '', // default value of the rule
        doc: '', // documentation about the rule
        expression: bool, // whether this rule is a expression or not
        functions: [], // array of arrays that contain function name and # of params e.g. ["matrix", 6]
        range: '', // range of values that are allowed e.g. 0-1
        required: bool, // if this rule is required
        status: '[unstable|experimental|deprecated]', // if omitted it means stable
        type: '[bbox|boolean|color|float|functions|numbers|string|uri]', // type can also be an array of keywords
    }

.. caution:: Adherence to the specification is not assessed in-depth because that would
   be too resource intensive. If you don't adhere to the specification it is quite likely
   that you hit runtime errors.
