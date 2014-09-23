var sys = require('sys');

(function(tree) {

tree.RenderNode = function RenderNode(name, pseudoname, index) {
    this.name = name || '';
    this.pseudoname = pseudoname || '';
    this.index = index || 0;
    this.attributes = {};
    this.children = {};
};

tree.RenderNode.prototype.addAttribute = function(rule) {
    if (rule.pseudoelements.length) {
        return this.addSubAttribute(rule.pseudoelements.slice(), rule);
    }
    if (rule.name in this.attributes) {
        return false;
    }
    this.attributes[rule.name] = rule;
    return true;
};

tree.RenderNode.prototype.addSubAttribute = function(pseudoelements, rule) {
    if (pseudoelements.length) {
        var pseudo = pseudoelements.shift(),
            type = tree.Reference.elementName(pseudo.name),
            key = type + '/' + pseudo.name + '/' + pseudo.index;
        if (!this.children[key]) {
            this.children[key] = new tree.RenderNode(type, pseudo.name, pseudo.index);
        }
        return this.children[key].addSubAttribute(pseudoelements, rule);
    }
    if (rule.name in this.attributes) {
        return false;
    }
    this.attributes[rule.name] = rule;
    return true;
};

tree.RenderNode.prototype.sortChildren = function(env) {
    var child, child_types, type_index, pseudo_index,
        child_order = [];
    for (var key in this.children) {
        child = this.children[key];
        child_types = tree.Reference.childTypes(this.name),
        type_index = child_types ? child_types.indexOf(child.name) : -1;
        pseudo_index = parseInt(child.index);

        if (type_index === -1) {
            env.error({
                message: "Cannot add pseudo element type '" + child.pseudoname + "' to '" + this.pseudoname + "'.",
                type: 'syntax'
            });
            return [];
        }
        if (pseudo_index === NaN || pseudo_index < 0) {
            env.error({
                message: "Invalid pseudo element index:'" + child.index + ". Index must be a positive integer.",
                type: 'syntax'
            });
            return [];
        }
        child_order.push([key, type_index, pseudo_index]);
    }
    return child_order.sort(function (a, b) {
                if (a[1] === b[1]) {
                    return a[2] - b[2];
                }
                return a[1] - b[1]; 
            }).map(function(v) { return v[0]; });
}

tree.RenderNode.prototype.tagName = function(property) {
    function capitalize(str) { return str[1].toUpperCase(); }
    return property.charAt(0).toUpperCase() +
           property.slice(1).replace(/\-./g, capitalize);
};

function indent(indentation) {
    return Array(indentation + 1).join('  ');
}

tree.RenderNode.prototype.toXML = function(env, indentation) {
    indentation = indentation || 2;
    var xml = '', fail = tree.Reference.requiredProperties(this.name, this.attributes);
    if (fail) {
        var rule = this.attributes[Object.keys(this.attributes).shift()];
        env.error({
            message: fail,
            index: rule.index,
            filename: rule.filename
        });
    }

    var name = this.tagName(this.name);

    var hastags = Object.keys(this.children).length, selfclosing = !hastags,
        tagcontent = '', beforecontent = '', aftercontent = '', x;
    xml += indent(indentation) + '<' + name + ' ';
    for (var j in this.attributes) {
        if (this.name === 'map') env.error({
            message: 'Map properties are not permitted in other rules',
            index: this.attributes[j].index,
            filename: this.attributes[j].filename
        });
        if (this.is === 'SymbolizerNode') {
            x = tree.Reference.selector(this.attributes[j].name);
        }
        else {
            x = tree.Reference.selector(this.attributes[j].name, this.name);
        }
        if (x && x.serialization && (x.serialization === 'content'|| x.serialization === 'tag')) {
            selfclosing = false;
            tagcontent = this.attributes[j].ev(env).toXML(env, true);
        } else {
            xml += this.attributes[j].ev(env).toXML(env) + ' ';
        }
    }

    // Wrap content in CDATA if it does not contain XML tags
    if (tagcontent !== undefined) {
        if (tagcontent.indexOf('<') == -1) {
            tagcontent = '<![CDATA[' + tagcontent + ']]>';
        }
        else {
            hastags = true;
        }
    }

    // Add child nodes to the XML
    var child, properties, child_order = this.sortChildren(env);
    for (var i = 0; i < child_order.length; i++) {
        child = this.children[child_order[i]];
        properties = tree.Reference.pseudoProperties(child.pseudoname);
        console.log('%j', properties);
        if (properties && properties.behavior === "prepend") {
            beforecontent = child.toXML(env, indentation + 1) + beforecontent;
        }
        else {
            aftercontent += child.toXML(env, indentation + 1);
        }
    }

    if (selfclosing) {
        xml += '/>\n';
    }
    else {
        xml += '>';
        if (hastags) {
            xml += '\n'
                + beforecontent
                + indent(indentation + 1)
                + tagcontent
                + '\n'
                + aftercontent
                + indent(indentation);
        }
        else {
            xml += tagcontent;
        }
        xml += '</' + name + '>\n';
    }
    return xml;
};

tree.RenderNode.prototype.is = "RenderNode";

// Extend RenderNode for symbolizers,
// having no index and modified tagName.
tree.SymbolizerNode = function(name) {
    this.name = name || '';
    this.pseudoname = name;
    this.index = 0;
    this.attributes = {};
    this.children = {};
}
tree.SymbolizerNode.prototype = new tree.RenderNode();
tree.SymbolizerNode.prototype.tagName = function(property) {
    return tree.RenderNode.prototype.tagName(property) + "Symbolizer";
};
tree.SymbolizerNode.prototype.is = "SymbolizerNode";

})(require('../tree'));
