var assert = require('assert'),
    _ = require('lodash');

var carto = require('../lib/carto');

describe('Reference', function() {
    it('should accept custom reference adhering to spec', function(done) {
        var customRef = {
            load: function (wanted) {
                return {
                    version: wanted,
                    style: {},
                    layer: {},
                    symbolizers: {
                        bla: {
                            width: {
                                css: 'bla-width',
                                type: 'float'
                            }
                        }
                    },
                    colors: {},
                    datasources: {}
                };
            },
            latest: '1.5.0',
            versions: [
                '1.0.0',
                '1.5.0'
            ]
        };
        var renderer = new carto.Renderer({
                reference: customRef
            }),
            output = renderer.renderMSS('#test { bla-width: 1; }');
        assert.equal(output.msg, null);
        assert.equal(output.data, '<Style filter-mode="first" name="style">\n  <Rule>\n    <BlaSymbolizer width="1" />\n  </Rule>\n</Style>\n');
        done();
    });

    it('should reject custom reference not adhering to spec', function(done) {
        var customRef = {
            load: function (wanted) {
                return wanted;
            },
            latest: '1.5.0',
            versions: [
                '1.0.0',
                '1.5.0'
            ]
        };
        var renderer = new carto.Renderer({
                reference: customRef
            }),
            output = renderer.renderMSS('#test { marker-color: #fff; }');
        assert.ok(!_.isNil(output.msg) && output.msg.length > 0);
        assert.equal(output.msg[0].message, 'Could not use the given reference, because it does not adhere to the specification. See the documentation for details.');
        done();
    });

    it('should error on no rules', function(done) {
        var customRef = {
            load: function (wanted) {
                return {
                    version: wanted,
                    style: {},
                    layer: {},
                    symbolizers: {},
                    colors: {},
                    datasources: {}
                };
            },
            latest: '1.5.0',
            versions: [
                '1.0.0',
                '1.5.0'
            ]
        };
        var renderer = new carto.Renderer({
                reference: customRef
            }),
            output = renderer.renderMSS('#test { marker-width: 1; }');
        assert.ok(!_.isNil(output.msg) && output.msg.length > 0);
        assert.equal(output.msg[0].message, 'Unrecognized rule: marker-width.');
        done();
    });
});
