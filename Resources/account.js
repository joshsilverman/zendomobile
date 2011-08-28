Ti.UI.setBackgroundColor('#fff');
var acctWin = Ti.UI.currentWindow;

Ti.include('networkMethods.js');

function renderNavBar() {


}

function render() {
	
	var emailLabel = Ti.UI.createLabel({
		text : Ti.App.Properties.getString('email'), 
		top : 10, 
		textAlign : 'center'
	})
	
	var backButton = Ti.UI.createButton({ 
		title : 'Done',
		bottom : 10,
		width : 100, 
		height : 50
	});
	
	backButton.addEventListener('click', function(){ acctWin.close(); });
	// acctWin.leftNavButton = backButton;
	
	var signOutButton = Ti.UI.createButton({
		title : "Sign Out",
		width : 100,
		height : 50,
		bottom : 80
	});
	
	signOutButton.addEventListener('click', function() { signOut(); });
	
	acctWin.add(backButton);
	acctWin.add(signOutButton);
	acctWin.add(emailLabel);
}
renderNavBar();
render();
