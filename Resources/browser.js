var win = Ti.UI.currentWindow;
Ti.UI.setBackgroundColor('#dfdacd');
Ti.include('commonMethods.js');
updateCache();

tabGroup = Titanium.UI.createTabGroup({
	backgroundColor : '#dfdacd',
	barColor : '#dfdacd'
});

Ti.App.tabGroup = tabGroup;

var myEggsWindow = Titanium.UI.createWindow({  
    backgroundColor:'#dfdacd',
    barColor : '#0066b2',
    animated : true,
    url : 'folders.js',
	orientationModes : [
		Titanium.UI.PORTRAIT
	]
});
var myEggsTab = Titanium.UI.createTab({  
    icon : 'images/eggicon@2x.png',
    title : 'My Eggs',
    window : myEggsWindow
});
// var myEggsLabel = Titanium.UI.createLabel({
	// color:'#999',
	// text:'Loading your eggs...',
	// font:{fontSize:20,fontFamily:'Helvetica Neue'},
	// textAlign:'center',
	// width:'auto'
// });
// myEggsWindow.add(myEggsLabel);

var recentWindow = Titanium.UI.createWindow({  
    title:'Recent',
    backgroundColor : '#dfdacd',
    barColor : '#0066b2',
    url : 'recentDocuments.js',
   	orientationModes : [
		Titanium.UI.PORTRAIT
	]
});
var recentTab = Titanium.UI.createTab({  
    icon:'images/clock@2x.png',
    title:'Recent',
    window:recentWindow
});
// var recentLabel = Titanium.UI.createLabel({
	// color:'#999',
	// text:'Loading recent docs...',
	// font:{fontSize:20,fontFamily:'Helvetica Neue'},
	// textAlign:'center',
	// width:'auto'
// });
// recentWindow.add(recentLabel);

var interestingWindow = Titanium.UI.createWindow({  
    title:'Interesting',
    backgroundColor : '#dfdacd',
    barColor : '#0066b2',
    url : 'interestingEggs.js',
    orientationModes : [
		Titanium.UI.PORTRAIT
	]
});
var interestingTab = Titanium.UI.createTab({  
    icon:'images/star@2x.png',
    title:'Interesting',
    window:interestingWindow
});
// var interestingLabel = Titanium.UI.createLabel({
	// color : '#999',
	// text : 'Loading popular docs...',
	// font : {fontSize : 20, fontFamily : 'Helvetica Neue'},
	// textAlign : 'center',
	// width : 'auto'
// });
// interestingWindow.add(interestingLabel);

// var categoriesWindow = Titanium.UI.createWindow({  
    // title:'Categories',
    // backgroundColor : '#dfdacd',
    // barColor : '#0066b2'
// });
// var categoriesTab = Titanium.UI.createTab({  
    // icon:'images/KS_nav_ui.png',
    // title:'Categories',
    // window:categoriesWindow
// });
// var categoriesLabel = Titanium.UI.createLabel({
	// color:'#999',
	// text:'Loading categories...',
	// font:{fontSize:20,fontFamily:'Helvetica Neue'},
	// textAlign:'center',
	// width:'auto'
// });
// categoriesWindow.add(categoriesLabel);

var searchWindow = Titanium.UI.createWindow({  
    title:'Search',
    url : 'search.js',
    backgroundColor : '#dfdacd',
    barColor : '#0066b2',
	orientationModes : [
		Titanium.UI.PORTRAIT
	]
});
var searchTab = Titanium.UI.createTab({  
    icon:'images/search@2x.png',
    title:'Search',
    window:searchWindow
});
// var searchLabel = Titanium.UI.createLabel({
	// color:'#999',
	// text:'Search',
	// font:{fontSize:20,fontFamily:'Helvetica Neue'},
	// textAlign:'center',
	// width:'auto'
// });
// searchWindow.add(searchLabel);

tabGroup.addTab(myEggsTab);  
tabGroup.addTab(recentTab);  
tabGroup.addTab(interestingTab);  
// tabGroup.addTab(categoriesTab);  
tabGroup.addTab(searchTab);  

if (Ti.App.Properties.getBool('educated') != true) {
	tabGroup.setActiveTab(2);
} else {
	tabGroup.setActiveTab(1);	
}
win.add(tabGroup);
tabGroup.open();

if ( Ti.App.Properties.getBool('notification') == true ) {
	Ti.App.Properties.setBool('notification', false);
	retrieveAllNotifications();
}


//Listeners
Ti.App.addEventListener('resume', function() { 
	// alert("Resume");
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert('Could not reach your account. Check your internet connection.');
	} else {
		// checkLoggedIn("normal"); 
		reLogUser(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'), "normal");
	}	
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
