#!/usr/bin/env node
'use strict';

var execRemote = require('../execRemote.js');

var processArgv = process.argv;
if ( processArgv[2] ) {
    execRemote(processArgv[2].replace('url=', ''));
} else {
    processArgv.forEach((val, index) => {
        var splited = val.split('=');
        if ( splited[0] === 'url' ) {
            execRemote(splited[1]);
        }
    });
}