var devicesFb;
var devicesFbSnapshot=[];
var messages = require ("./messages.js");
var settings = require ("./settings.js");
var log      = require ("./log.js");

function deviceIsDockedNow( thisDevice ) {
  for (var n in devicesFbSnapshot) {
    if (devicesFbSnapshot[n].serial==thisDevice.serial && devicesFbSnapshot[n].isConnected==true) { return true; }
  }
  return false;
}

function isDeviceRequiredToBeDockedSoon( thisDevice, arrayOfTimes ) {
  arrayOfTimes.sort();
  for (n=0; n<arrayOfTimes.length; n++) {
     if (isDeviceRequiredToBeDocked( thisDevice, arrayOfTimes[n]*60000)) {
      return arrayOfTimes[n]
       return true;

     }
  }
  return 0;
  return false;
}

function isDeviceRequiredToBeDocked ( thisDevice, proximityToBoundaryMS=0 ) {
    var now = new Date();
    var todayStartTime = new Date( new Date().getFullYear() + "," +
                              (new Date().getMonth()+1)  + "," +
                              new Date().getDate() + " " +
                              thisDevice['dockRequiredStart']);

    var todayEndTime =  new Date(todayStartTime.getTime() + thisDevice.dockRequiredDurationMinutes*60000).getTime();
    var yesterdayStart=new Date(todayStartTime.getTime()-86400000);
    var yesterdayEnd = new Date(yesterdayStart.getTime() + thisDevice.dockRequiredDurationMinutes*60000);
    now = (now.getTime() + ( proximityToBoundaryMS ));

    if ( now - todayStartTime <= 0 )  {
      if ( now - yesterdayEnd <= 0 ) {
        messages.setBoundaryDate( yesterdayStart );
        return true;
      }
    }

    else {
      if (now < todayEndTime) {
        messages.setBoundaryDate( todayStartTime );
        return true;
      }
    }
    return false;
}


var devices = module.exports = {

  setFB: function( fb ) {
    devicesFb=fb;
  },

  setFBSnapshot: function( fb ) {
    devicesFbSnapshot=fb;
    log.log( fb, 0 );
  },

  setUSBStatus: function ( devices ) {
      for (var n in devicesFbSnapshot) {
        var connectedState=false;
        for (var connectedDeviceIndex in devices) {
          if (devices[connectedDeviceIndex].serialNumber == devicesFbSnapshot[n].serial) {
            connectedState=true;
          }
        }
        devicesFb.child( n +'/isConnected').set( connectedState );
      }
    },

  checkDevices: function() {
    for (var n in devicesFbSnapshot) {
      var thisDevice=devicesFbSnapshot[n];
      if (!deviceIsDockedNow( thisDevice )) {
          if(isDeviceRequiredToBeDocked( thisDevice )) {
              // this device should be docked now, but isn't - inform admins
              messages.sendViolationTextToAllAdmins(thisDevice.name, thisDevice.phone, settings.getAdmins());
            }
          else {
            var boundary = isDeviceRequiredToBeDockedSoon( thisDevice, settings.getAlertWindowsMinutes());
            if (boundary > 0) {
                // this device needs to be docked soon, but isn't yet - inform owner
                messages.sendBoundaryTextToOwner(thisDevice.name, thisDevice.phone, boundary);
            }
          }
        }
      }
    }

}
