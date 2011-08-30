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
		// if (Titanium.Network.remoteNotificationsEnabled == false) {
			// alert("Enable push notifications for StudyEgg if you want to be notified when you have new cards to review.");
		// }
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
		if (e.source.id == "label") {
			if ( Ti.App.reviewing != true ) {
				Ti.App.reviewing = true;
				getLines(e.row.id, "normal", popularList);
			}	
		} else if (e.source.id == "add") {
			e.row.children[2].image = 'images/plus-fade@2x.png';
			e.row.children[2].owned = true;
			addEgg(e.row.id, e, "popular");
			// addDocument(e.row.id, e, "popular");		
		} 
		// else if (e.source.id == "doc") {
			// if ( e.row.children[0].push == true ) {
				// var push = false;
		    	// var image = 'images/document@2x.png';
			// } else {
				// var push = true;
				// var image = 'images/document-feed@2x.png';
			// }
			// e.row.children[0].push = push;
		 	// e.row.children[0].image = image;	
			// e.row.children[2].image = 'images/plus-fade@2x.png';
			// e.row.children[2].owned = true;	 	
			// if (e.source.push == 0) {
				// enableNotifications(e.row.id, false, e, "popular");
			// } else {
				// enableNotifications(e.row.id, true, e, "popular");
			// }
		// }
	});
	win.add(popularList);
	updatePopular();
}

function updatePopular() {
	//TODO no push data coming through here	
	notesRows = [];
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	xhr.open("GET", serverURL + "/documents/get_public_documents");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		popularData = eval(this.responseText);
		var data = [];
		for ( i in popularData ) { 
			if (docs[popularData[i].document.id] == null) {			
				data.push(createAddableEggRow(popularData[i].document.name, popularData[i].document.id, false, docs[popularData[i].document.id])); 
			} else {		
				data.push(createAddableEggRow(popularData[i].document.name, popularData[i].document.id, true, docs[popularData[i].document.id])); 
			}	
		}
		popularList.setData(data);
	};
	xhr.send();	

}

win.addEventListener('focus', function() {
	updateLogo();
	docs = {};
	for (i in Ti.App.data) {
		for ( j in Ti.App.data[i].tag.documents ) {
			docs[Ti.App.data[i].tag.documents[j].id] = Ti.App.data[i].tag.documents[j].userships[0].push_enabled
		}
	}
	if (Ti.App.popularDirty == true) {
		updatePopular();
		Ti.App.popularDirty = false;
	}
});

initialize();
