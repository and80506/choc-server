#!/usr/bin/env node
'use strict';

var createServer = require('../index.js');

var PORT = process.argv[2] || 8000;
// 静态资源文件目录
var DIR = process.argv[3] || "";

var port;
var params = {};
process.argv.forEach((val, index) => {
    var splited = val.split('=');
    ['port', 'dir'].forEach(function(key) {
        if ( splited[0] === key ) {
            params[key] = splited[1];
        }
    });
});

createServer(port, dir);