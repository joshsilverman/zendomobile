// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#fff');
var win = Ti.UI.currentWindow;
win.name = "Browser";
Ti.App.base_window = Ti.UI.currentWindow;
Ti.App.current_win = win;
// create tab group
Ti.include('networkMethods.js');
tabGroup = Titanium.UI.createTabGroup({
	backgroundColor : "#fff",
	backgroundImage : 'images/folder.png'
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
		backgroundColor:'#fff',
		modal : true,
		// barColor : '#0066b2',
		barColor : '#000',
		_parent : win,
    	url : 'account.js',
    	nav : win.nav
	});
	newWin.open();
	// win.nav.open(newWin);
	// tabGroup.visible = true;
});
	
logo = Ti.UI.createImageView({
	image : 'images/eggLogo.png', 
	height : 45,
	width : 100
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
    // barColor : '#218dd2',
    url : 'folders.js',
    nav : win.nav
});

var myEggsTab = Titanium.UI.createTab({  
    icon : 'images/egg@2x.png',
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
    backgroundColor:'#fff',
    leftNavButton : accountButton,
    barColor : '#000',
    url : 'recentDocuments.js',
    nav : win.nav
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
    backgroundColor:'#fff',
    barColor : '#000',
    leftNavButton : accountButton,
    url : 'interestingEggs.js',
    nav : win.nav
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
    backgroundColor:'#fff',
    barColor : '#000',
    leftNavButton : accountButton,
    nav : win.nav
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
    backgroundColor:'#fff',
    barColor : '#000',
    leftNavButton : accountButton,
    nav : win.nav
});

var searchTab = Titanium.UI.createTab({  
    icon:'images/KS_nav_ui.png',
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
// tabGroup.addTab(searchTab);  

// win.add(tabGroup);
alert(tabGroup.backgroundColor);
tabGroup.backgroundColor = "#fff";
tabGroup.
alert(tabGroup.backgroundColor);
tabGroup.open();
// win.open(tabGroup);

if ( Ti.App.Properties.getBool('notification') == true ) {
	Ti.App.Properties.setBool('notification', false);
	retrieveAllNotifications();
}
