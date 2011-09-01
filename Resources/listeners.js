setPaused = function() {
	Ti.App.Properties.setBool('foreground', false);
}

setResumed = function() {
	Ti.App.Properties.setBool('foreground', true);
}

setResume = function() {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert('Could not reach your account. Check your internet connection.');
	} else {
		reLogUser(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'), "normal");
	}		
}


// Ti.App.addEventListener('resumed', function(e) { 
	// Ti.App.Properties.setBool('foreground', true);
// });


// Ti.App.addEventListener('resume', function() { 
	// // alert("Resume");
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// alert('Could not reach your account. Check your internet connection.');
	// } else {
		// alert("Relogging from normal resume");
		// // checkLoggedIn("normal"); 
		// reLogUser(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'), "normal");
	// }	
// });

// Ti.App.addEventListener('pause', function(e) { 
	// Ti.App.Properties.setBool('foreground', false);
// });
