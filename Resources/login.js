Ti.UI.setBackgroundColor('#000');
Ti.UI.orientation = Ti.UI.PORTAIT;
container = Ti.UI.currentWindow;
var win = Titanium.UI.createWindow({
	navBarHidden : true
});
var nav = Titanium.UI.iPhone.createNavigationGroup({
   window : win
});
container.add(nav);

Ti.include('authenticate.js');

// var logo = Ti.UI.createImageView({
	// image : 'images/headLogo.png',
	// height : 300,
	// width : 300, 
	// top : 100
// });

var passwordField = Ti.UI.createTextField({
    autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    width : 300,
    bottom : 120,
    height : 35,
    borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    passwordMask : true,
    hintText : 'Password'
});

var emailField = Ti.UI.createTextField({
    autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    width : 300,
    bottom : 170,
    height : 35,
    borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    hintText : 'Username'
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
	authenticate(email, password);
});

var logo = Ti.UI.createImageView({
	image : 'images/logo.png', 
	top : 100,
	width : 200, 
	height : 80
});

win.add(logo);
win.add(emailField);
win.add(passwordField);
win.add(confirmButton);
