var _ = require('lodash');

var Util = function () {
    this.processMessage = function (env, message) {
        if (!env.msg) {
            env.msg = [];
        }

        if (message.type === 'error' ||
            (message.type === 'warning' && !env.quiet)) {
            if (!_.isNil(message.filename) && !_.isNil(message.index) &&
                env.inputs && env.inputs[message.filename]) {
                _.assign(message, this.getLineColumn(env.inputs[message.filename], message.index));
                _.unset(message.index);
            }

            // add to messages collection if it not already exists
            if (_.isNil(_.find(env.msg, function (v) {
                return message.message === v.message &&
                    message.filename === v.filename &&
                    message.line === v.line &&
                    message.column === v.column &&
                    message.type === v.type;
            }))) {
                env.msg.push(message);
            }
        }
    };
};

Util.prototype.getLineColumn = function (input, index) {
    var lineCol = {
        line: 0,
        column: -1
    };

    if (!_.isNil(input) && !_.isNil(index)) {
        lineCol.line = (input.slice(0, index).match(/\n/g) || '').length + 1;
        for (var n = index; n >= 0 && input.charAt(n) !== '\n'; n--) {
            lineCol.column++;
        }
    }

    return lineCol;
};

Util.prototype.hasErrors = function (messages) {
    return typeof _.find(messages, ['type', 'error']) !== 'undefined';
};

Util.prototype.getMessagesToPrint = function (messages) {
    var messageOutput = '',
        that = this;

    _.forEach(messages, function (v) {
        messageOutput += that.getMessageToPrint(v) + '\n';
    });

    return messageOutput.trim();
};

Util.prototype.getMessageToPrint = function (message) {
    var messageOutput = '';

    message.type = message.type.charAt(0).toUpperCase() + message.type.slice(1);

    if (!_.isNil(message.filename)) {
        if (message.line >= 0) {
            if (message.column >= 0) {
                messageOutput = _.template('<%=type%>: <%=filename%>:<%=line%>:<%=column%> <%=message%>')(message);
            }
            else {
                messageOutput = _.template('<%=type%>: <%=filename%>:<%=line%> <%=message%>')(message);
            }
        }
        else {
            messageOutput = _.template('<%=type%>: <%=filename%> <%=message%>')(message);
        }
    }
    else {
        messageOutput = _.template('<%=type%>: <%=message%>')(message);
    }

    return messageOutput;
};

Util.prototype.warning = function (env, message) {
    _(message).defaults({
        type: 'warning',
        message: 'Unspecified warning.',
        filename: null,
        line: -1,
        column: -1
    }).value();

    this.processMessage(env, message);
};

Util.prototype.error = function (env, message) {
    _(message).defaults({
        type: 'error',
        message: 'Unspecified error.',
        filename: null,
        line: -1,
        column: -1
    }).value();

    this.processMessage(env, message);
}

Util.prototype.jsonToXML = function (json, level) {
    var that = this,
        intendation = '';

    if (typeof level === 'undefined') {
        level = 0;
    }
    for (var i = 0; i < level; i++) {
        intendation += '  ';
    }

    if (_.isObject(json) && !_.isArray(json)) {
        if (_.has(json, '_name')) {
            var output = intendation + '<' + json._name;

            if (_.has(json, '_attributes') && Object.keys(json._attributes).length) {
                var attributes = [];

                // output attributes sorted in alphabetical order
                Object.keys(json._attributes).sort().forEach(function (v) {
                    attributes.push(v + '="' + json._attributes[v] + '"');
                });
                output += ' ' + attributes.join(' ');
            }

            if (_.has(json, '_content')) {
                var content = that.jsonToXML(json._content, level + 1);

                // check if there are subtags
                if (content.indexOf('</') == -1 && content.indexOf('/>') == -1) {
                    output += '>' + content + '</' + json._name + '>\n';
                }
                else {
                    output += '>\n' + content;
                    output += intendation + '</' + json._name + '>\n';
                }

            }
            else {
                output += ' />\n';
            }
            return output;
        }
    }
    else if (_.isArray(json)) {
        if (json.length) {
            if (_.isObject(json[0])) {
                return json.map(function (o) {
                    return that.jsonToXML(o, level);
                }).join('');
            }
            else {
                return json.join(',');
            }
        }
    }
    else {
        if (_.isString(json)) {
            return '<![CDATA[' + json + ']]>';
        }
        else if (!_.isNil(json)) {
            return json.toString();
        }
    }
    return '';
};

module.exports = new Util();
