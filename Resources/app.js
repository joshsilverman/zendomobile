//Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;
Ti.API.debug("Console working!");

var win = Ti.UI.createWindow({
	url:"newReview.js",
	navBarHidden : true
});

//USER OPENS THE APP MANUALLY:
//if new user:
//	ask user if they would like to enable push
//	if no:
//		take user to their notes
//	if yes:
//		inform Zendo user want to receive notifications
//		register with UA:
// 			Ti.include('urbanairship.js');
// 			Ti.include('pushRegistration.js');
// 			UrbanAirship.key='gjah01G_R0O6v1bpPGGVwg';
// 			UrbanAirship.secret ='fy0VM1uWRIumLKgkAs67og';
// 			UrbanAirship.master_secret='yUj9LSpyS7qMYjtiwvmUEA';
// 			UrbanAirship.baseurl = 'https://go.urbanairship.com';
//
//if returning user:
//	take user to their notes		
//
//USER ENTERS THE APP VIA A PUSH NOTIFICATION:
//	take the user directly to cards that need to be reviewed

//Query server, check if push notifications are enabled
//If enabled:
//	register();

//If disabled:
//	unregister();

Titanium.Network.registerForPushNotifications({
	types: [
		Titanium.Network.NOTIFICATION_TYPE_BADGE,
		Titanium.Network.NOTIFICATION_TYPE_ALERT,
		Titanium.Network.NOTIFICATION_TYPE_SOUND
	],
	success:function(e) {
		var deviceToken = e.deviceToken;
		label.text = "Device registered. Device token: \n\n"+deviceToken;
		Ti.API.info("Push notification device token is: "+deviceToken);
		Ti.API.info("Push notification types: "+Titanium.Network.remoteNotificationTypes);
		Ti.API.info("Push notification enabled: "+Titanium.Network.remoteNotificationsEnabled);
	},
	error:function(e) {
		label.text = "Error during registration: "+e.error;
	},
	callback:function(e) {
		var newWin = Ti.UI.createWindow({
			url:"review.js",
			modal:true
		}); 
		newWin.open();
	}
});	

win.open();