var assert = require('assert');
var tree = require('../lib/carto/tree.js');

describe('Rule', function() {
    describe('To string', function() {
        it('with zoom', function() {
            const rule = new tree.Rule(new tree.Reference(null), 'name', 'value', 'index', 'filename');
            rule.zoom = (new tree.Zoom()).setZoom((1 << 2 | 1 << 3 | 1 << 4))
            assert.equal(rule.toString(), '[..XXX.....................] name: value')
        });
        it('without zoom', function() {
            const rule = new tree.Rule(new tree.Reference(null), 'name', 'value', 'index', 'filename');
            assert.equal(rule.toString(), '[..........................] name: value')
        });
    });
});
