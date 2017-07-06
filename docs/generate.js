var fs = require('fs'),
    path = require('path'),
    refs = require('mapnik-reference'),
    _ = require('lodash');

function tmpl(x) {
  return _.template(fs.readFileSync(path.join(__dirname, x), 'utf-8'));
}

function substituteReSt(str) {
    str = str.replace(/\`/g, '``');

    return str;
}

var index = tmpl('mapnik_api._'),
    table = tmpl('symbolizers._'),
    versions = [];

refs.versions.forEach(function (v) {
    var ref = refs.load(v),
        output = '';

    output += v + '\n' + Array(v.length + 1).join('=') + '\n';
    output += table({
      style: ref.style,
      symbolizers: ref.symbolizers,
      subst: substituteReSt,
      _: _
    });
    output += '\n\n';

    versions.push('.. include:: api/mapnik/' + v + '.rst');

    fs.writeFileSync(path.join(__dirname, 'api/mapnik/' + v + '.rst'), output);
});

fs.writeFileSync(path.join(__dirname, 'mapnik_api.rst'), index({versions: versions.reverse().join('\n')}));
