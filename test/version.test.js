var carto = require('../lib/carto');
var path = require('path');
var assert = require('assert');


describe('Version check', function() {
    it('test version matches package.json version and changelog', function() {
        var info;
        if (parseInt(process.version.split('.')[1], 10) > 4) {
            info = require('../package.json');
            assert.deepEqual(info.version.split('.'), carto.version);
        } else {
            info = JSON.parse(require('fs').readFileSync(path.join(__dirname,'../package.json')));
            assert.deepEqual(info.version.split('.'), carto.version);
        }
    });
});
