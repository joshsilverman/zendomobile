Ti.UI.setBackgroundColor('#fff');
var win = Ti.UI.currentWindow;
Titanium.UI.orientation = Titanium.UI.PORTRAIT;
var currentOrientation = Titanium.UI.PORTRAIT;
var focused = false;

Ti.include('dimensions.js');
Ti.include('authenticate.js');

Ti.Gesture.addEventListener('orientationchange',function(e){
    currentOrientation = Ti.Gesture.orientation; 
    adjustViews();
});

win.addEventListener('focus', function() {
	// var check = function() {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// alert("Internet connection NOT found");
		alert('Could not reach your account. Check your internet connection.');
	} else {
		if ( Ti.App.Properties.getBool('active') == false ) {
			attemptAutoLogin();
		} else {
			authSuccess(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'));
		} 
	}	
// }
    // setTimeout(check, 2000);
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
	// logo.hide();
	win.add(logo);
	
	win.add(passwordField);
	win.add(confirmButton);	
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