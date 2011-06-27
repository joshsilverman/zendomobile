Ti.UI.setBackgroundColor('#fff');
Ti.UI.orientation = Ti.UI.PORTAIT;

//var container = Ti.UI.currentWindow;
//var win = Titanium.UI.createWindow({navBarHidden : true});
//var nav = Titanium.UI.iPhone.createNavigationGroup({window : win});
//container.add(nav);

var win = Ti.UI.currentWindow;
Ti.include('getFolders.js');

function initialize() {
	folderRows = [];
	folderData = getFolders();
}

function createFolderRow(name, id){
	
	var row = Ti.UI.createTableViewRow({id : id}); 

	var image = Ti.UI.createImageView({
		image:'images/folder.png', 
		left: 10,
		width:50,
		height:50
	});
	
	var label= Ti.UI.createLabel({
		text : name, 
		left : 70
	});
	
	row.add(image);
	row.add(label);
	return row;
}

function render() {
	
	var toolbar = Ti.UI.createToolbar({
		top : 0
	});
	
	var lists = Titanium.UI.createTableView({
		top : toolbar.height,
		rowHeight : 80,
		data : folderRows
	});
	
	lists.addEventListener('click', function(e) {
		// alert('Passing folder ID: ' + e.row.id);
		var newWin = Ti.UI.createWindow({
			url : "notes.js",
			navBarHidden : true,
			selection : e,
			data : e.row.id,
			nav : win.nav
		});
		win.nav.open(newWin);

	});
		
	var settingsButton = Ti.UI.createButton({
		title : 'Settings',
		width : 100,
		height : toolbar.height - 10, 
		right : 30
	});
	
	var signOutButton = Ti.UI.createButton({
		title : 'Sign Out',
		width : 100,
		height : toolbar.height - 10, 
		left : 30
	});
	
	signOutButton.addEventListener('click', function(){
		
		xhr = Ti.Network.createHTTPClient();
		xhr.open("GET", "http://localhost:3000/users/sign_out");
		xhr.setRequestHeader('Content-Type', 'text/html');
		xhr.send();
		
		Ti.App.Properties.removeProperty('email');
		Ti.App.Properties.removeProperty('password');
		
		//TODO maybe these should 
		var newWin = Ti.UI.createWindow({
			url:"login.js",
			navBarHidden : true,
			nav : win.nav
		}); 	
		win.nav.open(newWin);
	});
	
	toolbar.add(settingsButton);
	toolbar.add(signOutButton);
		
	win.add(lists);
	win.add(toolbar);
}

//Ti.include('/test/tests.js');
initialize();