var fs = require('fs');
var file = __dirname + '/data/keysyms.json';
var data = JSON.parse(fs.readFileSync(file).toString());

exports.records = data.records;

exports.fromKeysym = function (keysym) {
    return data.records[data.keysyms[keysym]]
};

exports.fromUnicode = function (code) {
    return data.records[data.unicodes[code]]
};

exports.fromName = function (name) {
    return data.records[data.names[name]]
};