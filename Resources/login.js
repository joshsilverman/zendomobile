Ti.UI.setBackgroundColor('#000');
Ti.API.debug(Ti.Network.online);
var win = Ti.UI.currentWindow;
// Ti.UI.orientation = Ti.UI.PORTRAIT;
// 
// win.orientationModes = [
    // Titanium.UI.PORTRAIT
// ];

Ti.include('authenticate.js');

function render() {
	var passwordField = Ti.UI.createTextField({
	    autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
	    autocorrect : false,
	    width : 300,
	    top : 170,
	    height : 35,
	    borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	    passwordMask : true,
	    keyboardType : Titanium.UI.KEYBOARD_URL,
	    hintText : 'Password'
	});
	
	var emailField = Ti.UI.createTextField({
	    autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
	    autocorrect : false,
	    width : 300,
	    top : 120,
	    height : 35,
	    borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	    keyboardType : Titanium.UI.KEYBOARD_URL,
	    hintText : 'Email'
	});
	
	var confirmButton = Ti.UI.createButton({
		title : 'Sign In',
		width : 130,
		height : 40, 
		bottom : 30
	});
	
	confirmButton.addEventListener('click', function(){
		var email = emailField.value; 
		var password = passwordField.value;
		if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
			alert("Looks like you don't have an Internet connection... You will need one to use this application!");
		} else { 
			authenticate(email, password);
		}		
	});
	
	var logo = Ti.UI.createImageView({
		image : 'images/logo_background.png', 
		top : 0
	});
	
	// win.add(logo);
	win.add(emailField);
	win.add(passwordField);
	win.add(confirmButton);	
	emailField.focus();
}