var win = Ti.UI.currentWindow;

// Ti.include('networkMethods.js');
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
	var refreshButton = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	})
	refreshButton.addEventListener('click', function() {
		updateDocuments("refresh");
	});	
	var logo = Ti.UI.createImageView({
		image : 'images/logo-indicator.png', 
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
	win.titleControl = logo;
}

function renderDocuments(){

	var toolbar = Ti.UI.createToolbar({
		top : 0
	});
	
	
	documentList = Titanium.UI.createTableView({
		rowHeight : 60,
		data : win.data,
		backgroundColor : '#dfdacd'
	});
	
	documentList.addEventListener('click', function(e){
		if (e.source.id == "label") {
			// alert("click label");
			// if ( Ti.App.reviewing != true ) {
				// Ti.App.reviewing = true;
			getLines(e.row.id, "normal", documentList);
			// }	
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
			if (e.source.push == 0) {
				enableNotifications(e.row.id, false, e, "documents");
			} else {
				enableNotifications(e.row.id, true, e, "documents");
			}
		}	
	});
	win.add(documentList);
	updateDocuments();
}

function updateDocuments(context) {
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
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(5000);
		// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
		xhr.open("GET", serverURL + "/tags/get_tags_json");
		xhr.setRequestHeader('Content-Type', 'text/json');
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
		}	
		xhr.send();			
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