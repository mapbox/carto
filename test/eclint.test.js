var lint = require('mocha-eslint');

describe('jslint', function() {
    var paths = [
      'bin',
      'lib',
      'test'
    ];

    var options = {};
    options.formatter = 'compact';
    lint(paths, options);
});
