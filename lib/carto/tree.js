/**
 * TODO: document this. What does this do?
 */
module.exports.find = function (obj, fun) {
    for (var i = 0, r; i < obj.length; i++) {
        r = fun.call(obj, obj[i]);
        if (r) { return r; }
    }
    return null;
};
