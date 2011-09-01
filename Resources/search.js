var win = Ti.UI.currentWindow;

Ti.include('commonMethods.js');

docs = {}; currentSearch = "";

function initialize() {
	renderSearch();
	renderNavBar();
}

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
		if (e.value != "" && e.value != " ") {
			currentSearch = e.value;
			searchQuery(e.value);
			search.blur();			
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
			getLines(e.row.id, "normal", searchList);
		} else if (e.source.id == "add") {
			e.row.children[2].image = 'images/download-faded@2x.png';
			e.row.children[2].owned = true;
			addDocument(e.row.id, e, "search");		
		} else if (e.source.id == "doc") {
			if ( e.row.children[0].push == true ) {
				var push = false;
		    	var image = 'images/document@2x.png';
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
	});
	win.add(search);
	win.add(searchList);
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
		search.blur();
		if (Titanium.Network.remoteNotificationsEnabled == false) {
			alert("Enable push notifications for StudyEgg if you want to be notified when you have new cards to review.");
		} else {
			retrieveAllNotifications();
		}
	});	
	win.leftNavButton = accountButton;
	win.titleControl = logo;
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
}

function searchQuery(text) {
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(5000);
	xhr.onload = function() {
		results = eval(this.responseText);
		setSearchResults(results);
	}
	var params = { 'q' : text };
	xhr.open("POST", serverURL + "/search/full_query");
	xhr.send(params);		
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
		if (currentSearch != "") {
			searchQuery(currentSearch);
			Ti.App.searchDirty = false;		
		};
	}
});

initialize();