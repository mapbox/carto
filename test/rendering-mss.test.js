var path = require('path'),
    assert = require('assert'),
    fs = require('fs'),
    _ = require('lodash'),
    existsSync = require('fs').existsSync || require('path').existsSync;

var carto = require('../lib/carto'),
    helper = require('./support/helper'),
    util = require('../lib/carto/util');

describe('Rendering mss', function() {
helper.files('rendering-mss', 'mss', function(file) {
    it('should render mss ' + path.basename(file) + ' correctly', function(done) {
        var mss = helper.mss(file),
            output = new carto.Renderer({
                paths: [ path.dirname(file) ],
                data_dir: path.join(__dirname, '../data'),
                local_data_dir: path.join(__dirname, 'rendering'),
                filename: file
            }).renderMSS(mss);
        if (!_.isNil(output.data)) {
            var expected =  file.replace(path.extname(file),'')+'.xml';
            if (!existsSync(expected)) {
              fs.writeFileSync(expected,output);
            }
            var expected_data = fs.readFileSync(expected).toString();
            assert.equal(output.data.trim(),expected_data.trim());
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
