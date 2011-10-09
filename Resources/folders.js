var win = Ti.UI.currentWindow;

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
	// var refreshButton = Titanium.UI.createButton({
	// 	systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	// })
	// refreshButton.addEventListener('click', function() {
	// 	updateEggs("refresh");
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
	updateLogo();
});

Ti.App.addEventListener('updateEggs', function() {
	updateEggs();
});

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
		if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE && Ti.App.data == null ) {
			alert("Could not complete your request. Check your connection and try again.");	
		} else {		
			var newWin = Ti.UI.createWindow({
				url : "notes.js",
				selection : e.row.id,
				barColor : '#0066b2',
				_parent: Titanium.UI.currentWindow,
				orientationModes : [ Titanium.UI.PORTRAIT ]
			});
			Titanium.UI.currentTab.open(newWin, {animated:true});
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

	eggList.headerPullView = tableHeader;
	
	eggList.addEventListener('scroll',function(e) {
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
	eggList.addEventListener('scrollEnd',function(e) {
		if (pulling && !reloading && e.contentOffset.y <= -65.0) {
			reloading = true;
			pulling = false;
			arrow.hide();
			actInd.show();
			statusLabel.text = "Reloading...";
			eggList.setContentInsets({top:60},{animated:true});
			arrow.transform=Ti.UI.create2DMatrix();
			updateEggs('refresh');
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
			Ti.App.tabGroup.setActiveTab(3);
		} else if (e.currentPage == 2) {
			Ti.App.tabGroup.setActiveTab(1);
		}
		scroll.scrollToView(1);
	});

	scroll.addView(Ti.UI.createView());
	scroll.addView(eggList);
	scroll.addView(Ti.UI.createView());
	scroll.scrollToView(1);
		
	win.add(scroll);
}

function updateEggs(context) {
	
	rows = [];	
	if (Ti.App.data != null && context != "refresh" && Ti.App.Properties.getBool('download_educated') == true) {
		renderLoading(eggList, win);
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
		loadingComplete(eggList, win);
	} else {	
		if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
			alert("Could not complete your request. Check your connection and try again.");	
		} else {	
			renderLoading(eggList, win);	
			xhr = Ti.Network.createHTTPClient();
			xhr.setTimeout(10000);
			// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
			xhr.open("GET", serverURL + "/tags/get_tags_json");
			xhr.setRequestHeader('Content-Type', 'text/json');
			xhr.setRequestHeader('Cookie', Ti.App.Properties.getString('cookie'));
			xhr.onerror = function() {
				loadingComplete(eggList, win);
				alert("Could not complete your request. Please try again later.");
				eggList.setContentInsets({top:0},{animated:true});
				reloading = false;
				// lastUpdatedLabel.text = "Last Updated: "+formatDate();
				statusLabel.text = "Pull down to refresh...";
				actInd.hide();
				arrow.show();				
			};
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
				loadingComplete(eggList, win);
				eggList.setContentInsets({top:0},{animated:true});
				reloading = false;
				// lastUpdatedLabel.text = "Last Updated: "+formatDate();
				statusLabel.text = "Pull down to refresh...";
				actInd.hide();
				arrow.show();
			};
			xhr.send();	
		}
	}		
}

win.addEventListener('focus', function() {
	//TODO made change here, added check	
	updateLogo();
	if (Ti.App.myEggsDirty == true) {
		updateEggs('refresh');
		Ti.App.myEggsDirty = false;
	}	
});

initialize();