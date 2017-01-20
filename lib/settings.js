var settings;

module.exports = {

  setFBSnapshot: function (newSettings) {
    settings=newSettings;
  },

  getAdmins: function() {
    return settings.adminPhones;
  },

  getAlertWindowsMinutes: function() {
    return settings.alertWindowsMinutes;
  },

  getPollIntervalMS: function() {
    if (typeof settings !="undefined" && settings.pollIntervalMS>0) {
      return settings.pollIntervalMS;
    }
    else {
      return 60000;
    }
  }

}
