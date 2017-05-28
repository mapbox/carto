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

module.exports = new Util();
