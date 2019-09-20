#!/usr/bin/env node
'use strict';

var createServer = require('../index.js');

var PORT = process.argv[2] || 8000;
// 静态资源文件目录
var DIR = process.argv[3] || "";

var port;
var dir;
process.argv.forEach((val, index) => {
    var splited = val.split('=');
    ['port', 'dir'].forEach(function() {
        if ( splited[0] === key ) {
            port = splited[1];
        }
    });
    if ( splited[0] === 'port' ) {
        port = splited[1];
    }

    if ( splited[0] === 'dir' ) {
        dir = splited[1];
    }
});

createServer(port, dir);