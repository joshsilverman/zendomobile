// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#fff');
// var win = Ti.UI.currentWindow;
// win.name = "Browser";
// Ti.App.base_window = Ti.UI.currentWindow;
// Ti.App.current_win = win;
// create tab group
Ti.include('networkMethods.js');
tabGroup = Titanium.UI.createTabGroup({
	backgroundColor : '#dfdacd',
	// navBarHidden : false
	barColor : '#dfdacd'
});
Ti.App.tabGroup = tabGroup;
// Ti.App.eggData = null;

// data = getRecentDocs();

// 
// 

// function renderNavBar() {
	// // backgroundImage
	// // var signOutButton = Ti.UI.createButton({ title : 'Sign Out' });
	// // signOutButton.addEventListener('click', function() {
		// // signOut();
		// // // win.nav.close(win);
	// // });
	// // var accountButton = Ti.UI.createButton({ title : 'Account' });
	// // accountButton.addEventListener('click', function(){ 
		// // var newWin = Ti.UI.createWindow({
			// // url : 'account.js',
			// // navBarHidden : false,
			// // barColor : '#000',
			// // nav : win.nav,
			// // _parent: Titanium.UI.currentWindow,
			// // orientationModes : [
				// // Titanium.UI.PORTRAIT,
				// // Titanium.UI.UPSIDE_PORTRAIT,
				// // // Titanium.UI.LANDSCAPE_LEFT,
				// // // Titanium.UI.LANDSCAPE_RIGHT
			// // ]
		// // });
		// // win.nav.open(newWin);	
	// // });
	// // win.leftNavButton = signOutButton;	
// }

// renderNavBar();

var accountButton = Ti.UI.createButton({ title : 'Account' });

accountButton.addEventListener('click', function() {
	newWin = Ti.UI.createWindow({
		backgroundColor : '#dfdacd',
		navBarHidden : false,
		// modal : true,
		barColor : '#0066b2',
		// _parent : win,
    	url : 'account.js',
    	// nav : win.nav
	});
	newWin.open();
});
	
logo = Ti.UI.createImageView({
	// image : 'images/eggLogo.png', 
	image : 'images/logo-indicator.png', 
	height : 35,
	width : 80
	// left : cardLeftPad
});

logo.addEventListener('click', function() {
	// if (Titanium.Network.remoteNotificationsEnabled == false) {
		// alert("Enable push notifications for StudyEgg if you want to be notified when you have new cards to review.");
	// }
	retrieveAllNotifications();
});




var myEggsWindow = Titanium.UI.createWindow({  
    // title:'My Eggs',
    backgroundColor:'#dfdacd',
    leftNavButton : accountButton,
    titleControl : logo,
    barColor : '#0066b2',
    animated : true,
    // barColor : '#218dd2',
    url : 'folders.js',
    // nav : win.nav
    // navBarHidden : true
});

var myEggsTab = Titanium.UI.createTab({  
    icon : 'images/eggicon@2x.png',
    title : 'My Eggs',
    window : myEggsWindow
});

