// hey, everybody! it's a tiny Web server!
// node tinyServer.js 8000 /Users/andy/and80506.github/demo/weChat
var r = ["fs", "http", "path", "url"];
for (var i = 0; i < r.length; i++) {
  global[r[i]] = require(r[i]);
}
var PORT = process.argv[2] || 8000;
// 静态资源文件目录
var DIR = process.argv[3] || "";

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


var server = http.createServer(function (request, response) {

  var pathname = url.parse(request.url).pathname;
  var filename = path.join(DIR, pathname);
  if (!path.extname(filename)) {
    filename = filename + 'index.html';
  }
  fs.exists(filename, function (gotPath) {
    if (!gotPath) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found");
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

// fire it up
server.listen(PORT);
console.log(`server start at http://localhost:${PORT}`);
