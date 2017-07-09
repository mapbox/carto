var assert = require('assert');
var exec = require('child_process').exec;
var path = require('path');
var util = require('util');
var helper = require('./support/helper');
var bin = path.resolve(path.join(__dirname, '..', 'bin', 'carto'));
var fs = require('fs');

describe('bin/carto', function() {
    it('errors on no input', function(done) {
        exec(util.format('node %s', bin), function(err, stdout, stderr) {
            assert.equal(1, err.code);
            assert.equal("carto: no input files ('carto -h or --help' for help)\n", stderr);
            done();
        });
    });
    it('errors on unsupported api version', function(done) {
        var file = path.join('test', 'rendering', 'identity.mml');
        var api = '1.0.0';
        exec(util.format('node %s -a %s %s', bin, api, file), function(err, stdout, stderr) {
            assert.equal(1, err.code);
            assert.equal("Error: Version 1.0.0 is not supported\n", stderr);
            done();
        });
    });
    it('errors on wrongly formatted api version', function(done) {
        var file = path.join('test', 'rendering', 'identity.mml');
        var api = 'api';
        exec(util.format('node %s -a %s %s', bin, api, file), function(err, stdout, stderr) {
            assert.equal(1, err.code);
            assert.equal("Error: Invalid API version. A valid version is e.g. 3.0.0 or 3.0.10\n", stderr);
            done();
        });
    });
    it('renders mml', function(done) {
        var file = path.join('test', 'rendering', 'identity.mml');
        exec(util.format('node %s %s', bin, file), function(err, stdout) {
            assert.ifError(err);
            helper.compareToXMLFile(helper.resultFile(file), stdout, done, [
                helper.removeAbsoluteImages,
                helper.removeAbsoluteDatasources
            ]);
        });
    });
    it('renders mss', function(done) {
        var file = path.join('test', 'rendering-mss', 'empty_name.mss');
        exec(util.format('node %s %s', bin, file), function(err, stdout) {
            assert.ifError(err);
            var expected = file.replace(path.extname(file),'')+'.xml';
            var expected_data = fs.readFileSync(expected, 'utf8');
            assert.equal(stdout.trim(),expected_data.trim());
            done();
        });
    });
});
