var path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    yaml = require('js-yaml');

var carto = require('./index');

carto.MML = function MML(options) {
    this.options = options || {};
};

/**
 * Load a MML document.
 *
 * @param {String} basedir base directory of MML document.
 * @param {String} data the MML document.
 * @param {Callback} callback function to be called when finished loading.
 */
carto.MML.prototype.load = function load(basedir, data, callback) {
    var mml = '',
        that = this;

    try {
        mml = yaml.safeLoad(data);
    } catch (err) {
        return callback("carto: " + err.message.replace(/^[A-Z]+, /, ''), null);
    }

    if (this.options.localize) {
        var millstone;
        try {
            require.resolve('millstone');
            millstone = require('millstone');
        } catch (err) {
            return callback('carto: Millstone not found, required if localizing stylesheet resources. ' + err.message.replace(/^[A-Z]+, /, ''), null);
        }
        millstone.resolve({
            mml: mml,
            base: basedir,
            cache: path.join(basedir, 'cache'),
           nosymlink: this.options.nosymlink
       }, function (err, data) {
           // force drain the millstone download pool now
           // to ensure we can exit without waiting
           if (that.options.localize && millstone.drainPool) {
               millstone.drainPool(function() {});
           }
           return callback(err, data);
       });
    } else {
        if (_.has(mml, 'Stylesheet') && !_.isNil(mml.Stylesheet)) {
            mml.Stylesheet = _.castArray(mml.Stylesheet);
            for (var i = 0; i < mml.Stylesheet.length; i++) {
                var stylesheet = mml.Stylesheet[i];
                if (typeof stylesheet !== 'string') {
                    mml.Stylesheet[i] = stylesheet;
                    continue;
                }
                var mss,
                    file = path.resolve(basedir, stylesheet);
                try {
                    mss = fs.readFileSync(file, 'utf-8');
                } catch (err) {
                    return callback('Failed to load file ' + file + ".\n", null);
                }
                mml.Stylesheet[i] = { id: stylesheet, data: mss };
            }
            return callback(null, mml);
        }
        else {
            return callback("Expecting a Stylesheet property containing an (array of) stylesheet object(s) of the form { id: 'x', 'data': 'y' }.\n", null);
        }
    }
};

module.exports = carto;
