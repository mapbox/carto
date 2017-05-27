var _ = require('lodash');

var Util = function () {};

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

    if (!_.isNil(message.filename)) {
        if (message.line >= 0) {
            if (message.column >= 0) {
                messageOutput = _.template('<%=filename%>:<%=line%>:<%=column%> <%=message%>')(message);
            }
            else {
                messageOutput = _.template('<%=filename%>:<%=line%> <%=message%>')(message);
            }
        }
        else {
            messageOutput = _.template('<%=filename%> <%=message%>')(message);
        }
    }
    else {
        messageOutput = _.template('<%=message%>')(message);
    }

    return messageOutput;
};

Util.prototype.warning = function (env, warning) {
    _(warning).defaults({
        message: 'Unspecified warning.',
        filename: null,
        line: -1,
        column: -1
    }).value();

    if (!env.warnings) {
        env.warnings = [];
    }

    if (!env.quiet) {
        if (!_.isNil(warning.filename) && !_.isNil(warning.index) &&
            env.inputs && env.inputs[warning.filename]) {
            _.assign(warning, this.getLineColumn(env.inputs[warning.filename], warning.index));
        }

        // add to warnings collections if it not already exists
        if (_.isNil(_.find(env.warnings, function (v) {
            return warning.message === v.message &&
                warning.filename === v.filename &&
                warning.line === v.line &&
                warning.column === v.column;
        }))) {
            env.warnings.push(warning);
        }
    }
};

Util.prototype.error = function (env, error) {
    _(error).defaults({
        message: 'Unspecified error.',
        filename: null,
        line: -1,
        column: -1
    }).value();

    if (!env.errors) {
        env.errors = [];
    }

    if (!_.isNil(error.filename) && !_.isNil(error.index) &&
        env.inputs && env.inputs[error.filename]) {
        _.assign(error, this.getLineColumn(env.inputs[error.filename], error.index));
    }

    // add to errors collections if it not already exists
    if (_.isNil(_.find(env.errors, function (v) {
        return error.message === v.message &&
            error.filename === v.filename &&
            error.line === v.line &&
            error.column === v.column;
    }))) {
        env.errors.push(error);
    }

    return new Error(this.getMessageToPrint(error));
}

module.exports = new Util();
