// execute remote js
var http = require('http');
var url = 'http://localhost:8000/index.js';
var script = '';

module.exports = function () {
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