if (Meteor.isClient) {

  Template.home.events({
    'click #logout-button': function () {
      Meteor.logout(function(err){
        if (err) {
          throw new Meteor.Error("Logout failed");
        }
      });
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
  });

}
