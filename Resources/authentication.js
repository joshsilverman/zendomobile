Ti.include('network.js');
// Ti.include('listeners.js');
	
function authenticate(email, password, context) {
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(10000);
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				Ti.App.cookie = xhr.getResponseHeader("Set-Cookie");
				authSuccess(email, password);
			} else {
				if (context != "start") {
					alert("Invalid email/password combination.");	
				} else {
					var win = Ti.UI.createWindow({
						url:"login.js",
						navBarHidden : true,
						backgroundColor : '#dfdacd',
						orientationModes : [
							Titanium.UI.PORTRAIT
						]
					});
					win.open();	
				}
			}
		}
	};
	var params = {
		'user[email]' : email,
		// 'user[password]' : Titanium.Utils.md5HexDigest(password)
		'user[password]' : password
	};
	xhr.open("POST", serverURL + "/users/sign_in");
	xhr.setRequestHeader('Cookie', Ti.App.cookie);
	xhr.send(params);
}

function signOut() {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not complete your request. Check your connection and try again.");
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.open("GET", serverURL + "/users/sign_out");
		xhr.setRequestHeader('Content-Type', 'text/html');
		xhr.setRequestHeader('Cookie', Ti.App.cookie);
		xhr.send();
		
		Ti.App.Properties.removeProperty('email');
		Ti.App.Properties.removeProperty('password');
		Ti.App.data = null;
		// alert("signing out!");
		// Ti.App.removeEventListener('resume', setResume);
		// Ti.App.removeEventListener('resumed', setResumed);
		// Ti.App.removeEventListener('pause', setPaused);	
		Ti.App.Properties.setBool('active', false);
		Titanium.UI.orientation = Titanium.UI.PORTRAIT;
		var win = Ti.UI.createWindow({
			url:"login.js",
			navBarHidden : true,
			backgroundColor : '#dfdacd',
			orientationModes : [
				Titanium.UI.PORTRAIT,
			]
		});
		// Ti.App.base_window.close();
		win.open();	
		Ti.App.tabGroup.close();
	}
}

function signUp(email, password) {
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(10000);
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {		
				Ti.App.Properties.setString('email', email);
				Ti.App.Properties.setString('password', password);
				Ti.App.Properties.setBool('educated', false);	
				Ti.App.Properties.setBool('download_educated', false);		
				authSuccess(email, password);
				emailField.value = "";
				passwordField.value = "";
				confirmPasswordField.value = "";
				Ti.App.myEggsDirty = true;
				Ti.App.documentsDirty = true;
				Ti.App.searchDirty = true;
				Ti.App.popularDirty = true;
			} else {
				alert("Could not create your account... Did you enter your email address correctly?");
			}
		}
	};
	var params = {
		'user[email]' : email,
		'user[password]' : password
	};
	xhr.open("POST", serverURL + "/users");
	xhr.setRequestHeader('Cookie', Ti.App.cookie);
	xhr.send(params);	
}

function authSuccess(email, password) {
	// activityIndicator.hide();
	Ti.App.Properties.setString('email', email);
	Ti.App.Properties.setString('password', password);
	registerDevice(Ti.App.Properties.getString("token"));
	// activityIndicator.hide();
	var new_win = Ti.UI.createWindow({
		url : "browser.js",
		backgroundColor : '#dfdacd',
		navBarHidden : true,
		_parent : Titanium.UI.currentWindow,
		_context : "normal",
		orientationModes : [
			Titanium.UI.PORTRAIT
		]
	});
	new_win.open();
}

function registerDevice(token) {
	xhr = Ti.Network.createHTTPClient();
	xhr.open("POST", serverURL + "/users/add_device/" + token);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Cookie', Ti.App.cookie);
	// xhr.onload = function() {
		// Ti.API.debug('Added device with token' + token);
	// };
	xhr.send();
}


