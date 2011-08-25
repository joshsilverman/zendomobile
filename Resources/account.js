Ti.UI.setBackgroundColor('#fff');
var win = Ti.UI.currentWindow;

Ti.include('networkMethods.js');

function renderNavBar() {
	var backButton = Ti.UI.createButton({ title : 'Done' });
	backButton.addEventListener('click', function(){ win.nav.close(win); });
	win.leftNavButton = backButton;	
}

function render() {
	var signOutButton = Ti.UI.createButton({
		title : "Sign Out",
		width : 100,
		height : 50,
		bottom : 50
	});
	
	signOutButton.addEventListener('click', function() {
		// alert("Sign out");
		// win.nav.close(win);
		// alert(win._parent.name);
		// Ti.App.tabGroup.close();
		signOut();
	});
	
	win.add(signOutButton);
}

renderNavBar();
render();
