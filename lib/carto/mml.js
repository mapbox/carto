var path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    yaml = require('js-yaml'),
    carto = require('./index'),
    util = require('./util');

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
        that = this,
        env = {};

    try {
        mml = yaml.safeLoad(data);
    } catch (err) {
        env = {};
        util.error(env, {
            message: 'carto: ' + err.message.replace(/^[A-Z]+, /, '')
        });
        return callback(env.msg, null);
    }

    if (this.options.localize) {
        var millstone;
        try {
            require.resolve('millstone');
            millstone = require('millstone');
        } catch (err) {
            env = {};
            util.error(env, {
                message: 'carto: Millstone not found, required if localizing stylesheet resources. ' + err.message.replace(/^[A-Z]+, /, '')
            });
            return callback(env.msg, null);
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
           env = {};
           util.error(env, err);
           return callback(env.msg, data);
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
                    env = {};
                    util.error(env, {
                        message: 'Failed to load file ' + file + '.'
                    });
                    return callback(env.msg, null);
                }
                mml.Stylesheet[i] = { id: stylesheet, data: mss };
            }
            return callback(null, mml);
        }
        else {
            env = {};
            util.error(env, {
                message: "Expecting a Stylesheet property containing an (array of) stylesheet object(s) of the form { id: 'x', 'data': 'y' }."
            });
            return callback(env.msg, null);
        }
    }
};

module.exports = carto;
