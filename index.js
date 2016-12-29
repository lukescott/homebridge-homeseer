'use strict';

//
// HomeSeer Plugin for for HomeBridge by Rien du Pre
// Originally created as Shim by Jean-Michel Joudrier
// V1.0 - 2016/10/04
// - Initial version
//
//
//
// Remember to add platform to config.json.
//
// You can get HomeSeer Device References by clicking a HomeSeer device name, then
// choosing the Advanced Tab.
//
// The uuid_base parameter is valid for all events and accessories.
// If you set this parameter to some unique identifier, the HomeKit accessory ID will be based on uuid_base instead of the accessory name.
// It is then easier to change the accessory name without messing the HomeKit database.
// You may use the HomeSeer device reference as uuid_base, as long as you don't map 2 HomeKit accessories to the same HomeSeer device.
//
//
// Example:
// "platforms": [
//     {
//         "platform": "HomeSeer",              // Required
//         "name": "HomeSeer",                  // Required
//         "host": "http://192.168.3.4:81",     // Required - If you did setup HomeSeer authentication, use "http://user:password@ip_address:port"
//
//         "events":[                           // Optional - List of Events - Currently they are imported into HomeKit as switches
//            {
//               "eventGroup":"My Group",       // Required - The HomeSeer event group
//               "eventName":"My On Event",     // Required - The HomeSeer event name
//               "offEventGroup":"My Group",    // Optional - The HomeSeer event group for turn-off <event>
//               "offEventName":"My Off Event", // Optional - The HomeSeer event name for turn-off <event>
//               "name":"Test",                 // Optional - HomeSeer event name is the default
//               "uuid_base":"SomeUniqueId"     // Optional - HomeKit identifier will be derived from this parameter instead of the name
//            }
//         ],
//
//         "accessories":[                      // Required - List of Accessories
//            {
//              "ref":8,                        // Required - HomeSeer Device Reference (To get it, select the HS Device - then Advanced Tab)
//              "type":"Lightbulb",             // Optional - Lightbulb is the default
//              "name":"My Light",              // Optional - HomeSeer device name is the default
//              "offValue":"0",                 // Optional - 0 is the default
//              "onValue":"100",                // Optional - 100 is the default
//              "can_dim":true,                 // Optional - true is the default - false for a non dimmable lightbulb
//              "uuid_base":"SomeUniqueId2",    // Optional - HomeKit identifier will be derived from this parameter instead of the name. You SHOULD add this parameter to all accessories !
//              "brightnessRef":8,              // Optional - HomeSeer device reference for the device that holds the brightness level. Default is the same as ref.
//              "brightnessMaxValue":254,       // Optional - HomeSeer control value for the max brightness level. This will convert HomeKit 0-100% to HomeSeer 0-254. Default is 100.
//              "saturationRef":8,              // Optional - HomeSeer device reference for the device that holds the saturation level. Default is none.
//              "saturationMaxValue":254,       // Optional - HomeSeer control value for the max saturation level. This will convert HomeKit 0-100% to HomeSeer 0-254. Default is 100.
//              "hueRef":8                      // Optional - HomeSeer device reference for the device that holds the color. Default is none.
//            },
//            {
//              "ref":9                         // This is a dimmable Lightbulb by default (HS control values from 0 to 100)
//            },
//            {
//              "ref":58,                       // This is a controllable
//              "type":"Outlet"
//            },
//            {
//              "ref":111,                      // Required - HomeSeer Device Reference for your sensor
//              "type":"TemperatureSensor",     // Required for a temperature sensor
//              "temperatureUnit":"F",          // Optional - C is the default
//              "name":"Bedroom temp",          // Optional - HomeSeer device name is the default
//              "batteryRef":112,               // Optional - HomeSeer device reference for the sensor battery level
//              "batteryThreshold":15           // Optional - If sensor battery level is below this value, the HomeKit LowBattery characteristic is set to 1. Default is 10
//            },
//            {
//              "ref":34,                       // Required - HomeSeer Device Reference for your sensor
//              "type":"SmokeSensor",           // Required for a smoke sensor
//              "name":"Kichen smoke detector", // Optional - HomeSeer device name is the default
//              "batteryRef":35,                // Optional - HomeSeer device reference for the sensor battery level
//              "batteryThreshold":15,          // Optional - If sensor battery level is below this value, the HomeKit LowBattery characteristic is set to 1. Default is 10
//              "onValues":[1,1.255]            // Optional - List of all HomeSeer values triggering a "ON" sensor state - Default is any value different than 0
//            },
//            {
//              "ref":34,                       // Required - HomeSeer Device Reference for your sensor (Here it's the same device as the SmokeSensor above)
//              "type":"CarbonMonoxideSensor",  // Required for a carbon monoxide sensor
//              "name":"Kichen CO detector",    // Optional - HomeSeer device name is the default
//              "batteryRef":35,                // Optional - HomeSeer device reference for the sensor battery level
//              "batteryThreshold":15,          // Optional - If sensor battery level is below this value, the HomeKit LowBattery characteristic is set to 1. Default is 10
//              "onValues":[2,2.255]            // Optional - List of all HomeSeer values triggering a "ON" sensor state - Default is any value different than 0
//            },
//            {
//              "ref":113,                      // Required - HomeSeer Device Reference of the Current Temperature Device
//              "type":"Thermostat",            // Required for a Thermostat
//              "name":"Température Salon",     // Optional - HomeSeer device name is the default
//              "temperatureUnit":"C",          // Optional - F for Fahrenheit, C for Celsius, C is the default
//              "setPointRef":167,              // Required - HomeSeer device reference for your thermostat Set Point.
//              "setPointReadOnly":true,        // Optional - Set to false if your SetPoint is read/write. true is the default
//              "stateRef":166,                 // Required - HomeSeer device reference for your thermostat current state
//              "stateOffValues":[0,4,5],       // Required - List of the HomeSeer device values for a HomeKit state=OFF
//              "stateHeatValues":[1],          // Required - List of the HomeSeer device values for a HomeKit state=HEAT
//              "stateCoolValues":[2],          // Required - List of the HomeSeer device values for a HomeKit state=COOL
//              "stateAutoValues":[3],          // Required - List of the HomeSeer device values for a HomeKit state=AUTO
//              "controlRef":168,               // Required - HomeSeer device reference for your thermostat mode control (It can be the same as stateRef for some thermostats)
//              "controlOffValue":0,            // Required - HomeSeer device control value for OFF
//              "controlHeatValue":1,           // Required - HomeSeer device control value for HEAT
//              "controlCoolValue":2,           // Required - HomeSeer device control value for COOL
//              "controlAutoValue":3,           // Required - HomeSeer device control value for AUTO
//              "coolingThresholdRef":169,      // Optional - Not-implemented-yet - HomeSeer device reference for your thermostat cooling threshold
//              "heatingThresholdRef":170       // Optional - Not-implemented-yet - HomeSeer device reference for your thermostat heating threshold
//            },
//            {
//              "ref":200,                      // Required - HomeSeer Device Reference of a garage door opener
//              "type":"GarageDoorOpener",      // Required for a Garage Door Opener
//              "name":"Garage Door",           // Optional - HomeSeer device name is the default
//              "stateRef":201,                 // Required - HomeSeer device reference for your garage door opener current state (can be the same as ref)
//              "stateOpenValues":[0],          // Required - List of the HomeSeer device values for a HomeKit state=OPEN
//              "stateClosedValues":[1],        // Required - List of the HomeSeer device values for a HomeKit state=CLOSED
//              "stateOpeningValues":[2],       // Optional - List of the HomeSeer device values for a HomeKit state=OPENING
//              "stateClosingValues":[3],       // Optional - List of the HomeSeer device values for a HomeKit state=CLOSING
//              "stateStoppedValues":[4],       // Optional - List of the HomeSeer device values for a HomeKit state=STOPPED
//              "controlRef":201,               // Required - HomeSeer device reference for your garage door opener control (can be the same as ref and stateRef)
//              "controlOpenValue":0,           // Required - HomeSeer device control value for OPEN
//              "controlCloseValue":1,          // Required - HomeSeer device control value for CLOSE
//              "obstructionRef":201,           // Optional - HomeSeer device reference for your garage door opener obstruction state (can be the same as ref)
//              "obstructionValues":[5],        // Optional - List of the HomeSeer device values for a HomeKit obstruction state=OBSTRUCTION
//              "lockRef":202,                  // Optional - HomeSeer device reference for your garage door lock (can be the same as ref)
//              "lockUnsecuredValues":[0],      // Optional - List of the HomeSeer device values for a HomeKit lock state=UNSECURED
//              "lockSecuredValues":[1],        // Optional - List of the HomeSeer device values for a HomeKit lock state=SECURED
//              "lockJammedValues":[2],         // Optional - List of the HomeSeer device values for a HomeKit lock state=JAMMED
//              "unlockValue":0,                // Optional - HomeSeer device control value to unlock the garage door opener
//              "lockValue":1                   // Optional - HomeSeer device control value to lock the garage door opener
//            },
//            {
//              "ref":210,                      // Required - HomeSeer Device Reference of a Lock
//              "type":"Lock",                  // Required for a Lock
//              "name":"Main Door Lock",        // Optional - HomeSeer device name is the default
//              "lockUnsecuredValues":[0],      // Required - List of the HomeSeer device values for a HomeKit lock state=UNSECURED
//              "lockSecuredValues":[1],        // Required - List of the HomeSeer device values for a HomeKit lock state=SECURED
//              "lockJammedValues":[2],         // Optional - List of the HomeSeer device values for a HomeKit lock state=JAMMED
//              "unlockValue":0,                // Required - HomeSeer device control value to unlock
//              "lockValue":1                   // Required - HomeSeer device control value to lock
//            },
//            {
//              "ref":230,                      // Required - HomeSeer Device Reference of a Security System
//              "type":"SecuritySystem",        // Required for a security system
//              "name":"Home alarm",            // Optional - HomeSeer device name is the default
//              "armedStayValues":[0],          // Optional - List of the HomeSeer device values for a HomeKit security state=ARMED-STAY
//              "armedAwayValues":[1],          // Optional - List of the HomeSeer device values for a HomeKit security state=ARMED-AWAY
//              "armedNightValues":[2],         // Optional - List of the HomeSeer device values for a HomeKit security state=ARMED-NIGHT
//              "disarmedValues":[3],           // Optional - List of the HomeSeer device values for a HomeKit security state=DISARMED
//              "alarmValues":[4],              // Optional - List of the HomeSeer device values for a HomeKit security state=ALARM
//              "armStayValue":0,               // Required - HomeSeer device control value to arm in stay mode. If you don't have this mode, select any value that arms your system
//              "armAwayValue":1,               // Required - HomeSeer device control value to arm in away mode. If you don't have this mode, select any value that arms your system
//              "armNightValue":2,              // Required - HomeSeer device control value to arm in night mode. If you don't have this mode, select any value that arms your system
//              "disarmValue":3                 // Required - HomeSeer device control value to disarm security system
//            },
//            {
//              "ref":115,                      // Required - HomeSeer Device Reference for a device holding battery level (0-100)
//              "type":"Battery",               // Required for a Battery
//              "name":"Roomba battery",        // Optional - HomeSeer device name is the default
//              "batteryThreshold":15           // Optional - If the level is below this value, the HomeKit LowBattery characteristic is set to 1. Default is 10
//            },
//            {
//              "ref":240,                      // Required - HomeSeer Device Reference for a door - HomeSeer values must go from 0 (closed) to 100 (open)
//              "type":"Door",                  // Required for a Door
//              "name":"Main door",             // Optional - HomeSeer device name is the default
//              "obstructionRef":241,           // Optional - HomeSeer device reference for your door obstruction state (can be the same as ref)
//              "obstructionValues":[1]         // Optional - List of the HomeSeer device values for a HomeKit obstruction state=OBSTRUCTION
//            }
//         ]
//     }
// ],
//
//
// SUPORTED TYPES:
// - Lightbulb              (can_dim, onValue, offValue options)
// - Fan                    (onValue, offValue options)
// - Switch                 (onValue, offValue options)
// - Outlet                 (onValue, offValue options)
// - Thermostat             (temperatureUnit, setPoint, state, control options)
// - TemperatureSensor      (temperatureUnit=C|F)
// - HumiditySensor         (HomeSeer device value in %  - batteryRef, batteryThreshold options)
// - LightSensor            (HomeSeer device value in Lux  - batteryRef, batteryThreshold options)
// - ContactSensor          (onValues, batteryRef, batteryThreshold options)
// - MotionSensor           (onValues, batteryRef, batteryThreshold options)
// - LeakSensor             (onValues, batteryRef, batteryThreshold options)
// - OccupancySensor        (onValues, batteryRef, batteryThreshold options)
// - SmokeSensor            (onValues, batteryRef, batteryThreshold options)
// - CarbonMonoxideSensor   (onValues, batteryRef, batteryThreshold options)
// - CarbonDioxideSensor    (onValues, batteryRef, batteryThreshold options)
// - Battery                (batteryThreshold option)
// - GarageDoorOpener       (state, control, obstruction, lock options)
// - Lock                   (unsecured, secured, jammed options)
// - SecuritySystem         (arm, disarm options)
// - Door                   (obstruction option)
// - Window                 (obstruction option)
// - WindowCovering         (obstruction option)

