var r = ['fs', 'http', 'path', 'url'];
for (var i = 0; i < r.length; i++) {
    global[r[i]] = require(r[i]);
}

var types = {
    'image/gif': ['gif'],
    'image/jpeg': ['jpeg', 'jpg', 'jpe'],
    'image/jpm': ['jpm'],
    'image/jpx': ['jpx', 'jpf'],
    'image/png': ['png'],
    'image/svg+xml': ['svg', 'svgz'],
    'image/webp': ['webp'],
    'text/css': ['css'],
    'text/csv': ['csv'],
    'text/html': ['html', 'htm', 'shtml'],
    'text/jade': ['jade'],
    'text/javascript': ['js'],
    'text/jsx': ['jsx'],
    'text/less': ['less'],
    'text/markdown': ['markdown', 'md'],
    'text/plain': ['txt', 'text', 'conf', 'def', 'list', 'log', 'in', 'ini'],
};
var reverseTypes = {};
for (var key in types) {
    types[key].forEach(function (mime) {
        reverseTypes[mime] = key;
    });
}

function ifExtExists(pathname) {
    var mime = parseExt(parseLast(pathname));
    return Object.keys(reverseTypes).includes(mime);
}

function parseLast(path) {
    return path.replace(/^.*[/\\]/, '').toLowerCase();
}

function parseExt(last) {
    return last.replace(/^.*\./, '').toLowerCase();
}

function mimeLookup(path) {
    path = String(path);
    var last = parseLast(path);
    var ext = parseExt(last);

    var hasPath = last.length < path.length;
    var hasDot = ext.length < last.length - 1;

    return ((hasDot || !hasPath) && reverseTypes[ext]) || null;
}

function notFoundResponse(response, filename) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.write('filename ' + filename + ' not found');
    response.end();
}

function createServer(port, dir) {
    fs.stat(dir, function (err) {
        if (err) {
            console.error(`Got error: dir ${dir} not exist.`);
            return;
        }
        var server = http.createServer(function (request, response) {
            var pathname = url.parse(request.url).pathname;
            var filename = path.join(dir, decodeURIComponent(pathname));
            if (filename.endsWith('/')) {
                fs.readdir(filename, (err, files) => {
                    if (err) {
                        notFoundResponse(response, filename);
                        return;
                    }
                    var responseContent = '';
                    files.forEach((file) => {
                        var showFileName = file;
                        if (fs.lstatSync(path.resolve(filename, file)).isDirectory()) {
                            showFileName += '/';
                        }
                        responseContent +=
                            '<li><a href="' +
                            request.url +
                            showFileName +
                            '">' +
                            showFileName +
                            '</a></li>';
                    });
                    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    response.write('Directory:<ul>' + responseContent + '</ul>');
                    response.end();
                });
            } else if (ifExtExists(filename)) {
                fs.stat(filename, function (err, stats) {
                    if (err) {
                        notFoundResponse(response, filename);
                        return;
                    }
                    response.writeHead(200, {
                        'Content-Type': mimeLookup(filename) + '; charset=utf-8',
                    });
                    fs.createReadStream(filename, {
                        flags: 'r',
                        encoding: 'binary',
                        mode: 0666,
                        bufferSize: 4 * 1024,
                    })
                        .addListener('data', function (chunk) {
                            response.write(chunk, 'binary');
                        })
                        .addListener('close', function () {
                            response.end();
                        });
                });
            } else {
                notFoundResponse(response, filename);
            }
        });

        server.listen(port);
        console.log(`server start at http://localhost:${port}`);
    });
}

module.exports = createServer;
