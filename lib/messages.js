var log = require("./log.js");
var alertHistoryFB;

var accountSid = 'TWILIO_SID';
var authToken = 'TWILIO_TOKEN';
var client = require('twilio')(accountSid, authToken);
var adminNumber=[];
var notificationsSent=[];

var currentBoundaryDate= new Date();

function getSignature() {
  return currentBoundaryDate.getFullYear()+'/'+ (currentBoundaryDate.getMonth()+1)+'/'+currentBoundaryDate.getDate();
}

function writeAlertEntry ( device, recipient, reason ) {
  alertHistoryFB.child( getSignature()+'/'+device+'/'+recipient+'/'+reason).set( true );
}

module.exports = {

  setBoundaryDate: function( boundaryDate ) {
    currentBoundaryDate=boundaryDate;
  },

  setFB: function( fb ) {
    alertHistoryFB = fb;
  },

  sendViolationTextToAllAdmins: function( violatorPhoneName, violatorPhoneNumber, admins ) {
    for (var n in admins) {
      this.sendViolationTextToOneAdmin( violatorPhoneName, violatorPhoneNumber, admins[n] );
    }
  },

  sendBoundaryTextToOwner: function( deviceName, phone, boundary, reason="reminder") {
    alertHistoryFB.child( getSignature()+'/'+phone+'/'+phone+'/'+reason).once("value").then(function(snapshot) {
      if(snapshot.val()!=true) {
        log.log(phone+": this device is due to be docked in "+boundary+" minutes.",1);

        client.messages.create({
          to: phone,
         from: '8152051010',
          body: 'Friendly reminder: your phone is due to be docked in '+boundary+' minutes.'
        }, function (err, message) {
          console.log(message.sid);
            writeAlertEntry( phone, phone, reason );
            log.log("Message successfully sent",1);
        });


      }
    });
  },

  sendViolationTextToOwner: function( ownerPhoneNumber, reason='violation' ) {
    alertHistoryFB.child( getSignature()+'/'+ownerPhoneNumber+'/'+ownerPhoneNumber+'/'+reason).once("value").then(function(snapshot) {
      if(snapshot.val()!=true) {
        log.log(ownerPhoneNumber+": this device needs to be docked now",1);

       client.messages.create({
          to: ownerPhoneNumber,
         from: '8152051010',
          body: 'Your phone should be docked now.'
        }, function (err, message) {
          console.log(message.sid);
            writeAlertEntry( ownerPhoneNumber, ownerPhoneNumber, reason );
            log.log("Message successfully sent",1);
        });


      }
    });
  },


  sendViolationTextToOneAdmin: function( violatorPhoneName, ownerPhoneNumber, adminPhoneNumber, reason='violation' ) {

    alertHistoryFB.child(getSignature()+'/'+ownerPhoneNumber+'/'+adminPhoneNumber+'/'+reason).once("value").then(function(snapshot) {
      if(snapshot.val()!=true) {
        log.log(adminPhoneNumber+": ADMIN, "+violatorPhoneName+" needs to be docked now.",1);

        client.messages.create({
          to: adminPhoneNumber,
         from: '8152051010',
          body: violatorPhoneName+' is overdue to be docked.'
      }, function (err, message) {
          console.log(message.sid);
            writeAlertEntry( ownerPhoneNumber, adminPhoneNumber, reason  );
            log.log("Message successfully sent",1);
      });
    }
  });
}
}