var request = require("request");
var requestRetry = require("requestretry");
var http = require('http');
var Accessory, Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
  // console.log("homebridge API version: " + homebridge.version);

  // Accessory must be created from PlatformAccessory Constructor
  Accessory = homebridge.platformAccessory;

  // Service and Characteristic are from hap-nodejs
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;

  homebridge.registerAccessory("homebridge-homeseer", "HomeSeer", HomeSeerAccessory, true);
  homebridge.registerPlatform("homebridge-homeseer", "HomeSeer", HomeSeerPlatform, true);
}

function httpRequest(url, method, callback) {
    request({
      url: url,
      method: method
    },
    function (error, response, body) {
      callback(error, response, body)
    })
}

function httpRequestRetry(url, method, callback) {
    requestRetry({
      url: url,
      method: method
    },
    function (error, response, body) {
      callback(error, response, body)
    })
}

function HomeSeerPlatform(log, config){
    this.log = log;
    this.config = config;
}

HomeSeerPlatform.prototype = {
    accessories: function(callback) {
        var that = this;
        var foundAccessories = [];

        if( this.config.events ) {
            this.log("Creating HomeSeer events.");
            for( var i=0; i<this.config.events.length; i++ ) {
                var event = new HomeSeerEvent( that.log, that.config, that.config.events[i] );
                foundAccessories.push( event );
            }
        }

        this.log("Fetching HomeSeer devices.");
        var refList = "";
        for( var i=0; i<this.config.accessories.length; i++ ) {
            refList = refList + this.config.accessories[i].ref;
            if( i < this.config.accessories.length - 1 )
                refList = refList + ",";
        }
        var url = this.config["host"] + "/JSON?request=getstatus&ref=" + refList;
        httpRequestRetry( url, "GET", function(error, response, body) {
            if (error) {
                this.log('HomeSeer status function failed: %s', error.message);
                callback( foundAccessories );
            }
            else {
                this.log('HomeSeer status function succeeded!');
                var response = JSON.parse( body );
                for( var i=0; i<this.config.accessories.length; i++ ) {
                    for( var j=0; j<response.Devices.length; j++ ) {
                        if( this.config.accessories[i].ref == response.Devices[j].ref ) {
                            var accessory = new HomeSeerAccessory( that.log, that.config, this.config.accessories[i], response.Devices[j] );
                            foundAccessories.push( accessory );
                            break;
                        }
                    }
                }
                callback( foundAccessories );
            }
        }.bind(this));
    }
}

