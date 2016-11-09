#!/usr/bin/env node

'use strict';

require('es6-shim');

var databaseP = require('../database/management/databaseClientP.js');
var dropAllTables = require('../database/management/dropAllTables.js');
var createTables = require('../database/management/createTables.js');

databaseP
.then(function(){
    return dropAllTables()
    .catch(function(err){
        console.error("Couldn't drop tables", err);
        process.exit();
    })
    .then(createTables)
    .catch(function(err){
        console.error("Couldn't create tables", err);
        process.exit();
    })
    .then(function(){
        console.log("Success!");
        process.exit();
    })
})
.catch(function(err){
    console.error("Couldn't connect to database", err);
});
