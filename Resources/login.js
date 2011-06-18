Ti.UI.setBackgroundColor('#fff');

container = Ti.UI.currentWindow;

var win = Titanium.UI.createWindow({
	navBarHidden : true
});

var nav = Titanium.UI.iPhone.createNavigationGroup({
   window : win
});

container.add(nav);

var logo = Ti.UI.createImageView({
	image : 'images/headLogo.png',
	height : 300,
	width : 300, 
	top : 100
});

var passwordField = Ti.UI.createTextField({
    autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    width:300,
    top:90,
    height: 35,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    passwordMask : true,
    hintText:'Password'
});

var emailField = Ti.UI.createTextField({
    autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    width:300,
    top:30,
    height: 35,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    hintText:'Username'
});

var confirmButton = Ti.UI.createButton({
	title : 'Sign In',
	width : 130,
	height : 40, 
	bottom : 20
});

confirmButton.addEventListener('click', function(){
	var newWin = Ti.UI.createWindow({
		url : 'explore.js',
		navBarHidden : true
	})
	nav.open(newWin);
	//newWin.open({transition : Titanium.UI.iPhone.AnimationStyle.CURL_UP});
	//win.visible = false;
});

win.add(logo);
//win.add(username);
win.add(emailField);
//win.add(passwordLabel);
win.add(passwordField);
win.add(confirmButton);
