if (Meteor.isClient) {
  Meteor.subscribe("friends");
  Meteor.subscribe("logs");
  Meteor.subscribe("users");

  Template.home.events({
    'click #logout-button': function () {
      Meteor.logout(function(err){
        if (err) {
          throw new Meteor.Error("Logout failed");
        }
      });
    },
    'submit .addNumber': function() {
      event.preventDefault();
      var num = event.target.text.value;
      Meteor.call("add_phone", Meteor.userId(), num);
      Meteor.call("send_welcome", num);
    }
  });

  Template.home.helpers({
    'notSubmitted': function() {
      user = Meteor.user();
      if(user.phone)
        return false;
      else
        return true;
    }
  });

  Template.login.events({
    'click #login-button': function () {
      Meteor.loginWithVenmo(function (err) {
        if (err) {
          throw new Meteor.Error("Login failed");
        }
        Meteor.call("after_login", function(err) {
          if (err) {
            throw new Meteor.Error("Unable to update friends.");
          }
        });
      });
    }
  });

}

Friends = new Mongo.Collection("friends");

if (Meteor.isServer) {
  
  Meteor.startup(function () {

    ServiceConfiguration.configurations.upsert({
      service: "venmo"
      }, { 
        $set: {
        clientId: "3152",
        scope: "access_profile+access_friends+make_payments",
        secret: "2UvJSNBXHXDdXgdBS3VbfBx9Fgc55jx7"
        }
    });

    var client = new Twilio({
      from: Meteor.settings.TWILIO.FROM,
      sid: Meteor.settings.TWILIO.SID,
      token: Meteor.settings.TWILIO.TOKEN
    });

  });

  Meteor.publish("users", function () {
    if (this.userId) {
      return Meteor.users.find({_id: this.userId});
    } else {
      this.ready();
    }
  });

  Meteor.publish('friends', function () {
    if (this.userId){
      return Friends.find({});
    } else {
      this.ready();
    }
  });

}
