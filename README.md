# hoembridge-HomeSeer
Homebridge plugin for HomeSeer

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-homeseer
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration
Configuration sample:

```
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
```

# Credit

The original HomeKit Shim was done by Jean-Michel Joudrier, who did the majority of the hard work.
