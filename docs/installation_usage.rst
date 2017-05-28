Installation & Usage
====================

Installation
------------

If you are using a map design application like Kosmtik, Mapbox Studio Classic or Tilemill you already have CartoCSS installed
and might be more interested in the language reference.

Else you can install the *carto* binary with NPM by running::

    npm install -g carto

You should consider using a Node.js version manager like `NVM <https://github.com/creationix/nvm>`_.

Optionally you may also want to install millstone which is required for resolving data in the same way as Mapbox Studio Classic does::

    npm install -g millstone


Having *millstone* installed specifically enables support for localizing external resources (URLs and local files) referenced in your MML file,
and detecting projections (using `node-srs <https://github.com/mapbox/node-srs>`_).

Usage
-----

Now that Carto is installed you should have a *carto* command line tool available that can be run on a CartoCSS project::

    carto project.mml > mapnik.xml

The following command line options are available:

-a / --api VERSION
    Specify Mapnik API version (e.g. --api 3.0.10) (default: latest Mapnik API version)

-b / --benchmark
    Outputs total compile time

-h / --help
    Display help message

-l / --localize
    Use millstone to localize resources when loading an MML (default: off)

-n / --nosymlink
    Use absolute paths instead of symlinking files

-ppi RESOLUTION
    Pixels per inch used to convert m, mm, cm, in, pt, pc to pixels (default: 90.714)

-q / --quiet
    Do not output any warnings (default: off)

-v / --version
    Display version information


Alternatively, Carto can be used from JavaScript. The *Renderer* interface is the main API for developers,
and it takes an MML file as a string as input. ::

    // defined variables:
    // - input (the name or identifier of the file being parsed)
    var carto = require('carto');

    try {
        var data = fs.readFileSync(input, 'utf-8');
        var mml = new carto.MML();
        mml.load(path.dirname(input), data, function (err, data) {
            var output = {};

            if (!err) {
                output = new carto.Renderer({
                    filename: input,
                    local_data_dir: path.dirname(input),
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

.. note:: If you want to use Carto within the browser you should not use MML loading via ``carto.MML.load``.
   Instead you should supply the JSON of the MML including the Stylesheet strings directly to ``carto.Renderer.render``.
