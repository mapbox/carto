var tree = require('../tree');
var _ = require('lodash');

tree.Filterset = function Filterset() {
    this.filters = [];
};

tree.Filterset.prototype.toXML = function(env) {
    if (this.filters.length) {
        var orGroups = _.groupBy(this.filters, function(f) {
            return f.key;
        });
        var groups = [];
        for (var g in orGroups) {
            groups.push('(' + orGroups[g].map(function(f) {
                return '(' + f.toXML(env).trim() + ')';
            }).join(' or ') + ')');
        }
        return '    <Filter>' + groups.join(' and ') + '</Filter>\n';
    } else {
        return '';
    }
};

tree.Filterset.prototype.toString = function() {
    var arr = [];
    for (var id in this.filters) arr.push(this.filters[id].id);
    return arr.sort().join('\t');
};

tree.Filterset.prototype.eval = function(env) {
    for (var i in this.filters) {
        this.filters[i].eval(env);
    }
    return this;
};

tree.Filterset.prototype.clone = function() {
    var clone = new tree.Filterset();
    for (var id in this.filters) {
        clone.filters[id] = this.filters[id];
    }
    return clone;
};

// Note: other has to be a tree.Filterset.
tree.Filterset.prototype.cloneWith = function(other) {
    var additions = [];
    for (var i = 0; i < other.filters.length; i++) {
        additions.push(other.filters[i]);
    }

    // Adding the other filters doesn't make this filterset invalid, but it
    // doesn't add anything to it either.
    if (!additions.length) return null;

    // We can successfully add all filters. Now clone the filterset and add the
    // new rules.
    var clone = new tree.Filterset();

    // We can add the rules that are already present without going through the
    // add function as a Filterset is always in it's simplest canonical form.
    for (id in this.filters) {
        clone.filters.push(this.filters[id]);
    }

    // Only add new filters that actually change the filter.
    while (id = additions.shift()) {
        clone.add(id);
    }

    return clone;
};

tree.Filterset.prototype.add = function(filter) {
    if (!_.find(this.filters, function(f) {
        return f.op == filter.op &&
            f.value == filter.value &&
            f.key == filter.key;
    })) {
        this.filters.push(filter);
    }
};
