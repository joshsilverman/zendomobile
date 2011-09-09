// Ti.UI.setBackgroundColor('#fff');
var acctWin = Ti.UI.currentWindow;

Ti.include('authentication.js');

function initialize() {
	renderAccount();
}

function renderAccount() {
	
	var accountLabel = Ti.UI.createLabel({
		text : "Account email:",
		top : 140, 
		textAlign : 'center',
		font:{fontSize:20,fontFamily:'Arial', fontWeight : 'bold'}
	})
		
	var emailLabel = Ti.UI.createLabel({
		text : Ti.App.Properties.getString('email'), 
		top : 185, 
		textAlign : 'center',
		font:{fontSize:16,fontFamily:'Arial'}
	})
	
	var backButton = Ti.UI.createButton({ 
		title : 'Done',
		bottom : 40,
		right : 45,
		width : 100, 
		height : 45
	});
	
	backButton.addEventListener('click', function(){ acctWin.close(); });
	
	var signOutButton = Ti.UI.createButton({
		title : "Sign Out",
		width : 100,
		left : 45,
		height : 45,
		bottom : 40
	});
	
	signOutButton.addEventListener('click', function() { 
		signOut(); 
		// acctWin.close();
	});
	
	acctWin.add(backButton);
	acctWin.add(signOutButton);
	acctWin.add(emailLabel);
	acctWin.add(accountLabel);
}

initialize();
