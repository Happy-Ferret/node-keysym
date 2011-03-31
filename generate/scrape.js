// Scraper for http://www.cl.cam.ac.uk/~mgk25/ucs/keysyms.txt
var Lazy = require('lazy');
var Hash = require('hashish');
var fs = require('fs');

var s = fs.createReadStream(__dirname + '/data/keysyms.txt');
var re = /^0x([\da-f]+)\s+U([\da-f]+)\s+(\S+)\s+# (\S+)/;
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
            if (data.keysyms[rec.keysym]) {
                var i = data.keysyms[rec.keysym];
                data.records[i].names.push(rec.name);
                data.names[rec.name] = i;
            }
            else {
                var i = data.records.length;
                
                if (!data.unicodes[rec.unicode]) data.unicodes[rec.unicode] = [];
                data.unicodes[rec.unicode].push(i);
                
                data.names[rec.name] = i;
                data.keysyms[rec.keysym] = i;
                
                rec.names = [ rec.name ];
                delete rec.name;
                data.records.push(rec);
            }
        });
        fs.createWriteStream(__dirname + '/data/keysyms.json')
            .write(JSON.stringify(data));
    })
;
