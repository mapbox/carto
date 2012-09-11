var fs = require('fs'),
    path = require('path');

// Load all stated versions into the module exports
module.exports.version = {};

['2.0.1', '2.0.2', '2.1.0', 'latest'].map(function(version) {
    module.exports.version[version] = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, version, 'reference.json'), 'utf8'));
});
