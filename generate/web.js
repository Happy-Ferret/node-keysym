// mash all the keys with this webapp
var express = require('express');
var app = express.createServer();

app.use(express.static(__dirname + '/web'));

app.use(require('browserify')({
    entry : __dirname + '/web/main.js',
    require : [ 'jquery-browserify' ],
}));

app.listen(8080);
