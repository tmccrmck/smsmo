/* Meteor methods to load early*/

if (Meteor.isServer){

	Meteor.methods({
		/* Retrieves the current user's venmo friends. Currently only makes one GET request
		 * for a maximum of 2000 friends. We might need to account for pagination. */
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
		/* Performs some additional setup after the user logs in,
		 * including updating the user's friend list. */
		'after_login': function() {
			/* Update the user's friend list */
			Meteor.call('get_venmo_friends', function(err, res) {
				if (err) {
					throw new Meteor.Error("Unable to retrieve Venmo friends.");
				}
				Friends.upsert(Meteor.userId(), {$set: {'venmo_friends': res}});
			});
			/* If the user doesn't have the purchases field, add it.
			 * This is fired each time the user logs in, maybe there's a 
			 * better way to do this? The venmo-oauth package seems to 
			 * take care of user creation for us, so I'm not sure. */
			if (Meteor.user().purchases == undefined) {
				Meteor.users.update(Meteor.userId(), {$set: {purchases: {created: [], invited: []}}});
			}
		},
		'pay_sandbox': function(){
			var user = Meteor.user();
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
