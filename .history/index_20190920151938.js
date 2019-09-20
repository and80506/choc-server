var r = ["fs", "http", "path", "url"];
for (var i = 0; i < r.length; i++) {
  global[r[i]] = require(r[i]);
}

var types = {
  "image/gif": ["gif"],
  "image/jpeg": ["jpeg", "jpg", "jpe"],
  "image/jpm": ["jpm"],
  "image/jpx": ["jpx", "jpf"],
  "image/png": ["png"],
  "image/svg+xml": ["svg", "svgz"],
  "image/webp": ["webp"],
  "text/css": ["css"],
  "text/csv": ["csv"],
  "text/html": ["html", "htm", "shtml"],
  "text/jade": ["jade"],
  "text/jsx": ["jsx"],
  "text/less": ["less"],
  "text/markdown": ["markdown", "md"],
  "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"],
};

function mimeLookup(path) {
  path = String(path);
  var last = path.replace(/^.*[/\\]/, '').toLowerCase();
  var ext = last.replace(/^.*\./, '').toLowerCase();

  var hasPath = last.length < path.length;
  var hasDot = ext.length < last.length - 1;

  return (hasDot || !hasPath) && types[ext] || null;
}

function createServer(port, dir) {
  fs.stat(dir, function (err){
    if (err) {
      console.error("dir not exist.")
    }
    var server = http.createServer(function (request, response) {
      var pathname = url.parse(request.url).pathname;
      var filename = path.join(dir, pathname);
      if (!path.extname(filename)) {
        if (require.url.lastIndexOf('/') !== -1) {
          filename += '/';
        }
        filename = filename + 'index.html';
      }
      fs.stat(filename, function (err, stats) {
        if (err) {
          response.writeHead(404, {"Content-Type": "text/plain"});
          response.write(filename + " 404 Not Found");
          response.end();
          return;
        }
        response.writeHead(200, {'Content-Type': mimeLookup(filename)});
        fs.createReadStream(filename, {
          'flags': 'r',
          'encoding': 'binary',
          'mode': 0666,
          'bufferSize': 4 * 1024
        }).addListener("data", function (chunk) {
          response.write(chunk, 'binary');
        }).addListener("close", function () {
          response.end();
        });
  
      });
    });
  
    server.listen(port);
    console.log(`server start at http://localhost:${port}`);
  });
}

module.exports = createServer;