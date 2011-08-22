Ti.App.Properties.setBool('active', false);
Ti.App.Properties.setBool('launching', true);
Ti.App.Properties.setBool('foreground', false);
Ti.App.Properties.setBool('notification', false);

function render() {
	var container = Ti.UI.createWindow({
		navBarHidden : true,
		orientationModes : [
			Titanium.UI.PORTRAIT,
			Titanium.UI.UPSIDE_PORTRAIT,
			// Titanium.UI.LANDSCAPE_LEFT,
			// Titanium.UI.LANDSCAPE_RIGHT
		]
	});
	
	var newWin = Ti.UI.createWindow({
		url:"login.js",
		navBarHidden : true,
		orientationModes : [
			Titanium.UI.PORTRAIT,
			Titanium.UI.UPSIDE_PORTRAIT
		]
	});
	
	var nav = Titanium.UI.iPhone.createNavigationGroup({
	   window : newWin,
	   name : "start"
	});
	
	newWin.nav = nav;
	container.add(nav);
	container.open();
}

render();