var win = Ti.UI.currentWindow;

Ti.include('commonMethods.js');

function initialize() {
	renderRecent();
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
		updateRecent();
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
		if (Titanium.Network.remoteNotificationsEnabled == false) {
			alert("Enable push notifications for StudyEgg if you want to be notified when you have new cards to review.");
		}
		retrieveAllNotifications();
	});	
	win.rightNavButton = refreshButton;
	win.leftNavButton = accountButton;
	win.titleControl = logo;
}

Ti.App.addEventListener('updateNavBar', function() {
	// alert(Titanium.UI.iPhone.appBadge);
	updateLogo();
});

function renderRecent(){
	var toolbar = Ti.UI.createToolbar({
		top : 0
	});
	recentList = Titanium.UI.createTableView({
		rowHeight : 60,
		data : [],
		backgroundColor : '#dfdacd',
	});
	recentList.addEventListener('click', function(e){
		if (e.source.id == "label") {
			var reviewAlert = Ti.UI.createAlertDialog({
			    title : 'Select a review mode!',
			    message : "Choose whether to show only cards you need to review or all cards.",
			    buttonNames : ["All", "Adaptive"],
			    cancel : 0
			});
			reviewAlert.addEventListener('click', function(f) {
				if (f.index == 1) { 
					createReviewSession({"method" : "review_adaptive_cards", "docId" : e.row.id, "listView" : recentList, "activityIndicator" : activityIndicator});
				} else if (f.index == 0) {
					createReviewSession({"method" : "review_all_cards", "docId" : e.row.id, "listView" : recentList, "activityIndicator" : activityIndicator});
				}			
			});
			reviewAlert.show();	
		} else if (e.source.id == "doc") {
			if ( e.row.children[0].push == true ) {
				var push = false;
		    	var image = 'images/document-feed-gray-4@2x.png';
			} else {
				var push = true;
				var image = 'images/document-feed@2x.png';
			}
			e.row.children[0].push = push;
		 	e.row.children[0].image = image;		 	
			if (e.source.push == 0) {
				enableNotifications(e.row.id, false, e, "recent");
			} else {
				enableNotifications(e.row.id, true, e, "recent");
			}
		}	
	});
	win.add(recentList);
	updateRecent();
}

function updateRecent() {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not complete your request. Check your connection and try again.");	
	} else {	
		renderLoading(recentList, win);
		notesRows = [];
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		xhr.open("GET", serverURL + "/tags/get_recent_json");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Cookie', Ti.App.Properties.getString('cookie'));
		xhr.onerror = function() {
			loadingComplete(recentList, win);
			alert("Could not complete your request. Please try again later.");
		};
		xhr.onload = function() {
			recentData = eval(this.responseText);
			var data = [];
			for ( i in recentData ) { 
				data.push(createNoteRow(recentData[i].document.name, recentData[i].document.id, recentData[i].document.tag_id, recentData[i].document.userships[0].push_enabled));
			}
			recentList.setData(data);
			loadingComplete(recentList, win);
		};
		xhr.send();
	}
}

win.addEventListener('focus', function() {
	if ( Ti.App.recentDirty == true ) {
		updateRecent();
		Ti.App.recentDirty = false;
	}
	updateLogo();
});

initialize();
