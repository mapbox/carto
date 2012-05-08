var fs = require('fs'),
    path = require('path'),
    _ = require('underscore');

function tmpl(x) {
  return _.template(fs.readFileSync(path.join(__dirname, x), 'utf-8'));
}

var index = tmpl('index._');
var toc = tmpl('toc._');
var table = tmpl('symbolizers._');
var ref = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/carto/tree/reference.json'), 'utf8'));

fs.writeFileSync(path.join(__dirname, 'carto.tex'), index({
  symbolizers: ref.symbolizers,
  table: table,
  toc: toc,
  _: _
}));
