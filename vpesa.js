if (Meteor.isClient) {

  Template.login.events({
    'click #login-button': function () {
      Meteor.loginWithVenmo(function (err) {
        if (err) {
          throw new Meteor.Error("Login failed");
        }
      });
    },
    'click #logout-button': function () {
      Meteor.logout(function(err){
        if (err) {
          throw new Meteor.Error("Logout failed");
        }
      });
    }
  }); 

}

if (Meteor.isServer) {
  Meteor.startup(function () {

    ServiceConfiguration.configurations.upsert({
      service: "venmo"
      }, { 
        $set: {
        clientId: "3090",
        scope: "access_profile+access_friends+make_payments",
        secret: "bA8hM7A3cuAFA2CfT7wawwz497L5MyFp"
        }
    });
  });

}
