#!/usr/bin/env node
'use strict';

var execRemote = require('../execRemote.js');

var params = {
    url: ""
};
process.argv.forEach((val, index) => {
    var splited = val.split('=');
    if ( splited[0] === 'url' ) {
        params[key] = splited[1];
        execRemote(process.argv[2]);
    }
});