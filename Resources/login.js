var win = Ti.UI.currentWindow;
win.backgroundImage = 'images/splash@2x.png';

Titanium.UI.orientation = Titanium.UI.PORTRAIT;
var currentOrientation = Titanium.UI.PORTRAIT;

Ti.include('authentication.js');
Ti.include('commonMethods.js');

activityIndicator = Titanium.UI.createActivityIndicator({
	style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
});

function render() {
	emailField = Ti.UI.createTextField({
	    autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
	    autocorrect : false,
	    width : 300,
	    bottom : 130,
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
	    bottom : 80,
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
		right : 50,
		bottom : 20
	});
	
	confirmButton.addEventListener('click', function(){
		var email = emailField.value; 
		var password = passwordField.value;
		if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
			alert("Could not complete your request. Check your connection and try again.");
		} else { 
			win.add(activityIndicator);
			activityIndicator.show();
			authenticate(email, password, "login");
			passwordField.value = "";
		}	
		emailField.blur();
		passwordField.blur();	
	});

	signUpButton = Ti.UI.createButton({
		title : 'Sign Up',
		width : 100,
		height : 40,
		left : 50, 
		bottom : 20
	});
	
	signUpButton.addEventListener('click', function(){
		var newWin = Ti.UI.createWindow({
			url : "signUp.js",
			navBarHidden : true,
			backgroundColor : '#dfdacd',
			barColor : '#000',
			nav : win.nav,
			_parent: Titanium.UI.currentWindow,
			exitOnClose: true
		});
		emailField.blur();
		passwordField.blur();
		newWin.open();
	});
	
	win.add(passwordField);
	win.add(confirmButton);	
	win.add(signUpButton);
	// emailField.focus();
}

function adjustViews() {	
	if ( focused == true ) {
		if ( currentOrientation == 1 || currentOrientation == 2 ) {
			win.backgroundImage = 'images/splash-bg@2x.png';
			Ti.API.debug("Keyboard up, portrait mode");
			// studyEggLogo.hide();
			emailField.top = 60;
			emailField.bottom = null;
			passwordField.top = 110;
			passwordField.bottom = null;
			confirmButton.bottom = null;
			confirmButton.top = 160;
			signUpButton.bottom = null;
			signUpButton.top = 160;
		} 
		if ( currentOrientation == 3 || currentOrientation == 4 ) {
			Ti.API.debug("Keyboard up, landscape mode");
			// studyEggLogo.hide();
			emailField.top = 10;
			passwordField.top = 50;
			confirmButton.bottom = null;
			confirmButton.top = 90;
		}
	} else {
		if ( currentOrientation == 1 || currentOrientation == 2 ) {
			win.backgroundImage = 'images/splash@2x.png';
			Ti.API.debug("Keyboard hidden, portrait mode");
			// studyEggLogo.top = 55;
			// studyEggLogo.show();
			emailField.top = null;
			emailField.bottom = 130;
			passwordField.top = null;
			passwordField.bottom = 80;
			// confirmButton.top = 380;
			confirmButton.top = null;
			confirmButton.bottom = 20;
			signUpButton.top = null;
			signUpButton.bottom = 20;
		}
		if ( currentOrientation == 3 || currentOrientation == 4 ) {
			Ti.API.debug("Keyboard hidden, landscape mode");
			// studyEggLogo.top = 20;
			// studyEggLogo.show();
			emailField.top = 130;
			passwordField.top = 180;
			// confirmButton.top = 240;
			confirmButton.top = null;
			confirmButton.bottom = 20;
		}		
	}
}

function shiftAboveKeyboard() {
	Ti.API.debug(currentOrientation);
	Ti.API.debug(currentFocus);
	Ti.API.debug("Shift above keyboard.");
	emailField.top = 10;
	passwordField.top = 50;
	confirmButton.top = 90;
}

function keyboardDismissed() {
	Ti.API.debug(currentOrientation);
	Ti.API.debug(currentFocus);
	Ti.API.debug("Shift back down.");
	emailField.top = 100;
	passwordField.top = 150;
	confirmButton.top = 200;
}

render();

// function registerForPush() {
	// Titanium.Network.registerForPushNotifications({
		// types : [
			// Titanium.Network.NOTIFICATION_TYPE_BADGE,
			// Titanium.Network.NOTIFICATION_TYPE_ALERT,
			// Titanium.Network.NOTIFICATION_TYPE_SOUND
		// ],
		// success : function(e) {
			// Ti.App.Properties.setString("token", e.deviceToken);
		// },
		// error : function(e) {
			// alert("Error during registration: " + e.error);
		// },
		// callback : function(e) {
			// // Ti.App.Properties.setBool('notification', true);
			// if (Ti.App.Properties.getBool('foreground') == true) {
				// alert("Callback from foreground!");
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
				// });
				// reviewAlert.show();		
			// } else {
				// alert("Callback from background!");
				// reLogUser(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'), "push");
			// }
		// }
	// });	
// }
// 
// registerForPush();

// Ti.Gesture.addEventListener('orientationchange', function(e){
	// retrieveAllNotifications();
// });

// win.addEventListener('focus', function() {
	// // alert("Focus");
	// // if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// // alert('Could not reach your account. Check your internet connection.');
	// // } else {
		// if ( Ti.App.Properties.getBool('active') == false ) {
			// attemptAutoLogin();
		// } else {
			// authSuccess(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'));
		// } 
	// // }	
// });

// Ti.App.addEventListener('resume', function() { 
	// // alert("Resume");
	// // var check = function() {
	// // if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// // alert('Could not reach your account. Check your internet connection.');
	// // } else {
		// // checkLoggedIn("normal"); 
		// reLogUser(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'), "normal");
	// // }	
// // };
    // // setTimeout(check, 2000);
// });

// Ti.App.addEventListener('resumed', function(e) { 
	// Ti.App.Properties.setBool('foreground', true);
// });
// 
// Ti.App.addEventListener('pause', function(e) { 
	// Ti.App.Properties.setBool('foreground', false);
// });
	
