#!/usr/bin/env python

try:
    # <= python 2.5
    import simplejson as json
except ImportError:
    # >= python 2.6
    import json

versions = ['2.0.1', '2.0.2', '2.1.0', 'latest']

for v in versions:
    print '-- testing %s/reference.json' % v
    reference = json.load(open('%s/reference.json' % v, 'r'))
    assert reference
    assert reference['version'] == v,"%s not eq to %s" % (reference['version'],v)
    for sym in reference['symbolizers'].items():
        assert sym[1]
        for i in sym[1].items():
            if sym[0] not in ['map','*']:
                group_name = sym[0]
                if group_name == 'markers':
                    group_name = 'marker'
                css_name = i[1]['css']
                assert group_name in css_name, "'%s' not properly prefixed by '%s'" % (css_name,group_name)
            assert 'type' in i[1].keys(), '%s: type not in %s' % (sym[0], i[0])
            assert 'doc' in i[1].keys(), '%s: doc string not in %s' % (sym[0], i[0])
            assert 'css' in i[1].keys(), '%s: css not in %s' % (sym[0], i[0])

print '... oh yeah, tests passed'
