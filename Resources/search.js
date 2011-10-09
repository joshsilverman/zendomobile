var win = Ti.UI.currentWindow;

Ti.include('commonMethods.js');

docs = {}; currentSearch = "";

function initialize() {
	renderSearch();
	renderNavBar();
}

function renderNavBar() {
	var accountButton = Ti.UI.createButton({ title : 'Account' });
	accountButton.addEventListener('click', function() {
		search.blur();
		newWin = Ti.UI.createWindow({
			backgroundColor : '#dfdacd',
			backgroundImage : 'images/splash@2x.png',
			navBarHidden : false,
			barColor : '#0066b2',
	    	url : 'account.js',
		});
		newWin.open();
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
		search.blur();
	});	
	win.leftNavButton = accountButton;
	win.titleControl = logo;
}

Ti.App.addEventListener('updateNavBar', function() {
	updateLogo();
});

function renderSearch() {
	search = Titanium.UI.createSearchBar({
		barColor:'#0066b2',
		showCancel:true,
		height:43,
		top:0
	});
	search.addEventListener('cancel', function(e) {
		search.blur();
	});
	search.addEventListener('return', function(e) {
		if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE && Ti.App.data == null ) {
			alert("Could not complete your request. Check your connection and try again.");	
		} else {	
			if (e.value != "" && e.value != " ") {
				currentSearch = e.value;
				searchQuery(e.value);
				search.blur();			
			}
		}
	});
	searchList = Titanium.UI.createTableView({
		rowHeight : 60,
		data : [],
		backgroundColor : '#dfdacd',
		top : 50
	});
	searchList.addEventListener('click', function(e) {
		search.blur();
		if (e.source.id == "label") {
			var reviewAlert = Ti.UI.createAlertDialog({
			    title : 'Select a review mode!',
			    message : "Choose whether to show only cards you need to review or all cards.",
			    buttonNames : ["All", "Adaptive"],
			    cancel : 0
			});
			reviewAlert.addEventListener('click', function(f) {
				if (f.index == 1) { 
					createReviewSession({"method" : "review_adaptive_cards", "docId" : e.row.id, "listView" : searchList, "activityIndicator" : activityIndicator});
				} else if (f.index == 0) {
					createReviewSession({"method" : "review_all_cards", "docId" : e.row.id, "listView" : searchList, "activityIndicator" : activityIndicator});
				}			
			});
			reviewAlert.show();		
		} else if (e.source.id == "add") {
			if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE && Ti.App.data == null ) {
				alert("Could not complete your request. Check your connection and try again.");	
			} else {	
				e.row.children[2].image = 'images/download-faded@2x.png';
				e.row.children[2].owned = true;
				addDocument(e.row.id, e, "search");		
			}
		} else if (e.source.id == "doc") {
			if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE && Ti.App.data == null ) {
				alert("Could not complete your request. Check your connection and try again.");	
			} else {				
				if ( e.row.children[0].push == true ) {
					var push = false;
			    	var image = 'images/document-feed-gray-4@2x.png';
				} else {
					var push = true;
					var image = 'images/document-feed@2x.png';
				}
				e.row.children[0].push = push;
			 	e.row.children[0].image = image;	
				e.row.children[2].image = 'images/download-faded@2x.png';
				e.row.children[2].owned = true;	 	
				if (e.source.push == 0) {
					enableNotifications(e.row.id, false, e, "search");
				} else {
					enableNotifications(e.row.id, true, e, "search");
				}
			}
		}			
	});
	win.add(search);
	scroll = Titanium.UI.createScrollableView({
		views : [],
		showPagingControl : false,
		clipViews : true,
		left : 0
	});	

	scroll.addEventListener('scroll', function(e) {
		if (e.currentPage == 0) {
			Ti.App.tabGroup.setActiveTab(2);
		} else if (e.currentPage == 2) {
			Ti.App.tabGroup.setActiveTab(0);
		}
		scroll.scrollToView(1);
	});

	scroll.addView(Ti.UI.createView());
	scroll.addView(searchList);
	scroll.addView(Ti.UI.createView());
	scroll.scrollToView(1);
		
	win.add(scroll);
}

function setSearchResults(results) {	
	var data = [];
	if ( results.length < 1 ) {data.push({ title : "No results found" }) }
	for ( i in results ) {
		if (docs[results[i].document.id] == null) {
			data.push(createAddableNoteRow(results[i].document.name, results[i].document.id, false, docs[results[i].document.id])); 
		} else {
			data.push(createAddableNoteRow(results[i].document.name, results[i].document.id, true, docs[results[i].document.id])); 
		}	
	}
	searchList.setData(data);
	loadingComplete(searchList, win);
}

function searchQuery(text) {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE && Ti.App.data == null ) {
		alert("Could not complete your request. Check your connection and try again.");	
	} else {	
		renderLoading(searchList, win);
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		xhr.onerror = function() {
			loadingComplete(searchList, win);
			alert("Could not complete your request. Please try again later.");
		};
		xhr.onload = function() {
			results = eval(this.responseText);
			setSearchResults(results);
		};
		var params = { 'q' : text };
		xhr.open("POST", serverURL + "/search/full_query");
		xhr.setRequestHeader('Cookie', Ti.App.Properties.getString('cookie'));
		xhr.send(params);	
	}	
}

win.addEventListener('focus', function() {
	updateLogo();
	docs = {};
	for (i in Ti.App.data) {
		for ( j in Ti.App.data[i].tag.documents ) {
			docs[Ti.App.data[i].tag.documents[j].id] = Ti.App.data[i].tag.documents[j].userships[0].push_enabled
		}
	}
	if (Ti.App.searchDirty == true) {
		if (currentSearch != "" && currentSearch != null) {
			searchQuery(currentSearch);
			Ti.App.searchDirty = false;		
		};
	}
});

initialize();