function HomeSeerAccessory(log, platformConfig, accessoryConfig, status ) {
    this.log = log;
    this.config = accessoryConfig;
    this.ref = status.ref;
    this.name = status.name
    this.model = status.device_type_string;
    this.onValue = 100;
    this.offValue = 0;

    this.access_url = platformConfig["host"] + "/JSON?";
    this.control_url = this.access_url + "request=controldevicebyvalue&ref=" + this.ref + "&value=";
    this.status_url = this.access_url + "request=getstatus&ref=" + this.ref;

    if( this.config.name )
        this.name = this.config.name;

    if( this.config.uuid_base )
        this.uuid_base = this.config.uuid_base;

    if( this.config.onValue )
        this.onValue = this.config.onValue;

    if( this.config.offValue )
        this.offValue = this.config.offValue;
}

HomeSeerAccessory.prototype = {

    identify: function(callback) {
            callback();
    },

    setPowerState: function(powerOn, callback) {
        var url;

        if (powerOn) {
            url = this.control_url + this.onValue;
            this.log( "%s - Setting power state to On - HomeSeerControl[%s]=%s", this.name, this.ref, this.onValue );
        }
        else {
            url = this.control_url + this.offValue;
            this.log( "%s - Setting power state to Off - HomeSeerControl[%s]=%s", this.name, this.ref, this.offValue );
        }

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer power function failed: %s', error.message);
                callback(error);
            }
            else {
                callback();
            }
        }.bind(this));
    },

    getPowerState: function(callback) {
        var url = this.status_url;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get power function failed: %s', error.message);
                callback( error, 0 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;

                this.log( "%s - Getting power state - HomeSeerStatus[%s]=%s", this.name, this.ref, value );
                if( value == 0 )
                    callback( null, 0 );
                else
                    callback( null, 1 );
            }
        }.bind(this));
    },

    getBinarySensorState: function(callback) {
        var url = this.status_url;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get binary sensor state function failed: %s', error.message);
                callback( error, 0 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;

                this.log( "%s - Getting binary sensor state - HomeSeerStatus[%s]=%s", this.name, this.ref, value );
                if( this.config.onValues ) {
                    if( this.config.onValues.indexOf(value) != -1 )
                        callback( null, 1 );
                    else
                        callback( null, 0 );
                }
                else {
                    if( value != 0 )
                        callback( null, 1 );
                    else
                        callback( null, 0 );
                }
            }
        }.bind(this));
    },


    setValue: function(level, callback) {
        var url = this.control_url + level;

        this.log("%s - Setting value to %s - HomeSeerControl[%s]=%s", this.name, level, this.ref, this.level);

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer set value function failed: %s', error.message);
                callback(error);
            }
            else {
                callback();
            }
        }.bind(this));
    },

    getValue: function(callback) {
        var url = this.status_url;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get value function failed: %s', error.message);
                callback( error, 0 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;
                this.log( "%s - Getting value - HomeSeerStatus[%s]=%s", this.name, this.ref, value );
                callback( null, value );
            }
        }.bind(this));
    },

    setBrightness: function(level, callback) {
        var ref = this.config.brightnessRef;
        var value = level;
        if( this.config.brightnessMaxValue ) {
            value = Math.round( level * this.config.brightnessMaxValue / 100 );
        }
        var url = this.access_url + "request=controldevicebyvalue&ref=" + ref + "&value=" + value;

        this.log("%s - Setting brightness to %s - HomeSeerControl[%s]=%s", this.name, level, ref, value);

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer set brightness function failed: %s', error.message);
                callback(error);
            }
            else {
                callback();
            }
        }.bind(this));
    },

    getBrightness: function(callback) {
        var ref = this.config.brightnessRef;
        var url = this.access_url + "request=getstatus&ref=" + ref;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get brightness function failed: %s', error.message);
                callback( error, 0 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;

                this.log( "%s - Getting brightness - HomeSeerStatus[%s]=%s", this.name, ref, value );
                if( this.config.brightnessMaxValue ) {
                    callback( null, Math.round( value * 100 / this.config.brightnessMaxValue ) );
                }
                else {
                    callback( null, value );
                }
            }
        }.bind(this));
    },

    setSaturation: function(level, callback) {
        var ref = this.config.saturationRef;
        var value = level;
        if( this.config.saturationMaxValue ) {
            value = Math.round( level * this.config.saturationMaxValue / 100 );
        }
        var url = this.access_url + "request=controldevicebyvalue&ref=" + ref + "&value=" + value;

        this.log("%s - Setting saturation to %s - HomeSeerControl[%s]=%s", this.name, level, ref, value);

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer set saturation function failed: %s', error.message);
                callback(error);
            }
            else {
                callback();
            }
        }.bind(this));
    },

    getSaturation: function(callback) {
        var ref = this.config.saturationRef;
        var url = this.access_url + "request=getstatus&ref=" + ref;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get saturation function failed: %s', error.message);
                callback( error, 0 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;

                this.log( "%s - Getting saturation - HomeSeerStatus[%s]=%s", this.name, ref, value );
                if( this.config.saturationMaxValue ) {
                    callback( null, Math.round( value * 100 / this.config.saturationMaxValue ) );
                }
                else {
                    callback( null, value );
                }
            }
        }.bind(this));
    },

    setHue: function(level, callback) {
        var ref = this.config.hueRef;
        var value = Math.round( level / 360 * 65535 ); // Convert 0-360 to 0-65535
        var url = this.access_url + "request=controldevicebyvalue&ref=" + ref + "&value=" + value;

        this.log("%s - Setting hue to %s - HomeSeerControl[%s]=%s", this.name, level, ref, value);
        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer set hue function failed: %s', error.message);
                callback(error);
            }
            else {
                callback();
            }
        }.bind(this));
    },

    getHue: function(callback) {
        var ref = this.config.hueRef;
        var url = this.access_url + "request=getstatus&ref=" + ref;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get hue function failed: %s', error.message);
                callback( error, 0 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;

                this.log( "%s - Getting Hue - HomeSeerStatus[%s]=%s", this.name, ref, value );
                callback( null, Math.round(value/65535*360) ); // Convert 0-65535 to 0-360
            }
        }.bind(this));
    },

    setTemperature: function(temperature, callback) {
        var value = temperature;
        if( this.config.temperatureUnit == "F" ) {
            value = temperature*9/5+32;
        }

        this.log("%s - Setting temperature to %s - HomeSeerControl[%s]=%s", this.name, temperature, this.ref, value);
        var url = this.control_url + value;
        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer set temperature function failed: %s', error.message);
                callback(error);
            }
            else {
                callback();
            }
        }.bind(this));
    },

    getTemperature: function(callback) {
        var url = this.status_url;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get temperature function failed: %s', error.message);
                callback( error, 0 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;

                this.log( "%s - Getting temperature - HomeSeerStatus[%s]=%s", this.name, this.ref, value );
                if( this.config.temperatureUnit == "F" ) {
                    value = (value-32)*5/9;
                }
                callback( null, value );
            }
        }.bind(this));
    },

    getThermostatCurrentHeatingCoolingState: function(callback) {
        var ref = this.config.stateRef;
        var url = this.access_url + "request=getstatus&ref=" + ref;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get thermostat current heating cooling state function failed: %s', error.message);
                callback( error, 0 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;

                this.log( "%s - Getting cooling state - HomeSeerStatus[%s]=%s", this.name, ref, value );
                if( this.config.stateOffValues.indexOf(value) != -1 )
                    callback( null, 0 );
                else if( this.config.stateHeatValues.indexOf(value) != -1 )
                    callback( null, 1 );
                else if( this.config.stateCoolValues.indexOf(value) != -1 )
                    callback( null, 2 );
                else if( this.config.stateAutoValues.indexOf(value) != -1 )
                    callback( null, 3 );
                else {
                    this.log( "Error: value for thermostat current heating cooling state not in offValues, heatValues, coolValues or autoValues" );
                    callback( null, 0 );
                }
            }
        }.bind(this));
    },

    setThermostatCurrentHeatingCoolingState: function(state, callback) {
        var ref = this.config.controlRef;
        var value = 0;
        if( state == 0 )
            value = this.config.controlOffValue;
        else if( state == 1 )
            value = this.config.controlHeatValue;
        else if( state == 2 )
            value = this.config.controlCoolValue;
        else if( state == 3 )
            value = this.config.controlAutoValue;

        var url = this.access_url + "request=controldevicebyvalue&ref=" + ref + "&value=" + value;
        this.log("%s - Setting cooling state to %s - HomeSeerControl[%s]=%s", this.name, state, ref, value);
        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer set thermostat current heating cooling state function failed: %s', error.message);
                callback(error);
            }
            else {
                callback();
            }
        }.bind(this));
    },

    getThermostatTargetTemperature: function(callback) {
        var ref = this.config.setPointRef;
        var url = this.access_url + "request=getstatus&ref=" + ref;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get thermostat target temperature function failed: %s', error.message);
                callback( error, 0 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;

                this.log( "%s - Getting target temperature - HomeSeerStatus[%s]=%s", this.name, ref, value );
                if( this.config.temperatureUnit == "F" ) {
                    value = (value-32)*5/9;
                }
                callback( null, value );
            }
        }.bind(this));
    },

    setThermostatTargetTemperature: function(temperature, callback) {
        var value = temperature;
        if( this.config.temperatureUnit == "F" ) {
            value = Math.round(temperature*9/5+32);
        }

        var ref = this.config.setPointRef;
        var url = this.access_url + "request=controldevicebyvalue&ref=" + ref + "&value=" + value;

        this.log("%s - Setting target temperature to %s - HomeSeerControl[%s]=%s", this.name, temperature, ref, value);
        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer set thermostat target temperature function failed: %s', error.message);
                callback(error);
            }
            else {
                this.log('HomeSeer set thermostat target temperature function succeeded!');
                callback();
            }
        }.bind(this));
    },

    getThermostatTemperatureDisplayUnits: function(callback) {
        if( this.config.temperatureUnit == "F" )
            callback( null, 1 );
        else
            callback( null, 0 );
    },

    getLowBatteryStatus: function(callback) {
        var ref = this.config.batteryRef;
        var url = this.access_url + "request=getstatus&ref=" + ref;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get battery status function failed: %s', error.message);
                callback( error, 0 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;
                var minValue = 10;

                this.log( "%s - Getting battery status - HomeSeerStatus[%s]=%s", this.name, ref, value );
                if( this.config.batteryThreshold ) {
                    	minValue = this.config.batteryThreshold;
                }

                if( value > minValue )
                    callback( null, 0 );
                else
                    callback( null, 1 );
            }
        }.bind(this));
    },

    getCurrentDoorState: function(callback) {
        var ref = this.config.stateRef;
        var url = this.access_url + "request=getstatus&ref=" + ref;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get current door state function failed: %s', error.message);
                callback( error, 0 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;

                this.log( "%s - Getting door state - HomeSeerStatus[%s]=%s", this.name, ref, value );
                if( this.config.stateOpenValues.indexOf(value) != -1 )
                    callback( null, 0 );
                else if( this.config.stateClosedValues.indexOf(value) != -1 )
                    callback( null, 1 );
                else if( this.config.stateOpeningValues && this.config.stateOpeningValues.indexOf(value) != -1 )
                    callback( null, 2 );
                else if( this.config.stateClosingValues && this.config.stateClosingValues.indexOf(value) != -1 )
                    callback( null, 3 );
                else if( this.config.stateStoppedValues && this.config.stateStoppedValues.indexOf(value) != -1 )
                    callback( null, 4 );
                else {
                    this.log( "Error: value for current door state not in stateO0penValues, stateClosedValues, stateOpeningValues, stateClosingValues, stateStoppedValues" );
                    callback( null, 0 );
                }
            }
        }.bind(this));
    },

    getTargetDoorState: function(callback) {
        var ref = this.config.stateRef;
        var url = this.access_url + "request=getstatus&ref=" + ref;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get target door state function failed: %s', error.message);
                callback( error, 0 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;

                this.log('HomeSeer get target door state function succeeded: value=' + value );
                if( this.config.stateOpenValues.indexOf(value) != -1 )
                    callback( null, 0 );
                else if( this.config.stateClosedValues.indexOf(value) != -1 )
                    callback( null, 1 );
                else if( this.config.stateOpeningValues && this.config.stateOpeningValues.indexOf(value) != -1 )
                    callback( null, 0 );
                else if( this.config.stateClosingValues && this.config.stateClosingValues.indexOf(value) != -1 )
                    callback( null, 0 );
                else if( this.config.stateStoppedValues && this.config.stateStoppedValues.indexOf(value) != -1 )
                    callback( null, 0 );
                else {
                    this.log( "Error: value for target door state not in stateO0penValues, stateClosedValues, stateOpeningValues, stateClosingValues, stateStoppedValues" );
                    callback( null, 0 );
                }
            }
        }.bind(this));
    },

    setTargetDoorState: function(state, callback) {
        var ref = this.config.controlRef;
        var value = 0;
        if( state == 0 )
            value = this.config.controlOpenValue;
        else if( state == 1 )
            value = this.config.controlCloseValue;

        var url = this.access_url + "request=controldevicebyvalue&ref=" + ref + "&value=" + value;
        this.log("%s - Setting door state to %s - HomeSeerControl[%s]=%s", this.name, state, ref, value);
        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer set target door state function failed: %s', error.message);
                callback(error);
            }
            else {
                this.log('HomeSeer set target door state function succeeded!');
                callback();
            }
        }.bind(this));
    },

    getObstructionDetected: function(callback) {
        if( this.config.obstructionRef ) {
            var ref = this.config.obstructionRef;
            var url = this.access_url + "request=getstatus&ref=" + ref;

            httpRequest(url, 'GET', function(error, response, body) {
                if (error) {
                    this.log('HomeSeer get obstruction detected function failed: %s', error.message);
                    callback( error, 0 );
                }
                else {
                    var status = JSON.parse( body );
                    var value = status.Devices[0].value;

                    this.log( "%s - Getting obstruction state - HomeSeerStatus[%s]=%s", this.name, ref, value );
                    if( this.config.obstructionValues && this.config.obstructionValues.indexOf(value) != -1 )
                        callback( null, 1 );
                    else {
                        callback( null, 0 );
                    }
                }
            }.bind(this));
        }
        else {
            callback( null, 0 );
        }
    },

    getLockCurrentState: function(callback) {
        var ref = this.config.lockRef;
        var url = this.access_url + "request=getstatus&ref=" + ref;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get lock current state function failed: %s', error.message);
                callback( error, 3 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;

                this.log( "%s - Getting lock state - HomeSeerStatus[%s]=%s", this.name, ref, value );
                if( this.config.lockUnsecuredValues && this.config.lockUnsecuredValues.indexOf(value) != -1 )
                    callback( null, 0 );
                else if( this.config.lockSecuredValues && this.config.lockSecuredValues.indexOf(value) != -1 )
                    callback( null, 1 );
                else if( this.config.lockJammedValues && this.config.lockJammedValues.indexOf(value) != -1 )
                    callback( null, 2 );
                else {
                    callback( null, 3 );
                }
            }
        }.bind(this));
    },

       getLockTargetState: function(callback) {
        var ref = this.config.lockRef;
        var url = this.access_url + "request=getstatus&ref=" + ref;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get lock target state function failed: %s', error.message);
                callback( error, 3 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;

                this.log('HomeSeer get lock target state function succeeded: value=' + value );
                if( this.config.lockUnsecuredValues && this.config.lockUnsecuredValues.indexOf(value) != -1 )
                    callback( null, 0 );
                else if( this.config.lockSecuredValues && this.config.lockSecuredValues.indexOf(value) != -1 )
                    callback( null, 1 );
                else if( this.config.lockJammedValues && this.config.lockJammedValues.indexOf(value) != -1 )
                    callback( null, 0 );
                else {
                    callback( null, 0 );
                }
            }
        }.bind(this));
      },

    setLockTargetState: function(state, callback) {
        var ref = this.config.lockRef;
        var value = 0;
        if( state == 0 && this.config.unlockValue )
            value = this.config.unlockValue;
        else if( state == 1 && this.config.lockValue )
            value = this.config.lockValue;

        var url = this.access_url + "request=controldevicebyvalue&ref=" + ref + "&value=" + value;
        this.log("%s - Setting lock state to %s - HomeSeerControl[%s]=%s", this.name, state, ref, value);
        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer set target lock state function failed: %s', error.message);
                callback(error);
            }
            else {
                this.log('HomeSeer set target lock state function succeeded!');
                callback();
            }
        }.bind(this));
    },

    getSecuritySystemCurrentState: function(callback) {
        var url = this.access_url + "request=getstatus&ref=" + this.ref;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get security system current state function failed: %s', error.message);
                callback( error, 3 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;

                this.log( "%s - Getting security system state - HomeSeerStatus[%s]=%s", this.name, this.ref, value );
                if( this.config.armedStayValues && this.config.armedStayValues.indexOf(value) != -1 )
                    callback( null, 2 );
                else if( this.config.armedAwayValues && this.config.armedAwayValues.indexOf(value) != -1 )
                    callback( null, 1 );
                else if( this.config.armedNightValues && this.config.armedNightValues.indexOf(value) != -1 )
                    callback( null, 2 );
                else if( this.config.disarmedValues && this.config.disarmedValues.indexOf(value) != -1 )
                    callback( null, 3 );
                else if( this.config.alarmValues && this.config.alarmValues.indexOf(value) != -1 )
                    callback( null, 4 );
                else
                    callback( null, 0 );
            }
        }.bind(this));
    },

    getSecuritySystemTargerState: function(callback) {
        var url = this.access_url + "request=getstatus&ref=" + this.ref;

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer get security system current state function failed: %s', error.message);
                callback( error, 3 );
            }
            else {
                var status = JSON.parse( body );
                var value = status.Devices[0].value;

                this.log( "%s - Getting security system state - HomeSeerStatus[%s]=%s", this.name, this.ref, value );
                if( this.config.armedStayValues && this.config.armedStayValues.indexOf(value) != -1 )
                    callback( null, 2 );
                else if( this.config.armedAwayValues && this.config.armedAwayValues.indexOf(value) != -1 )
                    callback( null, 1 );
                else if( this.config.armedNightValues && this.config.armedNightValues.indexOf(value) != -1 )
                    callback( null, 2 );
                else if( this.config.disarmedValues && this.config.disarmedValues.indexOf(value) != -1 )
                    callback( null, 3 );
                else if( this.config.alarmValues && this.config.alarmValues.indexOf(value) != -1 )
                    callback( null, 4 );
                else
                    callback( null, 0 );
            }
        }.bind(this));
    },

    setSecuritySystemTargetState: function(state, callback) {
        var value = 0;
        if( state == 0 && this.config.armStayValue )
            value = this.config.armStayValue;
        else if( state == 1 && this.config.armAwayValue )
            value = this.config.armAwayValue;
        else if( state == 2 && this.config.armNightValue )
            value = this.config.armNightValue;
        else if( state == 3 && this.config.disarmValue )
            value = this.config.disarmValue;

        var url = this.access_url + "request=controldevicebyvalue&ref=" + this.ref + "&value=" + value;
        this.log("%s - Setting security system state to %s - HomeSeerControl[%s]=%s", this.name, state, this.ref, value);
        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer set target security system state function failed: %s', error.message);
                callback(error);
            }
            else {
                this.log('HomeSeer set target security system state function succeeded!');
                callback();
            }
        }.bind(this));
    },


    getPositionState: function(callback) {
        callback( null, 2 );  // Temporarily return STOPPED. TODO: full door support
    },

    getServices: function() {
        var services = []

        var informationService = new Service.AccessoryInformation();
        informationService
            .setCharacteristic(Characteristic.Manufacturer, "HomeSeer")
            .setCharacteristic(Characteristic.Model, this.model )
            .setCharacteristic(Characteristic.SerialNumber, "HS " + this.config.type + " ref " + this.ref);
        services.push( informationService );


        switch( this.config.type ) {
        case "Lightbulb": {
            var lightbulbService = new Service.Lightbulb();
            lightbulbService
                .getCharacteristic(Characteristic.On)
                .on('set', this.setPowerState.bind(this))
                .on('get', this.getPowerState.bind(this));

            if( this.config.can_dim == null || this.config.can_dim == true ) {
                if( this.config.brightnessRef == null ) {
                    this.config.brightnessRef = this.config.ref;
                }
                lightbulbService
                    .addCharacteristic( Characteristic.Brightness )
                    .on('set', this.setBrightness.bind(this))
                    .on('get', this.getBrightness.bind(this));
            }

            if( this.config.saturationRef ) {
                lightbulbService
                    .addCharacteristic( Characteristic.Saturation )
                    .on('set', this.setSaturation.bind(this))
                    .on('get', this.getSaturation.bind(this));
            }

            if( this.config.hueRef ) {
                lightbulbService
                    .addCharacteristic( Characteristic.Hue )
                    .on('set', this.setHue.bind(this))
                    .on('get', this.getHue.bind(this));
            }

            services.push( lightbulbService );
            break;
            }
        case "Fan": {
            var fanService = new Service.Fan();
            fanService
                .getCharacteristic(Characteristic.On)
                .on('set', this.setPowerState.bind(this))
                .on('get', this.getPowerState.bind(this));

            if( this.config.can_dim == null || this.config.can_dim == true ) {
                if( this.config.brightnessRef == null ) {
                    this.config.brightnessRef = this.config.ref;
                }
                fanService
                    .addCharacteristic( Characteristic.RotationSpeed )
                    .on('set', this.setBrightness.bind(this))
                    .on('get', this.getBrightness.bind(this));
            }

            services.push( fanService );
            break;
            }
        case "Switch": {
            var switchService = new Service.Switch();
            switchService
                .getCharacteristic(Characteristic.On)
                .on('set', this.setPowerState.bind(this))
                .on('get', this.getPowerState.bind(this));
            services.push( switchService );
            break;
            }
        case "Outlet": {
            var outletService = new Service.Outlet();
            outletService
                .getCharacteristic(Characteristic.On)
                .on('set', this.setPowerState.bind(this))
                .on('get', this.getPowerState.bind(this));
            services.push( outletService );
            break;
            }
        case "PowerConsumption": {
        	var PowerConsumptionService = new Service.PowerConsumption();
            PowerConsumptionService
                .getCharacteristic(Characteristic.CurrentPowerConsumption)
                .on('get', this.getValue.bind(this));
            services.push( PowerConsumptionService );
            break;
            }
        case "TemperatureSensor": {
            var temperatureSensorService = new Service.TemperatureSensor();
            temperatureSensorService
                .getCharacteristic(Characteristic.CurrentTemperature)
                .on('get', this.getTemperature.bind(this));
            temperatureSensorService
                .getCharacteristic(Characteristic.CurrentTemperature).setProps( {minValue: -100} );
            if( this.config.batteryRef ) {
                temperatureSensorService
                    .addCharacteristic( Characteristic.StatusLowBattery )
                    .on('get', this.getLowBatteryStatus.bind(this));
            }
            services.push( temperatureSensorService );
            break;
            }
        case "CarbonMonoxideSensor": {
            var carbonMonoxideSensorService = new Service.CarbonMonoxideSensor();
            carbonMonoxideSensorService
                .getCharacteristic(Characteristic.CarbonMonoxideDetected)
                .on('get', this.getBinarySensorState.bind(this));
            if( this.config.batteryRef ) {
                carbonMonoxideSensorService
                    .addCharacteristic( Characteristic.StatusLowBattery )
                    .on('get', this.getLowBatteryStatus.bind(this));
            }
            services.push( carbonMonoxideSensorService );
            break;
            }
        case "CarbonDioxideSensor": {
            var carbonDioxideSensorService = new Service.CarbonDioxideSensor();
            carbonDioxideSensorService
                .getCharacteristic(Characteristic.CarbonDioxideDetected)
                .on('get', this.getBinarySensorState.bind(this));
            if( this.config.batteryRef ) {
                carbonDioxideSensorService
                    .addCharacteristic( Characteristic.StatusLowBattery )
                    .on('get', this.getLowBatteryStatus.bind(this));
            }
            services.push( carbonDioxideSensorService );
            break;
            }
        case "ContactSensor": {
            var contactSensorService = new Service.ContactSensor();
            contactSensorService
                .getCharacteristic(Characteristic.ContactSensorState)
                .on('get', this.getBinarySensorState.bind(this));
            if( this.config.batteryRef ) {
                contactSensorService
                    .addCharacteristic( Characteristic.StatusLowBattery )
                    .on('get', this.getLowBatteryStatus.bind(this));
            }
            services.push( contactSensorService );
            break;
            }
        case "MotionSensor": {
            var motionSensorService = new Service.MotionSensor();
            motionSensorService
                .getCharacteristic(Characteristic.MotionDetected)
                .on('get', this.getBinarySensorState.bind(this));
            if( this.config.batteryRef ) {
                motionSensorService
                    .addCharacteristic( Characteristic.StatusLowBattery )
                    .on('get', this.getLowBatteryStatus.bind(this));
            }
            services.push( motionSensorService );
            break;
            }
        case "LeakSensor": {
            var leakSensorService = new Service.LeakSensor();
            leakSensorService
                .getCharacteristic(Characteristic.LeakDetected)
                .on('get', this.getBinarySensorState.bind(this));
            if( this.config.batteryRef ) {
                leakSensorService
                    .addCharacteristic( Characteristic.StatusLowBattery )
                    .on('get', this.getLowBatteryStatus.bind(this));
            }
            services.push( leakSensorService );
            break;
            }
        case "OccupancySensor": {
            var occupancySensorService = new Service.OccupancySensor();
            occupancySensorService
                .getCharacteristic(Characteristic.OccupancyDetected)
                .on('get', this.getBinarySensorState.bind(this));
            if( this.config.batteryRef ) {
                occupancySensorService
                    .addCharacteristic( Characteristic.StatusLowBattery )
                    .on('get', this.getLowBatteryStatus.bind(this));
            }
            services.push( occupancySensorService );
            break;
            }
        case "SmokeSensor": {
            var smokeSensorService = new Service.SmokeSensor();
            smokeSensorService
                .getCharacteristic(Characteristic.SmokeDetected)
                .on('get', this.getBinarySensorState.bind(this));
            if( this.config.batteryRef ) {
                smokeSensorService
                    .addCharacteristic( Characteristic.StatusLowBattery )
                    .on('get', this.getLowBatteryStatus.bind(this));
            }
            services.push( smokeSensorService );
            break;
            }
        case "LightSensor": {
            var lightSensorService = new Service.LightSensor();
            lightSensorService
                .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
                .on('get', this.getValue.bind(this));
            if( this.config.batteryRef ) {
                lightSensorService
                    .addCharacteristic( Characteristic.StatusLowBattery )
                    .on('get', this.getLowBatteryStatus.bind(this));
            }
            services.push( lightSensorService );
            break;
            }
        case "HumiditySensor": {
            var humiditySensorService = new Service.HumiditySensor();
            humiditySensorService
                .getCharacteristic(Characteristic.CurrentRelativeHumidity)
                .on('get', this.getValue.bind(this));
            if( this.config.batteryRef ) {
                humiditySensorService
                    .addCharacteristic( Characteristic.StatusLowBattery )
                    .on('get', this.getLowBatteryStatus.bind(this));
            }
            services.push( humiditySensorService );
            break;
            }
        case "Door": {
            var doorService = new Service.Door();
            doorService
                .getCharacteristic(Characteristic.CurrentPosition)
                .on('get', this.getValue.bind(this));
            doorService
                .getCharacteristic(Characteristic.TargetPosition)
                .on('set', this.setValue.bind(this));
            doorService
                .getCharacteristic(Characteristic.TargetDoorState)
                .on('get', this.getTargetDoorState.bind(this));
            doorService
                .getCharacteristic(Characteristic.PositionState)
                .on('get', this.getPositionState.bind(this));
            if( this.config.obstructionRef ) {
                doorService
                    .addCharacteristic( Characteristic.ObstructionDetected )
                    .on('get', this.getObstructionDetected.bind(this));
            }
            services.push( doorService );
            break;
            }
        case "Window": {
            var windowService = new Service.Window();
            windowService
                .getCharacteristic(Characteristic.CurrentPosition)
                .on('get', this.getValue.bind(this));
            windowService
                .getCharacteristic(Characteristic.TargetPosition)
                .on('set', this.setValue.bind(this));
            windowService
                .getCharacteristic(Characteristic.PositionState)
                .on('get', this.getPositionState.bind(this));
            if( this.config.obstructionRef ) {
                windowService
                    .addCharacteristic( Characteristic.ObstructionDetected )
                    .on('get', this.getObstructionDetected.bind(this));
            }
            services.push( windowService );
            break;
            }
        case "WindowCovering": {
            var windowCoveringService = new Service.WindowCovering();
            windowCoveringService
                .getCharacteristic(Characteristic.CurrentPosition)
                .on('get', this.getValue.bind(this));
            windowCoveringService
                .getCharacteristic(Characteristic.TargetPosition)
                .on('set', this.setValue.bind(this));
            windowCoveringService
                .getCharacteristic(Characteristic.PositionState)
                .on('get', this.getPositionState.bind(this));
            services.push( windowCoveringService );
            if( this.config.obstructionRef ) {
                windowCoveringService
                    .addCharacteristic( Characteristic.ObstructionDetected )
                    .on('get', this.getObstructionDetected.bind(this));
            }
            break;
            }
        case "Battery": {
            this.config.batteryRef = this.ref;
            var batteryService = new Service.BatteryService();
            batteryService
                .getCharacteristic(Characteristic.BatteryLevel)
                .on('get', this.getValue.bind(this));
            batteryService
                .getCharacteristic(Characteristic.StatusLowBattery)
                .on('get', this.getLowBatteryStatus.bind(this));
            services.push( batteryService );
            break;
            }
        case "Thermostat": {
            var thermostatService = new Service.Thermostat();
            thermostatService
                .getCharacteristic(Characteristic.CurrentTemperature)
                .on('get', this.getTemperature.bind(this));
            thermostatService
                .getCharacteristic(Characteristic.TargetTemperature)
                .on('get', this.getThermostatTargetTemperature.bind(this));
            if( this.config.setPointReadOnly === null || this.config.setPointReadOnly === false )
                thermostatService
                    .getCharacteristic(Characteristic.TargetTemperature)
                    .on('set', this.setThermostatTargetTemperature.bind(this));
            thermostatService
                .getCharacteristic(Characteristic.CurrentHeatingCoolingState)
                .on('get', this.getThermostatCurrentHeatingCoolingState.bind(this));
            thermostatService
                .getCharacteristic(Characteristic.TargetHeatingCoolingState)
                .on('get', this.getThermostatCurrentHeatingCoolingState.bind(this));
            thermostatService
                .getCharacteristic(Characteristic.TargetHeatingCoolingState)
                .on('set', this.setThermostatCurrentHeatingCoolingState.bind(this));
            thermostatService
                .getCharacteristic(Characteristic.TemperatureDisplayUnits)
                .on('get', this.getThermostatTemperatureDisplayUnits.bind(this));

            services.push( thermostatService );
            break;
            }
        case "GarageDoorOpener": {
            var garageDoorOpenerService = new Service.GarageDoorOpener();
            garageDoorOpenerService
                .getCharacteristic(Characteristic.CurrentDoorState)
                .on('get', this.getCurrentDoorState.bind(this));
            garageDoorOpenerService
                .getCharacteristic(Characteristic.TargetDoorState)
                .on('set', this.setTargetDoorState.bind(this));
            garageDoorOpenerService
                .getCharacteristic(Characteristic.ObstructionDetected)
                .on('get', this.getObstructionDetected.bind(this));
            if( this.config.lockRef ) {
                garageDoorOpenerService
                    .addCharacteristic( Characteristic.LockCurrentState )
                    .on('get', this.getLockCurrentState.bind(this));
                garageDoorOpenerService
                    .addCharacteristic( Characteristic.LockTargetState )
                    .on('set', this.setLockTargetState.bind(this));
            }
            services.push( garageDoorOpenerService );
            break;
            }
        case "Lock": {
            this.config.lockRef = this.ref;
            var lockService = new Service.LockMechanism();
            lockService
                .getCharacteristic(Characteristic.LockCurrentState)
                .on('get', this.getLockCurrentState.bind(this));
            lockService
                .getCharacteristic(Characteristic.LockTargetState)
                .on('get', this.getLockTargetState.bind(this));
            lockService
                .getCharacteristic(Characteristic.LockTargetState)
                .on('set', this.setLockTargetState.bind(this));
            services.push( lockService );
            break;
            }
        case "SecuritySystem": {
            var securitySystemService = new Service.SecuritySystem();
            securitySystemService
                .getCharacteristic(Characteristic.SecuritySystemCurrentState)
                .on('get', this.getSecuritySystemCurrentState.bind(this));
            securitySystemService
                .getCharacteristic(Characteristic.SecuritySystemTargetState)
                .on('get', this.getSecuritySystemTargerState.bind(this));
            securitySystemService
                .getCharacteristic(Characteristic.SecuritySystemTargetState)
                .on('set', this.setSecuritySystemTargetState.bind(this));
            services.push( securitySystemService );
            break;
            }

        default:{
            var lightbulbService = new Service.Lightbulb();
            lightbulbService
                .getCharacteristic(Characteristic.On)
                .on('set', this.setPowerState.bind(this))
                .on('get', this.getPowerState.bind(this));

            lightbulbService
                .addCharacteristic( Characteristic.Brightness )
                .on('set', this.setBrightness.bind(this))
                .on('get', this.getBrightness.bind(this));

            if( this.config.brightnessRef == null ) {
                this.config.brightnessRef = this.config.ref;
            }

            services.push( lightbulbService );
            break;
            }
        }

        return services;
    }
}

