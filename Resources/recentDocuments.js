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
	// var refreshButton = Titanium.UI.createButton({
	// 	systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	// })
	// refreshButton.addEventListener('click', function() {
	// 	updateRecent();
	// });	
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
	// win.rightNavButton = refreshButton;
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

	pulling = false;
	reloading = false;
	arrow = Ti.UI.createView({
		backgroundImage:"images/whiteArrow.png",
		width:23,
		height:60,
		bottom:10,
		left:20
	});
	 
	statusLabel = Ti.UI.createLabel({
		text:"Pull to reload",
		left:55,
		width:200,
		bottom:30,
		height:"auto",
		color:"#576c89",
		textAlign:"center",
		font:{fontSize:13,fontWeight:"bold"},
		shadowColor:"#999",
		shadowOffset:{x:0,y:1}
	});
	 
	actInd = Titanium.UI.createActivityIndicator({
		left:20,
		bottom:13,
		width:30,
		height:30
	});
	tableHeader = Ti.UI.createView({
		backgroundColor:"#000",
		width:320,
		height:60
	});
	border = Ti.UI.createView({
		backgroundColor:"#576c89",
		height:2,
		bottom:0
	});
	tableHeader.add(actInd);
	tableHeader.add(statusLabel);
	tableHeader.add(arrow);
	tableHeader.add(border);

	recentList.headerPullView = tableHeader;
	
	recentList.addEventListener('scroll',function(e) {
		var offset = e.contentOffset.y;
		if (offset <= -65.0 && !pulling) {
			var t = Ti.UI.create2DMatrix();
			t = t.rotate(-180);
			pulling = true;
			arrow.animate({transform:t,duration:180});
			statusLabel.text = "Release to refresh...";
		}
		else if (pulling && offset > -65.0 && offset < 0) {
			pulling = false;
			var t = Ti.UI.create2DMatrix();
			arrow.animate({transform:t,duration:180});
			statusLabel.text = "Pull down to refresh...";
		}
	});
	recentList.addEventListener('scrollEnd',function(e) {
		if (pulling && !reloading && e.contentOffset.y <= -65.0) {
			reloading = true;
			pulling = false;
			arrow.hide();
			actInd.show();
			statusLabel.text = "Reloading...";
			recentList.setContentInsets({top:60},{animated:true});
			arrow.transform=Ti.UI.create2DMatrix();
			updateRecent();
		}
	});

	scroll = Titanium.UI.createScrollableView({
		views : [],
		showPagingControl : false,
		clipViews : true,
		left : 0
	});	

	scroll.addEventListener('scroll', function(e) {
		if (e.currentPage == 0) {
			Ti.App.tabGroup.setActiveTab(0);
		} else if (e.currentPage == 2) {
			Ti.App.tabGroup.setActiveTab(2);
		}
		scroll.scrollToView(1);
	});

	scroll.addView(Ti.UI.createView());
	scroll.addView(recentList);
	scroll.addView(Ti.UI.createView());
	scroll.scrollToView(1);

	win.add(scroll);

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
			recentList.setContentInsets({top:0},{animated:true});
			reloading = false;
			// lastUpdatedLabel.text = "Last Updated: "+formatDate();
			statusLabel.text = "Pull down to refresh...";
			actInd.hide();
			arrow.show();			
		};
		xhr.onload = function() {
			recentData = eval(this.responseText);
			var data = [];
			for ( i in recentData ) { 
				data.push(createNoteRow(recentData[i].document.name, recentData[i].document.id, recentData[i].document.tag_id, recentData[i].document.userships[0].push_enabled));
			}
			recentList.setData(data);
			loadingComplete(recentList, win);
			recentList.setContentInsets({top:0},{animated:true});
			reloading = false;
			// lastUpdatedLabel.text = "Last Updated: "+formatDate();
			statusLabel.text = "Pull down to refresh...";
			actInd.hide();
			arrow.show();
		};
		xhr.send();
	}
}

win.addEventListener('focus', function() {
	updateLogo();
	if ( Ti.App.recentDirty == true ) {
		updateRecent();
		Ti.App.recentDirty = false;
	}	
});

initialize();
