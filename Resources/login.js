Ti.UI.setBackgroundColor('#fff');
var win = Ti.UI.currentWindow;
win.name = "Login";
Ti.App.current_win = win;

Titanium.UI.orientation = Titanium.UI.PORTRAIT;
var currentOrientation = Titanium.UI.PORTRAIT;
var focused = false;

Ti.include('networkMethods.js');
Ti.include('dimensions.js');
Ti.include('authenticate.js');

function registerForPush() {
	Titanium.Network.registerForPushNotifications({
		types : [
			Titanium.Network.NOTIFICATION_TYPE_BADGE,
			Titanium.Network.NOTIFICATION_TYPE_ALERT,
			Titanium.Network.NOTIFICATION_TYPE_SOUND
		],
		success : function(e) {
			Ti.App.Properties.setString("token", e.deviceToken);
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
					if (f.index == 1) { 
						win.hide();
						retrieveAllNotifications(); 
					};
				});
				reviewAlert.show();		
			} else {
				reLogUser(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'), "push");
			}
		}
	});	
}

registerForPush();

// Ti.Gesture.addEventListener('orientationchange', function(e){
	// retrieveAllNotifications();
// });

win.addEventListener('focus', function() {
	// alert("Focus");
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

Ti.App.addEventListener('resume', function() { 
	// alert("Resume");
	// var check = function() {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert('Could not reach your account. Check your internet connection.');
	} else {
		// checkLoggedIn("normal"); 
		reLogUser(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'), "normal");
	}	
// };
    // setTimeout(check, 2000);
});

Ti.App.addEventListener('resumed', function(e) { 
	Ti.App.Properties.setBool('foreground', true);
});

Ti.App.addEventListener('pause', function(e) { 
	Ti.App.Properties.setBool('foreground', false);
});
	
function render() {
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
		bottom : 70
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

	signUpButton = Ti.UI.createButton({
		title : 'Sign Up',
		width : 100,
		height : 40, 
		bottom : 20
	});
	
	signUpButton.addEventListener('click', function(){
		var newWin = Ti.UI.createWindow({
			url : "signUp.js",
			navBarHidden : true,
			barColor : '#000',
			nav : win.nav,
			_parent: Titanium.UI.currentWindow,
			exitOnClose: true
		});
		win.nav.open(newWin);	
	});
	// logo = Ti.UI.createLabel({
		// text : 'StudyEgg', 
		// textAlign : 'center',
		// top : 10,
		// height : 200,
		// font : {fontSize : 64, fontWeight:'bold', fontFamily:'Marker Felt'} 
	// });
	
	logo = Ti.UI.createImageView({
		image : 'images/studyegg_logo.jpg',
		height : 130,
		top : 55
	});
	
	// logo.hide();
	win.add(logo);
	
	win.add(passwordField);
	win.add(confirmButton);	
	win.add(signUpButton);
	// emailField.focus();
}

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
			logo.top = 55;
			logo.show();
			emailField.top = 250;
			passwordField.top = 300;
			// confirmButton.top = 380;
			confirmButton.top = null;
			confirmButton.bottom = 70;
		}
		if ( currentOrientation == 3 || currentOrientation == 4 ) {
			Ti.API.debug("Keyboard hidden, landscape mode");
			logo.top = 20;
			logo.show();
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

// function adjustViews() {	
	// if ( focused == true ) {
		// if ( currentOrientation == 1 || currentOrientation == 2 ) {
			// Ti.API.debug("Keyboard up, portrait mode");
			// logo.hide();
			// emailField.top = 60;
			// passwordField.top = 110;
			// confirmButton.bottom = null;
			// confirmButton.top = 160;
		// } 
		// if ( currentOrientation == 3 || currentOrientation == 4 ) {
			// Ti.API.debug("Keyboard up, landscape mode");
			// logo.hide();
			// emailField.top = 10;
			// passwordField.top = 50;
			// confirmButton.bottom = null;
			// confirmButton.top = 90;
		// }
	// } else {
		// if ( currentOrientation == 1 || currentOrientation == 2 ) {
			// Ti.API.debug("Keyboard hidden, portrait mode");
			// logo.height = 200;
			// logo.show();
			// emailField.top = 250;
			// passwordField.top = 300;
			// // confirmButton.top = 380;
			// confirmButton.top = null;
			// confirmButton.bottom = 50;
		// }
		// if ( currentOrientation == 3 || currentOrientation == 4 ) {
			// Ti.API.debug("Keyboard hidden, landscape mode");
			// logo.height = 100;
			// logo.show();
			// emailField.top = 130;
			// passwordField.top = 180;
			// // confirmButton.top = 240;
			// confirmButton.top = null;
			// confirmButton.bottom = 20;
		// }		
	// }
// }