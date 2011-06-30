if (Ti.App.Properties.getString('email') != null && Ti.App.Properties.getString('email') != '') {
	authenticate(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'));
}

function authenticate(email, password) {
	renderLogin();
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				authSuccess(email, password);
			} else {
				activityIndicator.hide();
				loadingLabel.hide();
				alert("Could not connect to your account!");
			}
		}
	}	
	// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
	var params = {
		'user[email]' : email,
		'user[password]' : password
	}
	xhr.open("POST", "http://localhost:3000/users/sign_in");
	xhr.send(params);
}

function renderLogin() {
	// loadingLabel = Ti.UI.createLabel({
		// text : 'Connecting to your account...',
		// textAlign : 'center'
	// });
	activityIndicator = Titanium.UI.createActivityIndicator({
		height:50,
		width:10,
		top : 190,
		style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
	});
	activityIndicator.show();
	win.add(activityIndicator);	
	// win.add(loadingLabel);	
}

function authSuccess(email, password) {
	Ti.App.Properties.setString('email', email);
	Ti.App.Properties.setString('password', password);
	var newWin = Ti.UI.createWindow({
		url : 'folders.js',
		navBarHidden : true,
		nav : nav
	});
	nav.open(newWin);	
	activityIndicator.hide();
	// loadingLabel.hide();
}



