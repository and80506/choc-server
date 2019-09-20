#!/usr/bin/env node
'use strict';

var createServer = require('../index.js');

var PORT = process.argv[2] || 8000;
// 静态资源文件目录
var DIR = process.argv[3] || "";

process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
    var splited = val.split('=');
    if ( splited[0] === 'port' ) {

    }

    if ( splited[0] === 'dir' ) {
        
    }
});

re