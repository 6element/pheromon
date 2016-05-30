'use strict';

var React = require('react');
var Modifiable = React.createFactory(require('./Modifiable.js'));
var PlacePicker = React.createFactory(require('./PlacePicker.js'));
var DeleteButton = React.createFactory(require('./DeleteButton.js'));

/*
interface SensorProps{   
    Sensor: {
        created_at : string,
        id: int,
        installed_at: int,
        isUpdating: boolean,
        latest_input: string,
        latest_output: string,
        name: string,
        sim: string,
        client_status: string,
        signal_status: string,
        wifi_status: string,
        blue_status: string,
        updated_at: string
    },
    placeIDMap: Map(),
    placeName: string,
    placeId: placeId,
    onChangeSensor: function(),
    onChangePlace: function()
    onRemoveSensor: function()
}

interface SensorState{
    isListOpen: boolean
}

*/


var Sensor = React.createClass({
    displayName: 'Sensor',

    getInitialState: function(){
        return {
            isOpen: false
        };
    },

    toggleList: function(){
        this.setState({isListOpen: !this.state.isListOpen});
    },

    removeSensor: function(){
        var props = this.props;
        var dbData = {
            sim: props.sensor.sim
        };

        props.onRemoveSensor(dbData);
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;

        // console.log('SENSOR props', props);
        // console.log('SENSOR state', state);

        var classes = [
            'sensor',
            props.sensor.installed_at ? '' : 'orphan'
        ];

        // Sensor Name, is a Modifiable
        var sensorName = React.DOM.li({}, 
            new Modifiable({
                className: 'name',
                isUpdating: false,
                text: props.sensor.name,
                dbLink: {
                    sim: props.sensor.sim,
                    field: 'name'
                },
                onChange: props.onChangeSensor
            })
        );

        // Sensor Place, can be toggled
        var sensorPlace = React.DOM.li({className: 'sensorPlace clickable',
                onClick: function(){
                    document.querySelector('body').classList.toggle('noscroll');
                    self.toggleList();
                }
            },
            props.sensor.installed_at ? props.placeName : 'Add me a place',
            state.isListOpen ? new PlacePicker({
                placeIDMap: props.placeIDMap,
                placeId: props.placeId,
                sensorSim: props.sensor.sim,
                isOpen: state.isListOpen,
                onChange: function(data){
                    self.toggleList();
                    props.onChangeSensor(data);
                }
            }) : undefined
        );

        var sensorSim = React.DOM.li({className: 'sensorSim'}, props.sensor.sim);

        return React.DOM.div({className: classes.join(' ')},
            new DeleteButton({
                askForConfirmation: true,
                onConfirm: this.removeSensor,
                warning: 'This will remove all related measurements'
            }),
            React.DOM.ul({},
                sensorName,
                sensorPlace,
                sensorSim    
            )
        );
    }
});

module.exports = Sensor;
