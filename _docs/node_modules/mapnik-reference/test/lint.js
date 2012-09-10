#!/usr/bin/env node

var fs = require('fs');
var references = require("..");

var lint_ref = function(ver) {
    var ref = references.version[ver]
    var symbolizers = ref.symbolizers;

    console.log('Missing doc properties');
    console.log('----------------------');
    var missing_doc_properties = 0;
    var cursim = '';
    for (var symbolizer in symbolizers) {
        if (symbolizer === 'colors') continue;
        for (var prop in symbolizers[symbolizer]) {
            if (!symbolizers[symbolizer][prop].doc) {
                if (symbolizer !== cursim) {
                    cursim = symbolizer;
                    console.log(symbolizer);
                }
                console.log('- ' + prop);
                missing_doc_properties++;
            }
        }
    }
    console.log('----------------------');
    console.log(missing_doc_properties, 'missing doc properties');
    console.log('----------------------');

    console.log('Missing default value');
    console.log('----------------------');
    var missing_doc_properties = 0;
    var cursim = '';
    for (var symbolizer in symbolizers) {
        if (symbolizer === 'colors') continue;
        for (var prop in symbolizers[symbolizer]) {
            if (symbolizers[symbolizer][prop]['default-value'] === undefined) {
                if (symbolizer !== cursim) {
                    cursim = symbolizer;
                    console.log(symbolizer);
                }
                console.log('- ' + prop);
                missing_doc_properties++;
            }
        }
    }
    console.log('----------------------');
    console.log(missing_doc_properties, 'missing default-value');
}

for (var key in references.version) {
    lint_ref(key);
};
