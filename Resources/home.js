var win = Ti.UI.currentWindow;
Ti.include('networkMethods.js');

var currentOrientation = Ti.Gesture.orientation;

Ti.Gesture.addEventListener('orientationchange',function(e){
    currentOrientation = Ti.Gesture.orientation; 
    adjustViews();
});

var notificationsButton = Ti.UI.createButton({
	title : "Notifications",
	top : 100,
	height : 50, 
	width : 100
});

notificationsButton.addEventListener( 'click', function() {
	Ti.API.debug("Add notifications panel!");
	getLines(4043, "push");
});

var notesButton = Ti.UI.createImageView({
	image : 'images/folder.png',
	bottom : 100,
	height : 80
});

// var notesButton = Ti.UI.createButton({
	// title : "My notes",
	// bottom : 100,
	// height : 50, 
	// width : 100
// });

notesButton.addEventListener( 'click', function() {
	var newWin = Ti.UI.createWindow({
		url : 'folders.js',
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
});

function renderNavBar() {
	var signOutButton = Ti.UI.createButton({ title : 'Sign Out' });
	signOutButton.addEventListener('click', function(){ signOut(); });
	win.leftNavButton = signOutButton;	
}

function adjustViews() {
	if ( currentOrientation == 1 || currentOrientation == 2 ) {
		Ti.API.debug("Portrait mode");
		notesButton.top = 100;
		//notesButton.right = null;
		notificationsButton.bottom = 100;
		//notificationsButton.right = null;
	} 
	if ( currentOrientation == 3 || currentOrientation == 4 ) {
		Ti.API.debug("Landscape mode");
		notesButton.top = 0;
		//notesButton.left = 100;
		notificationsButton.bottom = 0;
		//notificationsButton.right = 100;
	}
}

renderNavBar();
win.add(notificationsButton);
win.add(notesButton);
