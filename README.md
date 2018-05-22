# CartoCSS

[![Build Status](https://secure.travis-ci.org/mapbox/carto.svg)](http://travis-ci.org/mapbox/carto) [![Build status](https://ci.appveyor.com/api/projects/status/github/mapbox/carto?svg=true)](https://ci.appveyor.com/project/Mapbox/carto) [![Coverage Status](https://coveralls.io/repos/github/mapbox/carto/badge.svg?branch=master)](https://coveralls.io/github/mapbox/carto?branch=master) [![Package Version](https://img.shields.io/npm/v/carto.svg)](https://www.npmjs.com/package/carto) [![Dependencies](https://david-dm.org/mapbox/carto.svg)](https://david-dm.org/mapbox/carto)    [![Documentation Status](https://readthedocs.org/projects/cartocss/badge/?version=latest)](http://cartocss.readthedocs.io/en/latest/?badge=latest)

CartoCSS (short: Carto) is a language for map design. It is similar in syntax to CSS, but builds upon it with specific abilities to filter map data and by providing things like variables.
It targets the [Mapnik renderer](http://mapnik.org) and is able to generate Mapnik XML and a JSON variant of Mapnik XML.
It can run from the command line or in the browser.

Carto is an evolution of the [Cascadenik](https://github.com/mapnik/Cascadenik) idea and language, with an emphasis on speed and flexibility.

## Documentation

The best place to start is to review the [CartoCSS documentation](https://cartocss.readthedocs.io).

Tutorials like the [Mapbox Getting started with CartoCSS guide](https://www.mapbox.com/guides/getting-started-cartocss/) are a great place to start to learn the basics of CartoCSS.

For more advanced topics see the [Studio style quickstart guide](https://www.mapbox.com/guides/style-quickstart/) and [Studio style manual](https://www.mapbox.com/guides/style-manual). The links below reference the Tilemill application, which preceded Mapbox Studio Classic, but still contain useful and relevant information.

 - [Details on Filtering data with CartoCSS](https://www.mapbox.com/tilemill/docs/guides/selectors/)
 - [How order works in rendering](https://www.mapbox.com/tilemill/docs/guides/symbol-drawing-order/)
 - [How to style labels](https://www.mapbox.com/tilemill/docs/guides/styling-labels/)
 - [How to style lines](https://www.mapbox.com/tilemill/docs/guides/styling-lines/)
 - [How to style polygons](https://www.mapbox.com/tilemill/docs/guides/styling-polygons/)
 - See also the [Styling Concepts](#styling-concepts) for explanations of advanced features.

## Installation

If you are using a map design application like Kosmtik, Mapbox Studio Classic or Tilemill you already have CartoCSS installed
and might be more interested in the language reference.

Else you can install the `carto` binary with NPM by running:

    npm install -g carto

You should consider using a Node.js version manager like [NVM](https://github.com/creationix/nvm).
Optionally you may also want to install millstone which is required for resolving data in the same way as Mapbox Studio Classic does:

    npm install -g millstone


Having `millstone` installed specifically enable support for localizing external resources (URLs and local files) referenced in your mml file, and detecting projections (using [node-srs](https://github.com/mapbox/node-srs))

## Usage

Now that Carto is installed you should have a `carto` command line tool available that can be run on a CartoCSS project:

    carto project.mml > mapnik.xml

Available parameters:
* -a / --api VERSION - Specify Mapnik API version (e.g. --api 3.0.10) (default: latest Mapnik API version)
* -b / --benchmark - Outputs total compile time
* -f / --file - Outputs to the specified file instead of stdout
* -h / --help - Display help message
* -l / --localize - Use millstone to localize resources when loading an MML (default: off)
* -n / --nosymlink - Use absolute paths instead of symlinking files
* -o / --output - Specify output format, possible values are `mapnik` and `json` (default: `mapnik`)
* -ppi RESOLUTION - Pixels per inch used to convert m, mm, cm, in, pt, pc to pixels (default: 90.714)
* -q / --quiet - Do not output any warnings (default: off)
* -v / --version - Display version information

Alternatively, Carto can be used from JavaScript.
The `Renderer` interface is the main API for developers, and it takes an MML file as a string as input.

```javascript
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
```

If you want to use CartoCSS within the browser you should not use MML loading via `carto.MML.load`.
Instead you should supply the JSON of the MML including the Stylesheet strings directly to `carto.Renderer.render`.

## Vim

To install, download or clone this repository, then copy the `vim-carto`
directory located at `build/vim-carto` to your `~/.vim` directory.

    cp build/vim-carto/* ~/.vim -R

## Credits

CartoCSS is based on [less.js](https://github.com/cloudhead/less.js), a CSS compiler written by Alexis Sellier.

See also a [list of dependencies](https://david-dm.org/mapbox/carto#info=dependencies&view=list).

## Similar projects

* [Magnacarto](https://github.com/omniscale/magnacarto) (Go implementation of CartoCSS for Mapnik and Mapserver)

## Authors

* Tom MacWright (tmcw)
* Konstantin Käfer (kkaefer)
* AJ Ashton (ajashton)
* Dane Springmeyer (springmeyer)
* Michael Glanznig (nebulon42)
