'use strict';
require('es6-shim');

var tryConnectTo = require('../tools/tryConnectTo.js');
var spawn = require('child_process').spawn;

var initDB = require('./init-db.js');

var dbInitP = initDB();
var apiConnectP = tryConnectTo('http://api:4000');

Promise.all([dbInitP, apiConnectP])
.then(function(){
    console.log('Running tests');

    var mochaTests = spawn('node_modules/.bin/mocha', ['--recursive', 'tests/mocha/'], {stdio: 'inherit'});
    // var mochaTests = spawn('node_modules/.bin/mocha', ['--recursive', 'tests/mocha/maestro.js'], {stdio: 'inherit'});

    mochaTests.on('exit', process.exit);
});
