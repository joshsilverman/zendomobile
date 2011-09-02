var win = Ti.UI.currentWindow;

// Ti.include('networkMethods.js');
Ti.include('commonMethods.js');

function initialize() {
	renderPopular();
	renderNavBar();
}

function renderNavBar() {
	var accountButton = Ti.UI.createButton({ title : 'Account' });
	accountButton.addEventListener('click', function() {
		newWin = Ti.UI.createWindow({
			backgroundColor : '#dfdacd',
			backgroundImage : 'images/splash@2x.png',
			navBarHidden : false,
			barColor : '#0066b2',
	    	url : 'account.js',
		});
		newWin.open();
	});	
	var refreshButton = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	})
	if (Titanium.UI.iPhone.appBadge == 0) {
		var image = 'images/logo@2x.png'
	} else {
		var image = 'images/logo-indicator@2x.png'
	}
	var logo = Ti.UI.createImageView({
		image : image, 
		height : 35,
		width : 80
	});
	logo.addEventListener('click', function() {
		if (Titanium.Network.remoteNotificationsEnabled == false) {
			alert("Enable push notifications for StudyEgg if you want to be notified when you have new cards to review.");
		}
		retrieveAllNotifications();
	});	
	win.leftNavButton = accountButton;
	win.titleControl = logo;
}

function renderPopular(){
	var toolbar = Ti.UI.createToolbar({
		top : 0
	});
	popularList = Titanium.UI.createTableView({
		rowHeight : 60,
		data : [],
		backgroundColor : '#dfdacd'
	});
	popularList.addEventListener('click', function(e){
		if (e.source.id == "add") {
			e.row.children[2].image = 'images/download-faded@2x.png';
			e.row.children[2].owned = true;
			if (Ti.App.Properties.getBool('download_educated') != true) {
				addEgg(e.row.id, e, "popular", false);
			} else {
				addEgg(e.row.id, e, "popular");
			}
		} 
	});
	win.add(popularList);
}

function updatePopular() {
	notesRows = [];
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(10000);
	xhr.open("GET", serverURL + "/tags/get_popular_json");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		popularData = eval(this.responseText);
		var data = [];
		for (i in popularData) {
			data.push(createAddableEggRow(popularData[i][1], popularData[i][0], popularData[i][2]));
		}
		popularList.setData(data);
	};
	xhr.send();	
}

win.addEventListener('focus', function() {
	updateLogo();
	if (Ti.App.popularDirty == true) {
		updatePopular();
		Ti.App.popularDirty = false;
	}
});

initialize();
