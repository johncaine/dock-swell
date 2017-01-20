'use strict';

require ('./lib/firebase.js');

var devices =   require('./lib/devices.js');
var settings =  require("./lib/settings.js");
var iosDevice = require('node-ios-device');

setTimeout( pollDevices, 10000 );
console.log("Now monitoring devices for required dock start/stop times.");

function pollDevices() {
  iosDevice.devices(function (err, connectedDeviceList) { devices.setUSBStatus(connectedDeviceList); } );
  devices.checkDevices();
  setTimeout( pollDevices, settings.getPollIntervalMS());
}

// TODO
// - make a log of when a device is connected or disconnected by watchign for changes to the isConnected value
//
// var room = new Firebase("https://test-app.firebaseio.com/" + roomID);
// room.child("position/start").on("value", onChange);
// room.child("position/end").on("value", onChange);
// function onChange(snapshot) {
//   if (snapshot.name() == "start") {
//     // position.start changed to snapshot.val()
//   } else if (snapshot.name() == "end") {
//     // position.end changed to snapshot.val()
//   }
// }
