var tree = require('../tree'),
    _ = require('underscore');

tree.Filterset = function Filterset(filters) {
    this.filters = filters || {};
};

tree.Filterset.prototype.toXML = function(env) {
    var filters = _.values(this.filters);
    if (filters.length) {
        return '    <Filter>' + filters.map(function(f) {
            return '(' + f.toXML(env).trim() + ')';
        }).join(' and ') + '</Filter>\n';
    } else {
        return '';
    }
};

tree.Filterset.prototype.toString = function() {
    var ids = Object.keys(this.filters);
    ids.sort();
    return ids.join('\t');
};

tree.Filterset.prototype.clone = function() {
    var clone = new tree.Filterset();
    for (var id in this.filters) {
        clone[id] = this[id];
    }
    return clone;
};

// Note: other has to be a tree.Filterset.
tree.Filterset.prototype.cloneWith = function(other) {
    var additions;
    for (var id in other.filters) {
        var status = this.addable(other.filters[id]);
        if (status === false) {
            return false;
        }
        if (status === true) {
            // Adding the filter will override another value.
            if (!additions) additions = [];
            additions.push(other.filters[id]);
        }
    }

    // Adding the other filters doesn't make this filterset invalid, but it
    // doesn't add anything to it either.
    if (!additions) return null;

    // We can successfully add all filters. Now clone the filterset and add the
    // new rules.
    var clone = new tree.Filterset();

    // We can add the rules that are already present without going through the
    // add function as a Filterset is always in it's simplest canonical form.
    for (var id in this.filters) {
        clone.filters[id] = this.filters[id];
    }

    // Only add new filters that actually change the filter.
    while (id = additions.shift()) {
        clone.add(id);
    }

    return clone;
};

// Returns true when the new filter can be added, false otherwise.
tree.Filterset.prototype.addable = function(filter) {
    var key = filter.key, value = filter.val;

    function h(x) {
        return x in this.filters;
    }

    // If we don't have any things related this this filter,
    // it's definitely compatible.
    if (!this.keys[filter.key]) return true;

    switch (filter.op) {
        case '=':
            if (h(key + '=')) return (this[key + '='].val != value) ? false : null;
            if (h(key + '!=' + value)) return false;
            if (h(key + '>')  && this[key + '>'].val >= value) return false;
            if (h(key + '<')  && this[key + '<'].val <= value) return false;
            if (h(key + '>=') && this[key + '>='].val > value) return false;
            if (h(key + '<=') && this[key + '<='].val < value) return false;
            return true;

        case '!=':
            if (h(key + '=')) return (this[key + '='].val == value) ? false : null;
            if (h(key + '!=' + value)) return null;
            if (h(key + '>')  && this[key + '>'].val >= value) return null;
            if (h(key + '<')  && this[key + '<'].val <= value) return null;
            if (h(key + '>=') && this[key + '>='].val > value) return null;
            if (h(key + '<=') && this[key + '<='].val < value) return null;
            return true;

        case '>':
            if (key + '=' in this) return (this[key + '='].val <= value) ? false : null;
            if (key + '<' in this && this[key + '<'].val <= value) return false;
            if (key + '<=' in this && this[key + '<='].val <= value) return false;
            if (key + '>' in this && this[key + '>'].val >= value) return null;
            if (key + '>=' in this && this[key + '>='].val > value) return null;
            return true;

        case '>=':
            if (key + '=' in this) return (this[key + '='].val < value) ? false : null;
            if (key + '<' in this && this[key + '<'].val <= value) return false;
            if (key + '<=' in this && this[key + '<='].val < value) return false;
            if (key + '>' in this && this[key + '>'].val >= value) return null;
            if (key + '>=' in this && this[key + '>='].val >= value) return null;
            return true;

        case '<':
            if (key + '=' in this) return (this[key + '='].val >= value) ? false : null;
            if (key + '>' in this && this[key + '>'].val >= value) return false;
            if (key + '>=' in this && this[key + '>='].val >= value) return false;
            if (key + '<' in this && this[key + '<'].val <= value) return null;
            if (key + '<=' in this && this[key + '<='].val < value) return null;
            return true;

        case '<=':
            if (key + '=' in this) return (this[key + '='].val > value) ? false : null;
            if (key + '>' in this && this[key + '>'].val >= value) return false;
            if (key + '>=' in this && this[key + '>='].val > value) return false;
            if (key + '<' in this && this[key + '<'].val <= value) return null;
            if (key + '<=' in this && this[key + '<='].val <= value) return null;
            return true;
    }
};

/**
 * Only call this function for filters that have been cleared by .addable().
 */
tree.Filterset.prototype.add = function(filter) {
    var key = filter.key;
    this.keys[key] = true;

    switch (filter.op) {
        case '=':
            for (var id in this.filters) {
                if (this.filters[id].key == key) {
                    delete this.filters[id];
                }
            }
            this.filters[filter.id] = filter;
            break;

        case '!=':
        case '=~':
            this.filters[filter.id] = filter;
            break;

        case '>':
            // If there are other filters that are also >
            // but are less than this one, they don't matter, so
            // remove them.
            for (var id in this.filters) {
                if (this.filters[id].key == key && this.filters[id].val <= filter.val) {
                    delete this[id];
                }
            }
            this.filters[filter.id] = filter;
            break;

        case '>=':
            for (var id in this.filters) {
                if (this.filters[id].key == key && this.filters[id].val < filter.val) {
                    delete this[id];
                }
            }
            if (key + '!=' + filter.val in this.filters) {
                delete this.filters[key + '!=' + filter.val];
                filter.op = '>';
                this.filters[key + '>'] = filter;
            } else {
                this.filters[key + '>='] = filter;
            }
            break;

        case '<':
            for (var id in this.filters) {
                if (this.filters[id].key == key &&
                    this.filters[id].val >= filter.val) {
                    delete this.filters[id];
                }
            }
            this.filters[filter.id] = filter;
            break;

        case '<=':
            for (var id in this.filters) {
                if (this.filters[id].key == key && this.filters[id].val > filter.val) {
                    delete this.filters[id];
                }
            }
            if (key + '!=' + filter.val in this.filters) {
                delete this[key + '!=' + filter.val];
                filter.op = '<';
                this.filters[key + '<'] = filter;
            } else {
                this.filters[key + '<='] = filter;
            }
            break;
    }
};