function HomeSeerEvent(log, platformConfig, eventConfig ) {
    this.log = log;
    this.config = eventConfig;
    this.name = eventConfig.eventName
    this.model = "HomeSeer Event";

    this.access_url = platformConfig["host"] + "/JSON?";
    this.on_url = this.access_url + "request=runevent&group=" + encodeURIComponent(this.config.eventGroup) + "&name=" + encodeURIComponent(this.config.eventName);

    if( this.config.offEventGroup && this.config.offEventName ) {
        this.off_url = this.access_url + "request=runevent&group=" + encodeURIComponent(this.config.offEventGroup) + "&name=" + encodeURIComponent(this.config.offEventName);
    }

    if( this.config.name )
        this.name = this.config.name;

    if( this.config.uuid_base )
        this.uuid_base = this.config.uuid_base;
}

HomeSeerEvent.prototype = {

    identify: function(callback) {
            callback();
    },

    launchEvent: function(value, callback) {
        this.log("Setting event value to %s", value);

        var url = this.on_url;
        if( value == 0 && this.off_url ) {
            url = this.off_url;
        }

        httpRequest(url, 'GET', function(error, response, body) {
            if (error) {
                this.log('HomeSeer run event function failed: %s', error.message);
                callback(error);
            }
            else {
                this.log('HomeSeer run event function succeeded!');
                callback();
            }
        }.bind(this));
    },


    getServices: function() {
        var services = []

        var informationService = new Service.AccessoryInformation();
        informationService
            .setCharacteristic(Characteristic.Manufacturer, "HomeSeer")
            .setCharacteristic(Characteristic.Model, this.model )
            .setCharacteristic(Characteristic.SerialNumber, "HS Event " + this.config.eventGroup + " " + this.config.eventName);
        services.push( informationService );

        var switchService = new Service.Switch();
        switchService
            .getCharacteristic(Characteristic.On)
            .on('set', this.launchEvent.bind(this));
        services.push( switchService );

        return services;
    }
}

module.exports.platform = HomeSeerPlatform;
