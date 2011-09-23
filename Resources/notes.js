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
	var refreshButton = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	})
	refreshButton.addEventListener('click', function() {
		updateDocuments("refresh");
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
	//TODO should be uncommented?
	logo.addEventListener('click', function() {
		// if (Titanium.Network.remoteNotificationsEnabled == false) {
			// alert("Enable push notifications for StudyEgg if you want to be notified when you have new cards to review.");
		// }
		retrieveAllNotifications();
	});	
	win.rightNavButton = refreshButton;
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
			getLines(e.row.id, "normal", documentList);
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
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
		xhr.open("GET", serverURL + "/tags/get_tags_json");
		xhr.setRequestHeader('Content-Type', 'text/json');
		xhr.setRequestHeader('Cookie', Ti.App.Properties.getString('cookie'));
		xhr.onerror = function() {
			loadingComplete(documentList, win);
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