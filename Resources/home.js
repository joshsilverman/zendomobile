var win = Ti.UI.currentWindow;
Ti.include('networkMethods.js');
Ti.include('dimensions.js');
Ti.App.Properties.setBool('foreground', true);
Ti.App.Properties.setBool('launching', false);

registerDevice(Ti.App.Properties.getString("token"));

//TODO 
// Register for push notifications
// 
// On success:
//   Post e.deviceToken
//
// function registerForPush() {
	// Titanium.Network.registerForPushNotifications({
		// types : [
			// Titanium.Network.NOTIFICATION_TYPE_BADGE,
			// Titanium.Network.NOTIFICATION_TYPE_ALERT,
			// Titanium.Network.NOTIFICATION_TYPE_SOUND
		// ],
		// success : function(e) {
			// registerDevice(e.deviceToken);
			// //add a device for the user
// 		
			// //var deviceToken = e.deviceToken;
			// //alert("Push notification device token is: " + deviceToken);
			// //alert("Push notification types: " + Titanium.Network.remoteNotificationTypes);
			// //alert("Push notification enabled: " + Titanium.Network.remoteNotificationsEnabled);
		// },
		// error : function(e) {
			// alert("Error during registration: " + e.error);
		// },
		// callback : function(e) {
			// if (Ti.App.Properties.getBool('foreground') == true) {
				// var reviewAlert = Ti.UI.createAlertDialog({
				    // title : 'You have new cards to review!',
				    // message : "Go to them now?",
				    // buttonNames : ["Later", "Review"],
				    // cancel : 0
				// });
				// reviewAlert.addEventListener('click', function(f) {
					// if (f.index == 1) { 
						// retrieveAllNotifications(); 
					// };
				// })
				// reviewAlert.show();		
			// } else {
				// checkLoggedIn("push");
			// }
		// }
	// });	
// }
// 
// registerForPush();
	    
var currentOrientation = Ti.Gesture.orientation;

Ti.Gesture.addEventListener('orientationchange', function(e){
    currentOrientation = Ti.Gesture.orientation; 
    adjustViews();
});

var notificationsButton = Ti.UI.createImageView({
	image : 'images/notifications.jpg',
	top : 50,
	bottom : null,
	right : null,
	left : null,
	height : 120
});

notificationsButton.addEventListener( 'click', function() {
	retrieveAllNotifications();
	// Ti.API.debug("Add notifications panel!");
	// var newWin = Ti.UI.createWindow({
		// url : 'notifications.js',
		// navBarHidden : false,
		// barColor : '#000',
		// nav : win.nav,
		// _parent: Titanium.UI.currentWindow,
		// orientationModes : [
			// Titanium.UI.PORTRAIT,
			// Titanium.UI.UPSIDE_PORTRAIT,
			// Titanium.UI.LANDSCAPE_LEFT,
			// Titanium.UI.LANDSCAPE_RIGHT
		// ]
	// });
	// win.nav.open(newWin);	
});

var notesButton = Ti.UI.createImageView({
	image : 'images/folder.png',
	bottom : 70,
	top : null,
	right : null, 
	left : null,
	height : 110
});

notesButton.addEventListener( 'click', function() {
	var newWin = Ti.UI.createWindow({
		url : 'folders.js',
		navBarHidden : false,
		barColor : '#000',
		nav : win.nav,
		_parent: Titanium.UI.currentWindow,
		orientationModes : [
			Titanium.UI.PORTRAIT,
			Titanium.UI.UPSIDE_PORTRAIT,
			Titanium.UI.LANDSCAPE_LEFT,
			Titanium.UI.LANDSCAPE_RIGHT
		]
	});
	win.nav.open(newWin);	
});

win.add(notificationsButton);
win.add(notesButton);

function renderNavBar() {
	var signOutButton = Ti.UI.createButton({ title : 'Sign Out' });
	signOutButton.addEventListener('click', function() {
		signOut();
		// win.nav.close(win);
	});
	var accountButton = Ti.UI.createButton({ title : 'Account' });
	accountButton.addEventListener('click', function(){ 
		var newWin = Ti.UI.createWindow({
			url : 'account.js',
			navBarHidden : false,
			barColor : '#000',
			nav : win.nav,
			_parent: Titanium.UI.currentWindow,
			orientationModes : [
				Titanium.UI.PORTRAIT,
				Titanium.UI.UPSIDE_PORTRAIT,
				Titanium.UI.LANDSCAPE_LEFT,
				Titanium.UI.LANDSCAPE_RIGHT
			]
		});
		win.nav.open(newWin);	
	});
	win.leftNavButton = signOutButton;	
}

function adjustViews() {
	if ( currentOrientation == 1 || currentOrientation == 2 ) {
		Ti.API.debug("Portrait mode");
		Ti.API.debug(screenHeight);
		Ti.API.debug(screenWidth);
		
		notesButton.left = null;
		notesButton.right = null;
		notesButton.bottom = 70;
		notesButton.top = null;

		notificationsButton.right = null;
		notificationsButton.left = null;
		notificationsButton.bottom = null;
		notificationsButton.top = 50;
	} 
	if ( currentOrientation == 3 || currentOrientation == 4 ) {
		Ti.API.debug("Landscape mode");
		Ti.API.debug(screenHeight);
		Ti.API.debug(screenWidth);
		
		notesButton.bottom = null
		notesButton.top = null;
		notesButton.left = null;
		notesButton.right = -200;
		
		notificationsButton.right = null;
		notificationsButton.left = -200;
		notificationsButton.top = null;
		notificationsButton.bottom = null;
	}
}

renderNavBar();
adjustViews();
if ( Ti.App.Properties.getBool('notification') == true ) {
	Ti.App.Properties.setBool('notification', false);
	retrieveAllNotifications();
}
