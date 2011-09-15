var win = Ti.UI.currentWindow;
Ti.UI.setBackgroundColor('#dfdacd');

// Ti.include('networkMethods.js');
Ti.include('commonMethods.js');
var screenHeight = Ti.Platform.displayCaps.platformHeight;
var screenWidth = Ti.Platform.displayCaps.platformWidth;

function initialize() {
	renderFolders();
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
		height : 45,
		width : 85
	});
	// logo.addEventListener('click', function() {
		// if (Titanium.Network.remoteNotificationsEnabled == false) {
			// alert("Enable push notifications for StudyEgg if you want to be notified when you have new cards to review.");
		// }
		// retrieveAllNotifications();
	// });		
	navBar.add(logo);
	win.add(navBar);
}

Ti.App.addEventListener('updateEggs', function() {
	updateEggs('refresh');
	// if (Ti.App.myEggsDirty == 1) {
		// alert('updating!');
		// updateEggs("refresh");
		// Ti.App.myEggsDirty = false;
	// }
});

function renderFolders(rows) {
	eggList = Titanium.UI.createTableView({
		rowHeight : 80,
		data : rows,
		backgroundColor : '#dfdacd',
		top : 60,
		separatorColor : "#fff"
	});
	eggList.addEventListener('click', function(e) {
		var newWin = Ti.UI.createWindow({
			url : "notes.js",
			selection : e.row.id,
			barColor : '#0066b2',
			_parent: Titanium.UI.currentWindow,
			fullscreen : false,
			navBarHidden : true,
			orientationModes : [
				Titanium.UI.PORTRAIT
			]
		});
		newWin.open();
	});
	win.add(eggList);
	updateEggs();
}

function updateEggs(context) {
	rows = [];	
	if (Ti.App.data != null && context != "refresh" && Ti.App.Properties.getBool('download_educated') == true) {
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
		rows.push(createEggCarton("Public Content", -1));
		eggList.setData(rows);
	} else {	
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
		xhr.open("GET", serverURL + "/tags/get_tags_json");
		xhr.setRequestHeader('Cookie', Ti.App.cookie);	
		xhr.setRequestHeader('Content-Type', 'text/json');
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
			rows.push(createEggCarton("Public Content", -1));
			eggList.setData(rows);
		};
		xhr.send();	
	}		
}

// win.addEventListener('focus', function() {	
	// updateEggs('refresh');
	// if (Ti.App.myEggsDirty == true) {
		// alert("Dirty!");
		// //TODO this okay?
		// updateEggs();
		// updateEggs('refresh');
		// Ti.App.myEggsDirty = false;
	// }
// });

initialize();