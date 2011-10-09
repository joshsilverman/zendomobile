var win = Ti.UI.currentWindow;

Ti.include('commonMethods.js');

function initialize() {
	renderDocuments();
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
	// 	updateDocuments("refresh");
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
	win.titleControl = logo;
}

Ti.App.addEventListener('updateNavBar', function() {
	updateLogo();
});

function renderDocuments(){

	var toolbar = Ti.UI.createToolbar({
		top : 0
	});
	
	documentList = Titanium.UI.createTableView({
		rowHeight : 80,
		data : win.data,
		backgroundColor : '#dfdacd'
	});
	
	documentList.addEventListener('click', function(e){
		if (e.source.id == "label") {
			var reviewAlert = Ti.UI.createAlertDialog({
			    title : 'Select a review mode!',
			    message : "Choose whether to show only cards you need to review or all cards.",
			    buttonNames : ["All", "Adaptive"],
			    cancel : 0
			});
			reviewAlert.addEventListener('click', function(f) {
				if (f.index == 1) { 
					createReviewSession({"method" : "review_adaptive_cards", "docId" : e.row.id, "listView" : documentList, "activityIndicator" : activityIndicator});
				} else if (f.index == 0) {
					createReviewSession({"method" : "review_all_cards", "docId" : e.row.id, "listView" : documentList, "activityIndicator" : activityIndicator});
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
				enableNotifications(e.row.id, false, e, "documents");
			} else {
				enableNotifications(e.row.id, true, e, "documents");
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

	documentList.headerPullView = tableHeader;
	
	documentList.addEventListener('scroll',function(e) {
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
	documentList.addEventListener('scrollEnd',function(e) {
		if (pulling && !reloading && e.contentOffset.y <= -65.0) {
			reloading = true;
			pulling = false;
			arrow.hide();
			actInd.show();
			statusLabel.text = "Reloading...";
			documentList.setContentInsets({top:60},{animated:true});
			arrow.transform=Ti.UI.create2DMatrix();
			updateDocuments('refresh');
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
	scroll.addView(documentList);
	scroll.addView(Ti.UI.createView());
	scroll.scrollToView(1);
		
	win.add(scroll);
	updateDocuments();
	if (Ti.App.Properties.getBool('educated') != true) {
		var pushReminderAlert = Ti.UI.createAlertDialog({
		    title : 'Reminder!',
		    message : "Tap the icon next to a section, StudyEgg will send you notifications to teach you the material.",
		    buttonNames : ["Don't show again", "Okay"]
		});
		pushReminderAlert.addEventListener('click', function(f) {
			if (f.index == 0) { 
				Ti.App.Properties.setBool('educated', true);
			}
		});
		pushReminderAlert.show();	
	}
}

function updateDocuments(context) {
	renderLoading(documentList, win);
	notesRows = [];
	if (Ti.App.data != null && context != "refresh") {
		for ( i in Ti.App.data ) {
			if (Ti.App.data[i].tag.id == win.selection) {					
				for (n in Ti.App.data[i].tag.documents) {
					notesRows.push(createNoteRow(Ti.App.data[i].tag.documents[n].name, Ti.App.data[i].tag.documents[n].id, Ti.App.data[i].tag.documents[n].tag_id, Ti.App.data[i].tag.documents[n].userships[0].push_enabled));
				}
			}
		}
		documentList.setData(notesRows);
		loadingComplete(documentList, win);
	} else {
		if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
			alert("Could not complete your request. Check your connection and try again.");	
		} else {
			xhr = Ti.Network.createHTTPClient();
			xhr.setTimeout(10000);
			// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
			xhr.open("GET", serverURL + "/tags/get_tags_json");
			xhr.setRequestHeader('Content-Type', 'text/json');
			xhr.setRequestHeader('Cookie', Ti.App.Properties.getString('cookie'));
			xhr.onerror = function() {
				loadingComplete(documentList, win);
				alert("Could not complete your request. Please try again later.");
				documentList.setContentInsets({top:0},{animated:true});
				reloading = false;
				// lastUpdatedLabel.text = "Last Updated: "+formatDate();
				statusLabel.text = "Pull down to refresh...";
				actInd.hide();
				arrow.show();				
			};
			xhr.onload = function() {
				foldersData = eval(this.responseText);
				for ( i in foldersData ) {
					if (foldersData[i].tag.id == win.selection) {
						for (n in foldersData[i].tag.documents) {
							notesRows.push(createNoteRow(foldersData[i].tag.documents[n].name, foldersData[i].tag.documents[n].id, foldersData[i].tag.documents[n].tag_id, foldersData[i].tag.documents[n].userships[0].push_enabled));				
						}
					}
				}
				documentList.setData(notesRows);
				loadingComplete(documentList, win);
				documentList.setContentInsets({top:0},{animated:true});
				reloading = false;
				// lastUpdatedLabel.text = "Last Updated: "+formatDate();
				statusLabel.text = "Pull down to refresh...";
				actInd.hide();
				arrow.show();				
			}	
			xhr.send();		
		}	
	}	
}

win.addEventListener('focus', function() {
	updateLogo();	
	if (Ti.App.documentsDirty == true) {
		updateDocuments();
		Ti.App.documentsDirty = false;
	}
});

initialize();