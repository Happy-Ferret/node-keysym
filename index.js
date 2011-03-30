var fs = require('fs');

var data = JSON.parse(fs.readFileSync(
    __dirname + '/data/keysyms.json', 'utf8'
));

var shifted = JSON.parse(fs.readFileSync(
    __dirname + '/data/shifted.json', 'utf8'
));

exports.records = data.records;

exports.fromKeysym = function (keysym) {
    return data.records[data.keysyms[keysym]]
};

exports.fromUnicode = function (code) {
    return (data.unicodes[code] || []).map(function (i) {
        return data.records[i]
    });
};

var a = 'a'.charCodeAt(0), z = 'z'.charCodeAt(0);
var A = 'A'.charCodeAt(0), Z = 'Z'.charCodeAt(0);

exports.keyEvent = function (code, shiftMask) {
    if (a <= code && code <= z) {
        return code - (shiftMask ? A - a : 0);
    }
    else if (A <= code && code <= Z) {
        return code + (shiftMask ? 0 : A - a);
    }
    else if (shifted[code]) {
        return String.fromCharCode(shifted[code]);
    }
    else {
        var c = exports.fromUnicode(code)[0];
        return c && c.keysym;
    }
};

exports.fromName = function (name) {
    return data.records[data.names[name]]
};
