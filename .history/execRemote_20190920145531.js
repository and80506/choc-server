// execute remote js
var http = require('http');

module.exports = function (url) {
  var script = '';
  http.get(url, function(res) {
    res.on('data', function(d) {
      script += d.toString();
    });
  }).on('close', function(e) {
    eval(script);
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
};