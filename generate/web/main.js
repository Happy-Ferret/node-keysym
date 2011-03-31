var $ = require('jquery-browserify');

$(window).keydown(function (ev) {
    $('#codes').text(ev.which);
});
