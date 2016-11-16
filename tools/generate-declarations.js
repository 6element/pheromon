#!/usr/bin/env node

"use strict";

var fs = require('fs');
var path = require('path');

var generateSqlDefinition = require('sql-generate');

var conString = process.env.DATABASE_URL;

generateSqlDefinition({ dsn: conString }, function(err, definitions) {
    if (err) {
        console.error(err);
        return;
    }
    fs.writeFileSync(path.join(__dirname, '../database/management/declarations.js'), definitions.buffer);
    console.log('definitions generated');
    process.exit();
});

process.on('uncaughtException', function(err) {
    console.error('Caught exception: ', err);
});
