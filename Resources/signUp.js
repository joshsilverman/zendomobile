var win = Ti.UI.currentWindow;
Ti.UI.setBackgroundColor('#dfdacd');
win.backgroundImage = 'images/splash@2x.png';

// Ti.App.current_win = win;

Titanium.UI.orientation = Titanium.UI.PORTRAIT;
var currentOrientation = Titanium.UI.PORTRAIT;
var focused = false;

// Ti.include('networkMethods.js');
// Ti.include('helperMethods.js');
// Ti.include('dimensions.js');
Ti.include('commonMethods.js');
var screenHeight = Ti.Platform.displayCaps.platformHeight;
var screenWidth = Ti.Platform.displayCaps.platformWidth;

// activityIndicator = Titanium.UI.createActivityIndicator({
	// style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
// });

function render() {
	scrollView = Ti.UI.createScrollView({
		contentWidth: screenWidth,
    	contentHeight: screenHeight * .9,
    	touchEnabled : false
    	// top:0,
	});
		
	emailField = Ti.UI.createTextField({
	    autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
	    autocorrect : false,
	    width : screenWidth * .75,
	    bottom : 180,
	    height : 45,
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
	
	passwordField = Ti.UI.createTextField({
	    autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
	    autocorrect : false,
	    width : screenWidth * .75,
	    bottom : 130,
	    height : 45,
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

	confirmPasswordField = Ti.UI.createTextField({
	    autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
	    autocorrect : false,
	    width : screenWidth * .75,
	    bottom : 80,
	    height : 45,
	    borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	    passwordMask : true,
	    keyboardType : Titanium.UI.KEYBOARD_URL,
	    returnKeyType : Titanium.UI.RETURNKEY_DONE,
	    hintText : 'Confirm Password'
	});

	confirmPasswordField.addEventListener('focus', function() {
		focused = true;
		adjustViews();
	});
	
	confirmPasswordField.addEventListener('blur', function() {
		focused = false;
		adjustViews();
	});
		
	confirmButton = Ti.UI.createButton({
		title : 'Sign Up',
		width : 100,
		height : 40, 
		right : 50,
		bottom : 20
	});
	
	confirmButton.addEventListener('click', function(){
		var email = emailField.value; 
		var password = passwordField.value;
		var passwordConfirmation = confirmPasswordField.value;
		if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
			alert("Could not complete your request. Check your connection and try again.");
			return;
		} else {		
			if ( password != passwordConfirmation) {
				alert("Your password and password confirmation must match!");
				return;
			} else {
				if (email.length < 1) {
					alert("You must enter an email address!");
				} else {
					if (password.length < 6) {
						alert("Your password must be at least six characters!");
						return;				
					} else {	
						// activityIndicator.show();
						// win.add(activityIndicator);						
						signUp(email, password);
						emailField.blur();
						passwordField.blur();
						confirmPasswordField.blur();	
					}
				}	
			}	
		}
	});

	cancelButton = Ti.UI.createButton({
		title : 'Cancel',
		width : 100,
		height : 40,
		left : 50, 
		bottom : 20
	});
	
	cancelButton.addEventListener('click', function(){
		Ti.App.current_win = win._parent;
		win.close(win);	
	});
	
	// logo = Ti.UI.createImageView({
		// image : 'images/studyegg_logo.jpg',
		// height : 130,
		// top : 35
	// });
	
	// logo.hide();
	// win.add(logo);
	scrollView.add(emailField)
	scrollView.add(confirmPasswordField);
	scrollView.add(passwordField);
	scrollView.add(confirmButton);	
	scrollView.add(cancelButton);
	win.add(scrollView);
	// win.add(emailField);
	// win.add(confirmPasswordField);
	// win.add(passwordField);
	// win.add(confirmButton);	
	// win.add(cancelButton);
	// emailField.focus();
}

function adjustViews() {	
	// if ( focused == true ) {
		// if ( currentOrientation == 1 || currentOrientation == 2 ) {
			// win.backgroundImage = 'images/splash-bg@2x.png';
			// Ti.API.debug("Keyboard up, portrait mode");
			// // logo.hide();
			// emailField.bottom = null;
			// emailField.top = 30;
			// passwordField.bottom = null;
			// passwordField.top = 80;
			// confirmPasswordField.bottom = null;
			// confirmPasswordField.top = 130;
			// confirmButton.bottom = null;
			// confirmButton.top = 180;
			// cancelButton.bottom = null;			
			// cancelButton.top = 180;
		// } 
		// if ( currentOrientation == 3 || currentOrientation == 4 ) {
			// Ti.API.debug("Keyboard up, landscape mode");
			// // logo.hide();
			// emailField.top = 10;
			// passwordField.top = 50;
			// confirmButton.bottom = null;
			// confirmButton.top = 90;
		// }
	// } else {
		// if ( currentOrientation == 1 || currentOrientation == 2 ) {
			// win.backgroundImage = 'images/splash@2x.png';
			// Ti.API.debug("Keyboard hidden, portrait mode");
			// // logo.top = 55;
			// // logo.show();
			// emailField.bottom = 180;
			// emailField.top = null;
			// passwordField.bottom = 130;
			// passwordField.top = null;
			// confirmPasswordField.bottom = 80;
			// confirmPasswordField.top = null;
			// confirmButton.top = null;
			// confirmButton.bottom = 20;
			// cancelButton.top = null;
			// cancelButton.bottom = 20;
		// }
		// if ( currentOrientation == 3 || currentOrientation == 4 ) {
			// Ti.API.debug("Keyboard hidden, landscape mode");
			// // logo.top = 20;
			// // logo.show();
			// emailField.top = 130;
			// passwordField.top = 180;
			// // confirmButton.top = 240;
			// confirmButton.top = null;
			// confirmButton.bottom = 20;
		// }		
	// }
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