// var nav = Titanium.UI.iPhone.createNavigationGroup({
   // window : win
// });
Ti.App.Properties.setBool('active', false);

var container = Ti.UI.createWindow({
	navBarHidden : true,
	orientationModes : [
		Titanium.UI.PORTRAIT,
		Titanium.UI.UPSIDE_PORTRAIT,
		Titanium.UI.LANDSCAPE_LEFT,
		Titanium.UI.LANDSCAPE_RIGHT
	]
});

var newWin = Ti.UI.createWindow({
	url:"login.js",
	navBarHidden : true,
	//TODO not working!
	orientationModes : [
		Titanium.UI.PORTRAIT,
		Titanium.UI.UPSIDE_PORTRAIT
	]
});

var nav = Titanium.UI.iPhone.createNavigationGroup({
   window : newWin
});

newWin.nav = nav;

container.add(nav);
container.open();
// omniAuth();
// 
// function omniAuth() {
	// // alert(Ti.App.Properties.getBool('active'));
	// xhr = Ti.Network.createHTTPClient();
	// xhr.setTimeout(1000000);
	// xhr.onload = function() {
		// alert(this.responseText);	
	// }	
	// // xhr.onreadystatechange = function() {
		// // if (this.readyState == 4) {
			// // if (this.status == 200) {
				// // if ( Ti.App.Properties.getBool('active') == 0 ) {
					// // // alert('User is logged in but not in app, trying to get saved login...');
					// // authSuccess(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'));
				// // }
// // 
			// // } else {
				// // // alert('User is not logged in to server... Attempting auto login...');
				// // attemptAutoLogin();
			// // }
		// // }
	// // }	
	// xhr.open("GET", "http://zen.do/auth/open_id?openid_url=gmail.com");
	// xhr.setRequestHeader('Content-Type', 'text/html');
	// xhr.send();
// }

// nav.open(newWin);
// win.open();

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



//TODO uncomment for push notifications

// Titanium.Network.registerForPushNotifications({
	// types: [
		// Titanium.Network.NOTIFICATION_TYPE_BADGE,
		// Titanium.Network.NOTIFICATION_TYPE_ALERT,
		// Titanium.Network.NOTIFICATION_TYPE_SOUND
	// ],
	// success:function(e) {
		// var deviceToken = e.deviceToken;
		// label.text = "Device registered. Device token: \n\n"+deviceToken;
		// Ti.API.info("Push notification device token is: "+deviceToken);
		// Ti.API.info("Push notification types: "+Titanium.Network.remoteNotificationTypes);
		// Ti.API.info("Push notification enabled: "+Titanium.Network.remoteNotificationsEnabled);
	// },
	// error:function(e) {
		// //label.text = "Error during registration: "+e.error;
	// },
	// callback:function(e) {
		// var newWin = Ti.UI.createWindow({
			// url:"review.js",
			// modal:true
		// }); 
		// newWin.open();
	// }
// });	

