'use strict';

var pokemon = require('pokemon-names');
var database = require('../../database');
var debug = require('../../tools/debug');
var makeMap = require('../../tools/makeMap');

var SENSOR_STATUS = require('./sensorStatus.js'); // Sensor status are status for sensor itself, not its different outputs status
var SENSOR_HEALTHCHECK_PERIOD = process.env.SENSOR_HEALTHCHECK_PERIOD || 300;
var SENSOR_HEALTHCHECK_START_HOUR = process.env.SENSOR_HEALTHCHECK_START_HOUR || 7;
var SENSOR_HEALTHCHECK_STOP_HOUR = process.env.SENSOR_HEALTHCHECK_STOP_HOUR || 16;


/*
    checkSensors' role is to:
    - verify sensor exists in DB
        - if not, create it
    - if a measurement type is provided, verify that the sensor has it registered
        - if not, create it
*/

module.exports = function(sim, type){
    return database.Sensors.get(sim)
    .then(function(sensor){
        if (sensor){
            debug('SENSOR IN DB, YAY', sim);
            return sensor;
        }
        else {
            debug('SENSOR NOT IN DB, CREATING', sim);

            return database.Sensors.create({
                'name': pokemon.random(),
                'sim': sim,
                'period': SENSOR_HEALTHCHECK_PERIOD,
                'start_hour': SENSOR_HEALTHCHECK_START_HOUR,
                'stop_hour': SENSOR_HEALTHCHECK_STOP_HOUR
            })
            .then(function(created){
                return created;
            });
        }
    })
    .then(function(sensor){
        var outputs = makeMap(sensor.outputs, 'type');

        // if type exists and was not referenced in DB and is not a sensor type, create it
        if (type && !outputs.has(type) && !SENSOR_STATUS.has(type))
            return database.Sensors.addOutput(sim, type);
        else // do nothing
            return sensor;

    })
    .catch(function(err){
        console.log('Error in sensor check', err);
    });
};
