// Scraper for http://www.cl.cam.ac.uk/~mgk25/ucs/keysyms.txt
var Lazy = require('lazy');
var Hash = require('traverse/hash');
var fs = require('fs');

var s = fs.createReadStream(__dirname + '/data/keysyms.txt');
var re = /^0x([\da-f]+)\s+U([\da-f]+)\s+(\S+)\s+# (.+)/;
Lazy(s).lines.map(String)
    .filter(function (line) { return line.match(re) })
    .map(function (line) {
        var xs = line.match(re).slice(1);
        xs[0] = parseInt(xs[0], 16);
        xs[1] = parseInt(xs[1], 16);
        return Hash.zip('keysym unicode status name'.split(' '), xs);
    })
    .join(function (records) {
        var data = { records : [], keysyms : {}, unicodes : {}, names : {} };
        records.forEach(function (rec) {
            var i = data.records.length;
            data.records.push(rec);
            
            data.keysyms[rec.keysym] = i;
            data.unicodes[rec.unicode] = i;
            data.names[rec.name] = i;
        });
        fs.createWriteStream(__dirname + '/data/keysyms.json')
            .write(JSON.stringify(data));
    })
;
