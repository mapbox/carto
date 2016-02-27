var fs = require('fs'),
    path = require('path'),
    refs = require('mapnik-reference'),
    _ = require('lodash');

function tmpl(x) {
  return _.template(fs.readFileSync(path.join(__dirname, x), 'utf-8'));
}

var index = tmpl('index._');
var table = tmpl('symbolizers._');

 refs.versions.forEach(function (v) {
    var ref = refs.load(v);
    fs.writeFileSync(path.join(__dirname, '../docs/' + v + '.md'), index({
      symbolizers: ref.symbolizers,
      table: table,
      version: v,
      versions: refs.versions,
      _: _
    }));
});
