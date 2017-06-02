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

// Sort rules by specificity: this function expects selectors to be
// split already.
//
// Specificity: [ID, Class, Filters, Zoom, Position in document]
//
// Written to be used as a .sort(Function);
// argument.
//
// [1, 0, 0, 467] > [0, 0, 1, 520]
module.exports.specificitySort = function (a, b) {
    var as = a.specificity;
    var bs = b.specificity;

    if (as[0] != bs[0]) { // ID
        return bs[0] - as[0];
    }
    if (as[1] != bs[1]) { // Class
        return bs[1] - as[1];
    }
    if (as[2] != bs[2]) { // Filters
        return bs[2] - as[2];
    }
    if (as[3] != -1 && bs[3] != -1 && as[3] != bs[3]) { // Zoom
        return bs[4] - as[4];
    }
    return bs[4] - as[4]; // Position in document
};
