#!/usr/bin/env node
'use strict';

var execRemote = require('../execRemote.js');
var url = 'http://localhost:8000/index.js';
var params = {
    port: 8000
    dir: ""
};
process.argv.forEach((val, index) => {
    var splited = val.split('=');
    ['port', 'dir'].forEach(function(key) {
        if ( splited[0] === key ) {
            params[key] = splited[1];
        }
    });
});

execRemote(Number(params.port), params.dir);