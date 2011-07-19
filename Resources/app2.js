Ti.UI.setBackgroundColor('#fff');
var win = Ti.UI.currentWindow;
Titanium.UI.orientation = Titanium.UI.PORTRAIT;
var currentOrientation = Titanium.UI.PORTRAIT;
var focused = false;

Ti.include('networkMethods.js');
Ti.include('dimensions.js');
Ti.include('authenticate.js');

Ti.App.Properties.setBool('active', false);
Ti.App.Properties.setBool('launching', true);
Ti.App.Properties.setBool('foreground', false);

var container = Ti.UI.createWindow({
	navBarHidden : true,
	orientationModes : [
		Titanium.UI.PORTRAIT,
		Titanium.UI.UPSIDE_PORTRAIT,
		Titanium.UI.LANDSCAPE_LEFT,
		Titanium.UI.LANDSCAPE_RIGHT
	]
});

var win = Ti.UI.createWindow({
	navBarHidden : true,
	orientationModes : [
		Titanium.UI.PORTRAIT,
		Titanium.UI.UPSIDE_PORTRAIT
	]
});

var nav = Titanium.UI.iPhone.createNavigationGroup({
   window : win
});

emailField = Ti.UI.createTextField({
    autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    autocorrect : false,
    width : 300,
    top : 250,
    height : 35,
    borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    keyboardType : Titanium.UI.KEYBOARD_URL,
    returnKeyType : Titanium.UI.RETURNKEY_DONE,
    hintText : 'Email'
});
		
emailField.addEventListener('focus', function() {
	focused = true;
	adjustViews();
});

emailField.addEventListener('blur', function() {
	focused = false;
	adjustViews();
});	

win.add(emailField);

passwordField = Ti.UI.createTextField({
    autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    autocorrect : false,
    width : 300,
    top : 300,
    height : 35,
    borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    passwordMask : true,
    keyboardType : Titanium.UI.KEYBOARD_URL,
    returnKeyType : Titanium.UI.RETURNKEY_DONE,
    hintText : 'Password'
});

passwordField.addEventListener('focus', function() {
	focused = true;
	adjustViews();
});

passwordField.addEventListener('blur', function() {
	focused = false;
	adjustViews();
});

confirmButton = Ti.UI.createButton({
	title : 'Sign In',
	width : 100,
	height : 40, 
	bottom : 50
});

confirmButton.addEventListener('click', function(){
	var email = emailField.value; 
	var password = passwordField.value;
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert('Could not reach your account. Check your internet connection.');
	} else { 
		authenticate(email, password);
		passwordField.value = "";
	}		
});

logo = Ti.UI.createLabel({
	text : 'StudyEgg', 
	textAlign : 'center',
	top : 10,
	height : 200,
	font : {fontSize : 64, fontWeight:'bold', fontFamily:'Marker Felt'} 
});

// logo = Ti.UI.createImageView({
	// image : 'images/eggLogo.png',
	// top : 50,
	// height : 100
// });

// logo.hide();
win.add(logo);

win.add(passwordField);
win.add(confirmButton);	
// emailField.focus();
win.addEventListener('focus', function() {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert('Could not reach your account. Check your internet connection.');
	} else {
		if ( Ti.App.Properties.getBool('active') == false ) {
			attemptAutoLogin();
		} else {
			authSuccess(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'));
		} 
	}	
});

win.nav = nav;
container.add(nav);
container.open();

function registerForPush() {
	Titanium.Network.registerForPushNotifications({
		types : [
			Titanium.Network.NOTIFICATION_TYPE_BADGE,
			Titanium.Network.NOTIFICATION_TYPE_ALERT,
			Titanium.Network.NOTIFICATION_TYPE_SOUND
		],
		success : function(e) {
			//var deviceToken = e.deviceToken;
			//alert("Push notification device token is: " + deviceToken);
			//alert("Push notification types: " + Titanium.Network.remoteNotificationTypes);
			//alert("Push notification enabled: " + Titanium.Network.remoteNotificationsEnabled);
		},
		error : function(e) {
			alert("Error during registration: " + e.error);
		},
		callback : function(e) {
			if (Ti.App.Properties.getBool('foreground') == true) {
				var reviewAlert = Ti.UI.createAlertDialog({
				    title : 'You have new cards to review!',
				    message : "Go to them now?",
				    buttonNames : ["Later", "Review"],
				    cancel : 0
				});
				reviewAlert.addEventListener('click', function(f) {
					if (f.index == 1) { getLines(e.data.doc, "push"); };
				})
				reviewAlert.show();		
			} else {
				getLines(e.data.doc, "push");
			}
		}
	});	
}

registerForPush();

function adjustViews() {	
	if ( focused == true ) {
		if ( currentOrientation == 1 || currentOrientation == 2 ) {
			Ti.API.debug("Keyboard up, portrait mode");
			logo.hide();
			emailField.top = 60;
			passwordField.top = 110;
			confirmButton.bottom = null;
			confirmButton.top = 160;
		} 
		if ( currentOrientation == 3 || currentOrientation == 4 ) {
			Ti.API.debug("Keyboard up, landscape mode");
			logo.hide();
			emailField.top = 10;
			passwordField.top = 50;
			confirmButton.bottom = null;
			confirmButton.top = 90;
		}
	} else {
		if ( currentOrientation == 1 || currentOrientation == 2 ) {
			Ti.API.debug("Keyboard hidden, portrait mode");
			logo.height = 200;
			logo.show();
			emailField.top = 250;
			passwordField.top = 300;
			// confirmButton.top = 380;
			confirmButton.top = null;
			confirmButton.bottom = 50;
		}
		if ( currentOrientation == 3 || currentOrientation == 4 ) {
			Ti.API.debug("Keyboard hidden, landscape mode");
			logo.height = 100;
			logo.show();
			emailField.top = 130;
			passwordField.top = 180;
			// confirmButton.top = 240;
			confirmButton.top = null;
			confirmButton.bottom = 20;
		}		
	}
}


Ti.Gesture.addEventListener('orientationchange',function(e){
    currentOrientation = Ti.Gesture.orientation; 
    adjustViews();
});

Ti.App.addEventListener('resume', function() { 
	var check = function() {
		if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
			alert('Could not reach your account. Check your internet connection.');
		} else {
			checkLoggedIn(); 
		}	
	}
    setTimeout(check, 2000);
});

Ti.App.addEventListener('resumed', function(e) { 
	Ti.App.Properties.setBool('foreground', true);
});

Ti.App.addEventListener('pause', function(e) { 
	Ti.App.Properties.setBool('foreground', false);
});