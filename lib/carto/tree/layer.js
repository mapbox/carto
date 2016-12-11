var semver = require('semver');

(function(tree) {

tree.LayerXML = function(obj, styles) {
    var dsoptions = [];
    for (var i in obj.Datasource) {
        dsoptions.push('<Parameter name="' + i + '"><![CDATA[' +
            obj.Datasource[i] + ']]></Parameter>');
    }

    var apiVersion = tree.Reference.data['version'];

    var prop_string = '';
    for (var prop in obj.properties) {
        if (prop === 'minzoom') {
            if (semver.gte(apiVersion, '3.0.0')) {
                prop_string += '  maximum-scale-denominator="'
            }
            else {
                prop_string += '  maxzoom="'
            }
            prop_string += tree.Zoom.ranges[obj.properties[prop]] + '"\n';
        } else if (prop === 'maxzoom') {
            if (semver.gte(apiVersion, '3.0.0')) {
                prop_string += '  minimum-scale-denominator="'
            }
            else {
                prop_string += '  minzoom="'
            }
            prop_string += tree.Zoom.ranges[obj.properties[prop]+1] + '"\n';
        } else {
            prop_string += '  ' + prop + '="' + obj.properties[prop] + '"\n';
        }
    }

    return '<Layer' +
        ' name="' + new tree.Quoted(obj.layerId).toString() + '"\n' +
        prop_string +
        ((typeof obj.status === 'undefined') ? '' : '  status="' + obj.status + '"\n') +
        ((typeof obj.srs === 'undefined') ? '' : '  srs="' + obj.srs + '"') + '>\n    ' +
        styles.reverse().map(function(s) {
            return '<StyleName>' + s + '</StyleName>';
        }).join('\n    ') +
        (dsoptions.length ?
        '\n    <Datasource>\n       ' +
        dsoptions.join('\n       ') +
        '\n    </Datasource>\n'
        : '') +
        '  </Layer>\n';
};

})(require('../tree'));