var myEggsLabel = Titanium.UI.createLabel({
	color:'#999',
	text:'Loading your eggs...',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

myEggsWindow.add(myEggsLabel);

var recentWindow = Titanium.UI.createWindow({  
    title:'Recent',
    backgroundColor : '#dfdacd',
    titleControl : logo,
    leftNavButton : accountButton,
    barColor : '#0066b2',
    url : 'recentDocuments.js',
    // nav : win.nav
    // navBarHidden : true
});

var recentTab = Titanium.UI.createTab({  
    icon:'images/clock@2x.png',
    title:'Recent',
    window:recentWindow
});

var recentLabel = Titanium.UI.createLabel({
	color:'#999',
	text:'Loading recent docs...',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

recentWindow.add(recentLabel);




var interestingWindow = Titanium.UI.createWindow({  
    title:'Interesting',
    backgroundColor : '#dfdacd',
    barColor : '#0066b2',
    titleControl : logo,
    leftNavButton : accountButton,
    url : 'interestingEggs.js',
    // nav : win.nav
    // navBarHidden : true
});

var interestingTab = Titanium.UI.createTab({  
    icon:'images/star@2x.png',
    title:'Interesting',
    window:interestingWindow
});

var interestingLabel = Titanium.UI.createLabel({
	color : '#999',
	text : 'Loading interesting...',
	font : {fontSize : 20, fontFamily : 'Helvetica Neue'},
	textAlign : 'center',
	width : 'auto'
});

interestingWindow.add(interestingLabel);




var categoriesWindow = Titanium.UI.createWindow({  
    title:'Categories',
    titleControl : logo,
    backgroundColor : '#dfdacd',
    barColor : '#0066b2',
    leftNavButton : accountButton,
    // nav : win.nav
    // navBarHidden : true
});
var categoriesTab = Titanium.UI.createTab({  
    icon:'images/KS_nav_ui.png',
    title:'Categories',
    window:categoriesWindow
});

var categoriesLabel = Titanium.UI.createLabel({
	color:'#999',
	text:'Categories',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

categoriesWindow.add(categoriesLabel);





var searchWindow = Titanium.UI.createWindow({  
    title:'Search',
    titleControl : logo,
    url : 'search.js',
    backgroundColor : '#dfdacd',
    barColor : '#0066b2',
    leftNavButton : accountButton,
    // nav : win.nav
    // navBarHidden : true
});

var searchTab = Titanium.UI.createTab({  
    icon:'images/search@2x.png',
    title:'Search',
    window:searchWindow
});

var searchLabel = Titanium.UI.createLabel({
	color:'#999',
	text:'Search',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

searchWindow.add(searchLabel);

tabGroup.addTab(myEggsTab);  
tabGroup.addTab(recentTab);  
tabGroup.addTab(interestingTab);  
// tabGroup.addTab(categoriesTab);  
tabGroup.addTab(searchTab);  

// win.add(tabGroup);
// alert(tabGroup.backgroundColor);
// tabGroup.backgroundColor = "#fff";
// tabGroup.
// alert(tabGroup.backgroundColor);

if (Ti.App.Properties.getBool('educated') != true) {
	tabGroup.setActiveTab(2);
} else {
	tabGroup.setActiveTab(1);	
}



tabGroup.open();
// win.open(tabGroup);

if ( Ti.App.Properties.getBool('notification') == true ) {
	Ti.App.Properties.setBool('notification', false);
	retrieveAllNotifications();
}

Ti.App.addEventListener('resume', function() { 
	alert("Resume");
	// var check = function() {
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// alert('Could not reach your account. Check your internet connection.');
	// } else {
		// checkLoggedIn("normal"); 
		reLogUser(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'), "normal");
	// }	
// };
    // setTimeout(check, 2000);
});

Ti.App.addEventListener('resumed', function(e) { 
	Ti.App.Properties.setBool('foreground', true);
});

Ti.App.addEventListener('pause', function(e) { 
	Ti.App.Properties.setBool('foreground', false);
});

function registerForPush() {
	Titanium.Network.registerForPushNotifications({
		types : [
			Titanium.Network.NOTIFICATION_TYPE_BADGE,
			Titanium.Network.NOTIFICATION_TYPE_ALERT,
			Titanium.Network.NOTIFICATION_TYPE_SOUND
		],
		success : function(e) {
			Ti.App.Properties.setString("token", e.deviceToken);
		},
		error : function(e) {
			alert("Error during registration: " + e.error);
		},
		callback : function(e) {
			// Ti.App.Properties.setBool('notification', true);
			if (Ti.App.Properties.getBool('foreground') == true) {
				alert("Callback from foreground!");
				var reviewAlert = Ti.UI.createAlertDialog({
				    title : 'You have new cards to review!',
				    message : "Go to them now?",
				    buttonNames : ["Later", "Review"],
				    cancel : 0
				});
				reviewAlert.addEventListener('click', function(f) {
					if (f.index == 1) { 
						retrieveAllNotifications(); 
					};
				});
				reviewAlert.show();		
			} else {
				alert("Callback from background!");
				reLogUser(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'), "push");
			}
		}
	});	
}

registerForPush();

// var pushReminderAlert = Ti.UI.createWindow({
	// height : 100, 
	// width : 100, 
	// top : 50
// })

if (Ti.App.Properties.getBool('educated') != true) {
	var pushReminderAlert = Ti.UI.createAlertDialog({
	    title : 'Reminder!',
	    message : "To enable push review, tap on the docs icon.",
	    buttonNames : ["Don't show again", "Okay"]
	    // cancel : 0
	});
	
	pushReminderAlert.addEventListener('click', function(f) {
		if (f.index == 0) { 
			Ti.App.Properties.setBool('educated', true);
		}
	});
	pushReminderAlert.show();	
}

// tabGroup.open(pushReminderAlert);	

