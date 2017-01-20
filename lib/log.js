var logFB; // db instance so we can write back to FB
var verbose=false;

function getSignature() {
  date= new Date();
  return date.getFullYear()+'/'+ (date.getMonth()+1)+'/'+date.getDate();
}

module.exports = {
  setFB: function (fb) { logFB = fb; },
  log: function( message, severity=0 ) {
    if (severity>0 || verbose==true ) {
      console.log(message);
    }
  }

}
