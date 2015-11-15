/* Meteor methods to load early*/

if (Meteor.isServer){

	Meteor.methods({
		'get_venmo_friends': function() {
			this.unblock(); //allows other Methods to run, since I'm doing HTTP.get() synchronously
			var user = Meteor.user();
			if (!user) {
				throw new Meteor.Error("Couldn't retrieve Venmo friends; user is not logged in.");
			}
			var venmo_id = user.services.venmo.id;
			var access = user.services.venmo.accessToken;
			var url = "https://api.venmo.com/v1/users/" + venmo_id + "/friends";
			try {
				var result = HTTP.get(url, {"params": {"access_token": access, "limit": 2000}});
				return result.data.data;
			} catch (e) {
				console.log(e);
				throw new Meteor.Error("Error with GET");
			}
		},
		'after_login': function() {
			/* Update the user's friend list */
			Meteor.call('get_venmo_friends', function(err, res) {
				if (err) {
					throw new Meteor.Error("Unable to retrieve Venmo friends.");
				}
				Friends.upsert(Meteor.userId(), {$set: {'venmo_friends': res}});
			});
		},
		'pay_sandbox': function(){
			var user = Meteor.users.findOne({});
			if (!user) {
				throw new Meteor.Error("Couldn't retrieve Venmo friends; user is not logged in.");
			}
			var venmo_id = "145434160922624933";
			var access = user.services.venmo.accessToken;
			var url = "https://sandbox-api.venmo.com/v1/payments";
			var req = HTTP.call("POST", url, 
								{params: {access_token: access, user_id: venmo_id, note: "test", amount: 0.1}},
								function(error, result){
									if(error){
										console.log(error);
										throw new Meteor.Error("Error with POST");
									} else {
										console.log(result);
										return result;
									}
								});

		}

	});
}
