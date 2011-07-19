Ti.include('networkMethods.js');

// render();

function attemptAutoLogin() {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not log you in. Check your Internet connection and try again.");
	} else {
		if (Ti.App.Properties.getString('email') != '' && Ti.App.Properties.getString('email') != null) {
			authenticate(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'));
		}
	}
}

function renderLogin() {
	activityIndicator = Titanium.UI.createActivityIndicator({
		height:50,
		width:10,
		top : 180,
		style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
	});
	activityIndicator.show();
	win.add(activityIndicator);	
}

function authSuccess(email, password) {
	Ti.App.Properties.setString('email', email);
	Ti.App.Properties.setString('password', password);
	var newWin = Ti.UI.createWindow({
		url : 'home.js',
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
	activityIndicator.hide();	
}



