var win = Ti.UI.currentWindow;
Ti.UI.setBackgroundColor('#dfdacd');

Ti.include('commonMethods.js');
var screenHeight = Ti.Platform.displayCaps.platformHeight;
var screenWidth = Ti.Platform.displayCaps.platformWidth;

function initialize() {
	renderDocuments();
	renderNavBar();
}

win.activity.onCreateOptionsMenu = function(e){
    var menu = e.menu;
    var signOutMenuItem = menu.add({
            title: 'Sign Out'
	});

	// signOutMenuItem.setIcon('images/android_menu_home.png');
	signOutMenuItem.addEventListener('click', function(e) {
	    signOut();
	    var activity = Titanium.Android.currentActivity;
		activity.finish();
	});
};

function renderNavBar() {
	var navBar = Ti.UI.createView({
		width : screenWidth,
		height : 60,
		backgroundColor : '#0066b2',
		top : 0
	});
	var image = 'images/logo@2x.png'
	var logo = Ti.UI.createImageView({
		image : image, 
		// top : 
		height : 45,
		width : 85
	});
	logo.addEventListener('click', function() {
		if (Titanium.Network.remoteNotificationsEnabled == false) {
			alert("Enable push notifications for StudyEgg if you want to be notified when you have new cards to review.");
		}
		retrieveAllNotifications();
	});		
	navBar.add(logo);
	win.add(navBar);
}

function renderDocuments(){
	documentList = Titanium.UI.createTableView({
		rowHeight : 85,
		data : win.data,
		backgroundColor : '#dfdacd',
		top : 60,
		separatorColor : "#fff"
	});
	documentList.addEventListener('click', function(e){
		//For public content eggs
		if (win.selection == -1) {
			if (e.source.id == "add") {
				e.row.children[2].image = 'images/download-faded@2x.png';
				e.row.children[2].owned = true;
				if (Ti.App.Properties.getBool('download_educated') != true) {
					// alert('1');
					addEgg(e.row.id, e, "popular", false);
				} else {
					// alert('2');
					addEgg(e.row.id, e, "popular");
				}
			} 
		} else {	
			getLines(e.row.id, "normal", documentList);		
		}
	});
	win.add(documentList);
	
	if (win.selection == -1) {
		updatePopular();
	} else {
		updateDocuments();	
	}
	// if (Ti.App.Properties.getBool('educated') != true && win.selection != -1) {
		// var pushReminderAlert = Ti.UI.createAlertDialog({
		    // title : 'Reminder!',
		    // message : "Tap the icon next to a section, StudyEgg will send you notifications to teach you the material.",
		    // buttonNames : ["Don't show again", "Okay"]
		// });
		// pushReminderAlert.addEventListener('click', function(f) {
			// if (f.index == 0) { 
				// Ti.App.Properties.setBool('educated', true);
			// }
		// });
		// pushReminderAlert.show();	
	// }
}

function updatePopular() {
	notesRows = [];
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(10000);
	xhr.open("GET", serverURL + "/tags/get_popular_json");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Cookie', Ti.App.cookie);
	xhr.onload = function() {
		popularData = eval(this.responseText);
		var data = [];
		for (i in popularData) {
			data.push(createAddableEggRow(popularData[i][1], popularData[i][0], popularData[i][2]));
		}
		documentList.setData(data);
	};
	xhr.send();	
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
		xhr.setTimeout(10000);
		xhr.open("GET", serverURL + "/tags/get_tags_json");
		xhr.setRequestHeader('Content-Type', 'text/json');
		xhr.setRequestHeader('Cookie', Ti.App.cookie);
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

// win.addEventListener('focus', function() {
	// if (Ti.App.documentsDirty == true) {
		// updateDocuments();
		// Ti.App.documentsDirty = false;
	// }
// });

initialize();