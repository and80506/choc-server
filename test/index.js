describe('ChocServer test', function () {
    var http = require('http');
    var path = require('path');
    var fs = require('fs');
    var chai = require('chai');
    var expect = chai.expect;

    var createServer = require('../src/index.js');
    var root = path.join(__dirname, 'fixtures');
    var testServer;

    before(function (done) {
        testServer = createServer({
            root: root,
            port: 8000,
            done: function (server) {
                testServer = server;
                done();
            },
        });
    });

    after(function () {
        testServer.close();
    });

    it('should fail if rootPath is unspecified', function () {
        expect(function () {
            createServer({
                port: 8000,
            });
        }).to.throw('Root path not specified');
    });

    it('should fail if port is unspecified', function () {
        expect(function () {
            createServer({
                root: path.join(__dirname, 'fixtures'),
            });
        }).to.throw('Port not specified');
    });

    it('should throw 404 page if configured page does not exist', function (done) {
        http.get(
            {
                hostname: 'localhost',
                port: 8000,
                path: '/not/exist',
            },
            (res) => {
                var body = '';

                res.on('data', function (chunk) {
                    body += chunk;
                });

                res.on('end', function () {
                    expect(body).to.match(/not found/);
                    done();
                });
            }
        ).on('error', function (e) {
            done(e);
        });
    });

    it('should list directory', function (done) {
        http.get(
            {
                hostname: 'localhost',
                port: 8000,
                path: '/',
            },
            (res) => {
                var body = '';

                res.on('data', function (chunk) {
                    body += chunk;
                });

                res.on('end', function () {
                    expect(body).to.match(/Directory\:/);
                    done();
                });
            }
        ).on('error', function (e) {
            done(e);
        });
    });

    describe('testing content types', function () {
        function testFixture(testFile, contentType, done) {
            fs.readFile(path.join(root, testFile), 'UTF-8', function (err, fileContent) {
                if (err) {
                    return done(err);
                }

                http.get(
                    {
                        hostname: 'localhost',
                        port: 8000,
                        path: '/' + testFile,
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(200);
                        expect(res.headers['content-type']).to.match(contentType);
                        done();
                    }
                );
            });
        }

        it('should handle HTML', function (done) {
            testFixture('test.html', /html/, done);
        });

        it('should handle JavaScript', function (done) {
            testFixture('test.js', /javascript/, done);
        });

        it('should handle PNG', function (done) {
            testFixture('test.png', /image\/png/, done);
        });

        it('should handle JPG', function (done) {
            testFixture('test.jpg', /image\/jpeg/, done);
        });
    });
});
