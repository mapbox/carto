var path = require('path'),
    fs = require('fs'),
    assert = require('assert'),
    semver = require('semver'),
    _ = require('lodash');

var carto = require('../lib/carto'),
    helper = require('./support/helper'),
    util = require('../lib/carto/util');

describe('Rendering', function() {

    it('should support rendering without Stylesheet (for non-styling/vector tile usage)', function(done) {

        // note: this intentionally does not have a `"Stylesheet":[]` property
        // so we should skip trying to validate it
        var opts = {"name":"","description":"",
                    "attribution":"",
                    "center":[0,0,3],
                    "format":"pbf",
                    "minzoom":0,
                    "maxzoom":6,
                    "srs":"+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over",
                    "Layer":[],
                    "json":"{\"vector_layers\":[]}"};
        var renderer = new carto.Renderer(null).render(opts);
        assert.ok(renderer);
        done();
    });


helper.files('rendering', 'mml', function(file) {
    var api = null,
        filename = path.basename(file);
    if (filename.indexOf('_api') !== -1) {
        api = filename.substring(filename.indexOf('_api') + 4, filename.length - 4);
        if (!semver.valid(api)) {
            api = null;
        }
    }
    it('should render ' + path.basename(file) + ' correctly', function(done) {
        helper.mml(file, function (err, mml) {
            var output = {
                msg: null,
                data: null
            };
            if (!err) {
                var env = {
                    paths: [ path.dirname(file) ],
                    data_dir: path.join(__dirname, '../data'),
                    local_data_dir: path.join(__dirname, 'rendering'),
                    filename: file
                },
                renderer = null;

                if (api) {
                    renderer = new carto.Renderer(env, {
                        mapnik_version: api
                    });
                }
                else {
                    renderer = new carto.Renderer(env);
                }
                output = renderer.render(mml);
            }
            else {
                output.msg = err;
            }
            if (!_.isNil(output.data)) {
                var result = helper.resultFile(file);
                helper.compareToXMLFile(result, output.data, function(err,expected_json,actual_json) {
                    var actual = file.replace(path.extname(file),'') + '-actual.json';
                    var expected = file.replace(path.extname(file),'') + '-expected.json';
                    if (err) {
                        fs.writeFileSync(actual,JSON.stringify(actual_json,null,4));
                        fs.writeFileSync(expected,JSON.stringify(expected_json,null,4));
                        throw new Error('failed: xml ' + result + ' in json form does not match expected result:\n' + actual + ' (actual)\n' + expected + ' (expected)');
                    } else {
                        // cleanup any actual renders that no longer fail
                        try {
                            fs.unlinkSync(actual);
                            fs.unlinkSync(expected);
                        } catch (err) {
                            // do nothing
                        }
                    }
                }, [
                    helper.removeAbsoluteImages,
                    helper.removeAbsoluteDatasources
                ]);
            }
            else {
                if (_.has(output, 'msg') && _.isArray(output.msg) &&
                    output.msg.length > 0) {
                    _.forEach(output.msg, function (v) {
                        if (v.type === 'error') {
                            console.error(util.getMessageToPrint(v));
                        }
                        else if (v.type === 'warning') {
                            console.warn(util.getMessageToPrint(v));
                        }
                    });
                }
                assert.ok(false);
            }
            done();
        });
    });
});
});
