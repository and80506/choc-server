#!/usr/bin/env node
'use strict';

var createServer = require('../src/index.js');
var params = {};
process.argv.forEach((val, index) => {
    var splited = val.split('=');
    ['port', 'root'].forEach(function (key) {
        if (splited[0] === key) {
            params[key] = splited[1];
        }
    });
});

if (!params.port) {
    params.port = 8000;
}
if (!params.root) {
    params.root = process.cwd();
}
createServer({
    port: Number(params.port),
    root: params.root,
});
