var win = Ti.UI.currentWindow;

// Ti.include('networkMethods.js');
Ti.include('commonMethods.js');

function initialize() {
	renderFolders();
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
	refreshButton.addEventListener('click', function() {
		updateEggs("refresh");
	});
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
		// if (Titanium.Network.remoteNotificationsEnabled == false) {
			// alert("Enable push notifications for StudyEgg if you want to be notified when you have new cards to review.");
		// }
		retrieveAllNotifications();
	});	
	win.rightNavButton = refreshButton;
	win.leftNavButton = accountButton;
	win.titleControl = logo;
}

function renderFolders(rows) {
	var toolbar = Ti.UI.createToolbar({
		top : 0		
	});
	eggList = Titanium.UI.createTableView({
		rowHeight : 80,
		data : rows,
		backgroundColor : '#dfdacd'
	});
	eggList.addEventListener('click', function(e) {
		var newWin = Ti.UI.createWindow({
			url : "notes.js",
			selection : e.row.id,
			barColor : '#0066b2',
			_parent: Titanium.UI.currentWindow,
			// exitOnClose: true
			orientationModes : [
				Titanium.UI.PORTRAIT
			]
		});
		Titanium.UI.currentTab.open(newWin, {animated:true});
	});
	win.add(eggList);
	updateEggs();
}

function updateEggs(context) {
	rows = [];	
	if (Ti.App.data != null && context != "refresh") {
		for ( i in Ti.App.data ) {
			var pushFlag = false;
			for ( j in Ti.App.data[i].tag.documents) {			
				if (pushFlag == true ) {
					break;
				}
				if (Ti.App.data[i].tag.documents[j].userships[0].push_enabled == true ){
					pushFlag = true;
				}
			}
			rows.push(createFolderRow(Ti.App.data[i].tag.name, Ti.App.data[i].tag.id, false, pushFlag));
		}
		eggList.setData(rows);
	} else {	
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
		xhr.open("GET", serverURL + "/tags/get_tags_json");
		xhr.setRequestHeader('Content-Type', 'text/json');
		xhr.onload = function() {
			foldersData = eval(this.responseText);
			if (foldersData != null) {
				for (i in foldersData) {
					var pushFlag = false;
					for ( j in foldersData[i].tag.documents) {
						if (pushFlag == true ) {
							break;
						}
						if (foldersData[i].tag.documents[j].userships[0].push_enabled == true ){
							pushFlag = true;
						}
					}
					rows.push(createFolderRow(foldersData[i].tag.name, foldersData[i].tag.id, false, pushFlag));
				}
			}
			eggList.setData(rows);
		};
		xhr.send();	
	}		
}

win.addEventListener('focus', function() {	
	updateLogo();
	if (Ti.App.myEggsDirty == true) {
		updateEggs();
		Ti.App.myEggsDirty = false;
	}
});

initialize();