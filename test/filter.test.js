var assert = require('assert');
var tree = require('../lib/carto/tree.js');
require('../lib/carto/tree/field');
require('../lib/carto/tree/dimension');
require('../lib/carto/tree/filter');

describe('Field', function() {
    describe('basic functionality', function() {
        var ref = new tree.Reference();
        ref.setVersion(ref.getLatest());
        it('should be constructed', function() {
            var f = new tree.Filter(new tree.Field('foo'), '=', new tree.Dimension(1));
            assert.ok(f);
        });
        it('can be evaluated', function() {
            var f = new tree.Filter(new tree.Field('foo'), '=', new tree.Dimension(1));
            f.ev({ ref: ref });
            assert.ok(f);
        });
        it('yields object', function() {
            var f = new tree.Filter(new tree.Field('foo'), '=', new tree.Dimension(1));
            f.ev({ ref: ref });
            assert.equal(f.toObject({ ref: ref }), '[foo] = 1');
        });
    });
});
