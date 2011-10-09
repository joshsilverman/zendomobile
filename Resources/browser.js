var win = Ti.UI.currentWindow;
Ti.App.base_window = win;
Ti.UI.setBackgroundColor('#dfdacd');
Ti.include('commonMethods.js');
updateCache();

tabGroup = Titanium.UI.createTabGroup({
	backgroundColor : '#dfdacd',
	barColor : '#dfdacd'
});

Ti.App.tabGroup = tabGroup;

setPaused = function() {
	Ti.App.Properties.setBool('foreground', false);
}

setResumed = function() {
	function setForeground() {
		Ti.App.Properties.setBool('foreground', true);
	}
	setTimeout(setForeground, 2000);	
	// Ti.App.Properties.setBool('foreground', true);
}

setResume = function() {
	Ti.App.fireEvent('updateNavBar'); 
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert('Could not reach your account. Check your internet connection.');
	}	
}

Ti.App.addEventListener('resume', setResume); 
Ti.App.addEventListener('resumed', setResumed);
Ti.App.addEventListener('pause', setPaused);

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
    title : "My Eggs",
    window : myEggsWindow
});


var recentWindow = Titanium.UI.createWindow({  
    backgroundColor : '#dfdacd',
    barColor : '#0066b2',
    url : 'recentDocuments.js',
   	orientationModes : [
		Titanium.UI.PORTRAIT
	]
});
var recentTab = Titanium.UI.createTab({  
    icon:'images/clock@2x.png',
    title : "Recent",
    window:recentWindow
});


var interestingWindow = Titanium.UI.createWindow({  
    backgroundColor : '#dfdacd',
    barColor : '#0066b2',
    url : 'interestingEggs.js',
    orientationModes : [
		Titanium.UI.PORTRAIT
	]
});
var interestingTab = Titanium.UI.createTab({  
    icon:'images/star@2x.png',
    title : "Popular",
    window:interestingWindow
});


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


var searchWindow = Titanium.UI.createWindow({  
    url : 'search.js',
    backgroundColor : '#dfdacd',
    barColor : '#0066b2',
	orientationModes : [
		Titanium.UI.PORTRAIT
	]
});
var searchTab = Titanium.UI.createTab({  
    icon:'images/search@2x.png',
    title : "Search",
    window:searchWindow
});


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

Ti.App.myEggsDirty = true;
Ti.App.documentsDirty = true;
Ti.App.popularDirty = true;
Ti.App.searchDirty = true;

tabGroup.open();

if ( Ti.App.Properties.getBool('notification') == true ) {
	Ti.App.Properties.setBool('notification', false);
	retrieveAllNotifications();
}

function registerForPush() {
	Titanium.Network.registerForPushNotifications({
		types : [
			Titanium.Network.NOTIFICATION_TYPE_BADGE,
			Titanium.Network.NOTIFICATION_TYPE_ALERT,
			Titanium.Network.NOTIFICATION_TYPE_SOUND
		],
		success : function(e) {
			registerDevice(e.deviceToken);
		},
		error : function(e) {
			// alert("Error during registration: " + e.error);
		},
		callback : function(e) {	
			Titanium.UI.iPhone.appBadge = e.data.badge;	
			if (Ti.App.Properties.getBool('foreground') == true) {
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
				retrieveAllNotifications();
			}
			Ti.App.fireEvent('updateNavBar');
		}
	});	
}

function registerDevice(token) {
	xhr = Ti.Network.createHTTPClient();
	xhr.open("POST", serverURL + "/users/add_device/" + token);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Cookie', Ti.App.Properties.getString('cookie'));
	xhr.send();
}

registerForPush();


// function setForeground() {
	// Ti.App.Properties.setBool('foreground', true);
// }
// setTimeout(setForeground, 2000);

// function memCheck() {
	// Ti.API.debug('Current memory: ' + Titanium.Platform.availableMemory);
// }
// setInterval(memCheck, 1000);

