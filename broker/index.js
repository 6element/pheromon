'use strict';

/*
    MQTT Broker initilization
*/

require('es6-shim');
var makeMqttServer = require('./makeMqttServer.js');

makeMqttServer(process.env.BROKER_SECRET)
  .then(function(){
      console.log('MQTT broker ready at %s', process.env.BROKER_URL);
  })
  .catch(function(err){
      console.error('Couldn\'t set the broker up', err);
      process.exit(1);
  });
