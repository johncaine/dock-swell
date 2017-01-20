
var firebase =  require("firebase");
var devices =   require("./devices.js");
var settings =  require("./settings.js");
var log =       require("./log.js");
var messages=   require("./messages.js");

var config = {
  apiKey: " AIzaSyB-vtP3M3C-qBLvWVglnyfmFTk5botFq2U",
  authDomain: "bluewatch-c0ff4.firebaseapp.com",
  databaseURL: "https://bluewatch-c0ff4.firebaseio.com",
  storageBucket: "bluewatch-c0ff4.appspot.com",
  messagingSenderId: "263209043357"
};

firebase.initializeApp(config);
firebase.auth().signInWithEmailAndPassword('FIREBASE_USER_NAME', 'FIREBASE_USER_PASS').catch(function(error) { log.log(error.message, 1); });

firebase.auth().onAuthStateChanged((user) => {
  // get a reference to the db for reading and writing
  log.setFB( firebase.database().ref('log'));
  messages.setFB( firebase.database().ref('log/alertHistory'));
  devices.setFB( firebase.database().ref('devices'));

  // subscribe to updates
  firebase.database().ref('settings').on('value', function(snapshot) { settings.setFBSnapshot(snapshot.val()); });

  firebase.database().ref('devices').on('value', function(snapshot) {
    devices.setFBSnapshot(snapshot.val());
    devices.checkDevices();
    })
  });
