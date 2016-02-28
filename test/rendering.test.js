var path = require('path'),
    assert = require('assert'),
    fs = require('fs'),
    semver = require('semver');

var carto = require('../lib/carto');
var helper = require('./support/helper');

describe('Rendering', function() {
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
        var mml = helper.mml(file);
        try {
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
            var output = renderer.render(mml);
        } catch (err) {
            if (Array.isArray(err)){
                err.forEach(carto.writeError);
                return done();
            } else {
                return done(err);
            }
        }
        var result = helper.resultFile(file);
        helper.compareToXMLFile(result, output, function(err,expected_json,actual_json) {
            var actual = file.replace(path.extname(file),'') + '-actual.json';
            var expected = file.replace(path.extname(file),'') + '-expected.json';
            if (err) {
                // disabled since it can break on large diffs
                /*
                console.warn(
                    helper.stylize("Failure", 'red') + ': ' +
                    helper.stylize(file, 'underline') +
                    ' differs from expected result.');
                helper.showDifferences(err);
                throw '';
                */
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
            done();
        }, [
            helper.removeAbsoluteImages,
            helper.removeAbsoluteDatasources
        ]);

        // beforeExit(function() {
        //     if (!completed && renderResult) {
        //         console.warn(helper.stylize('renderer produced:', 'bold'));
        //         console.warn(renderResult);
        //     }
        //     assert.ok(completed, 'Rendering finished.');
        // });
    });
});
});
