var r = ['fs', 'http', 'path', 'url'];
for (var i = 0; i < r.length; i++) {
    global[r[i]] = require(r[i]);
}

var types = {
    'application/epub+zip': ['epub'],
    'application/gzip': ['gz'],
    'application/java-archive': ['jar'],
    'application/json': ['json', 'map'],
    'application/ld+json': ['jsonld'],
    'application/msword': ['doc'],
    'application/octet-stream': ['bin'],
    'application/ogg': ['ogx'],
    'application/pdf': ['pdf'],
    'application/rtf': ['rtf'],
    'application/vnd.amazon.ebook': ['azw'],
    'application/vnd.apple.installer+xml': ['mpkg'],
    'application/vnd.mozilla.xul+xml': ['xul'],
    'application/vnd.ms-excel': ['xls'],
    'application/vnd.ms-fontobject': ['eot'],
    'application/vnd.ms-powerpoint': ['ppt'],
    'application/vnd.oasis.opendocument.presentation': ['odp'],
    'application/vnd.oasis.opendocument.spreadsheet': ['ods'],
    'application/vnd.oasis.opendocument.text': ['odt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['pptx'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
    'application/vnd.rar': ['rar'],
    'application/vnd.visio': ['vsd'],
    'application/x-7z-compressed': ['7z'],
    'application/x-abiword': ['abw'],
    'application/x-bzip': ['bz'],
    'application/x-bzip2': ['bz2'],
    'application/x-csh': ['csh'],
    'application/x-freearc': ['arc'],
    'application/x-httpd-php': ['php'],
    'application/x-sh': ['sh'],
    'application/x-shockwave-flash': ['swf'],
    'application/x-tar': ['tar'],
    'application/xhtml+xml': ['xhtml'],
    'application/xml': ['xml'],
    'application/zip': ['zip'],
    'audio/aac': ['aac'],
    'audio/midi audio/x-midi': ['mid', 'midi'],
    'audio/mpeg': ['mp3'],
    'audio/ogg': ['oga'],
    'audio/opus': ['opus'],
    'audio/wav': ['wav'],
    'audio/webm': ['weba'],
    'font/otf': ['otf'],
    'font/ttf': ['ttf'],
    'font/woff': ['woff'],
    'font/woff2': ['woff2'],
    'image/bmp': ['bmp'],
    'image/gif': ['gif'],
    'image/jpeg': ['jpeg', 'jpg', 'jpe'],
    'image/png': ['png'],
    'image/svg+xml': ['svg'],
    'image/tiff': ['tif', 'tiff'],
    'image/vnd.microsoft.icon': ['ico'],
    'image/webp': ['webp'],
    'text/calendar': ['ics'],
    'text/css': ['css'],
    'text/csv': ['csv'],
    'text/html': ['htm', 'html'],
    'text/javascript': ['js', 'mjs'],
    'text/plain': ['txt'],
    'video/3gpp': ['3gp'],
    'video/3gpp2': ['3g2'],
    'video/mp2t': ['ts'],
    'video/mpeg': ['mpeg'],
    'video/ogg': ['ogv'],
    'video/webm': ['webm'],
    'video/x-msvideo': ['avi'],
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

    return ((hasDot || !hasPath) && reverseTypes[ext]) || 'text/plain';
}

function notFoundResponse(response, filename) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.write('filename ' + filename + ' not found');
    response.end();
}

function createServer(options) {
    var server = null;
    var port = options.port;
    var root = options.root;
    if (!root) {
        throw new Error('Root path not specified');
    }
    if (!port) {
        throw new Error('Port not specified');
    }
    fs.stat(root, function (err) {
        if (err) {
            console.error(`Got error: root ${root} not exist.`);
            return;
        }
        server = http.createServer(function (request, response) {
            var pathname = url.parse(request.url).pathname;
            var filename = path.join(root, decodeURIComponent(pathname));

            if (request.method === 'GET' && pathname === '/favicon.ico') {
                var img = Buffer.from(
                    'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADH0lEQVRYR82XW0hUQRjH/+fs3bRcxXS9FeQqXljdzbwQZVISadlbRWUaFlb40ENlj10goh6CitjUQLMX39SiC0EESZitJkaaimFe2LXLGrqsrqtnYo/t0tF1d9RtbV7mcM433/8333zzzRkGq9yYVdaHCyA7M0PPES7RH0AMYGlpNRQ4tFwAGek6otOl+UMf7e0daDW089oCgJOlJdiWpUVvdxdU4WE8jHH0O+ITk5CQovEJXHV1Laoe1CwOEBelRE9nG1Qq1RyA0YgEzWbs2FPoHwCfqHhxsmgE/CHu1HCbA0XqSRxVT/5Tjkd9CtT1KdznwH8DsPtpCFUUtqumsSFYhLpukcDeMRHHLOe3F/lmUEXg/Lsg3Myc8AjRaRajrleB1HAW8q2lOFFazNtXVVbD1lyNj7YI3K9vcPkoOngId1K6lwfwcliGvGibAGipAIUF+/Ewa2B5ABVdahzOTUbcSCPWiAkPMh9Ap03l37cZDK4IHCg764K+cvkaGneNLg/g3kg8FMSK49HDLodOgGMpDJoG5ILo7Iscw+sfSoQGsIL3R6JNywNwlwxOgEI1i8eDAQKTvRE/8cQUumDYDa2RDuBM81rkRU973QmvRqTIjGT4JHS3BGUVl1w+Km/fwvVNHXQA5Z+1kEilXgHGTYPIVVmpdsGpkmJ6gIv9adDX1HoEcByp+qsXoFFO+R6AthDlbJQiVjHp+0LkNfYrMKCqhJ1mCZXEOikHuYhg0CIsxYsN3hJmp0tCKvU/Rs+HZGj6Kkf/uAg5Kvc75+2oBOlhMzinsaBhQL7009BR+zgCEAJwYP56Bt5/k+DZkAwxgZwHboLyZCv/nWoJJuwMzDYWYzYWZtvc89TMwj/42MBZxATO4su42GvQdkbNnSVUAHc/CSubxc5CwhJIWLh6MUuwXsHBYmdQ36/g+4TgGV6k55cYUpYgP9aG00lzM3c2KoA3JilYBhCB8P1iTSkj2BA0C5NVWPOd9kESAqVMuDRUAF7juQIDjwCaEPsKXNMPdWzzBT+l2Rk6PUfgn6sZIZYWwwfh1Yye37eWq347/g3Obw4/YXTVNAAAAABJRU5ErkJggg==',
                    'base64'
                );
                response.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': img.length,
                });
                response.end(img);
                return;
            }
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
        if (typeof options.done === 'function') {
            options.done(server);
        }
        console.log(`server start at http://localhost:${port}`);
    });
}

module.exports = createServer;
