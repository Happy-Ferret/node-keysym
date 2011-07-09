var assert = require('assert');
var ks = require('keysym');
var Hash = require('hashish');

exports.symmetric = function () {
    assert.ok(ks.records.length > 50); // at least
    ks.records.forEach(function (rec) {
        var k = ks.fromKeysym(rec.keysym);
        assert.deepEqual(rec, k);
        
        var u = ks.fromUnicode(rec.unicode)
            .filter(function (r) { return r.names == rec.names })[0];
        assert.deepEqual(rec, u);
        
        rec.names.forEach(function (name) {
            var n = ks.fromName(name);
            assert.deepEqual(rec, n);
        });
    });
};

var Lazy = require('lazy');
var fs = require('fs');
exports.fromFile = function () {
    var s = fs.createReadStream(__dirname + '/../data/keysyms.txt');
    Lazy(s).lines.map(String)
        .filter(function (line) { return line.match(/^0x/) })
        .forEach(function (line) {
            var m = line.match(/0x(\S+)\s+U(\S+)/)
                .slice(1)
                .map(function (x) { return parseInt(x, 16) })
            ;
            var sym = m[0], code = m[1];
            var name = line.match(/# (\S+)/)[1];
            
            var r1 = ks.fromName(name);
            assert.equal(r1.keysym, sym);
            assert.equal(r1.unicode, code);
            
            var r2 = ks.fromKeysym(sym);
            assert.equal(r2.keysym, sym);
            assert.equal(r2.unicode, code);
            
            assert.equal(r1.names, r2.names);
        })
    ;
};
