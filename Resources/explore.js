//var explore = {
//	tests_enabled:false
//};

Ti.UI.setBackgroundColor('#fff');
var win = Ti.UI.currentWindow;

folders = [];

getFolders();

function getFolders() {
	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 1000000;
	xhr.open("GET","http://grocerygenie.heroku.com/users?format=json");
	xhr.onload = function(){
		try {
			var data = eval(this.responseText);
			for ( var i = 0; i < data.length; i ++ ) {
				folders.push(createFolderRow(data[i].user.password));
			}
		} catch(E) {
			alert(E);
		}
		
		//if (explore_win.tests_enabled == false) {
		//	
		//}
		start();
		
	}
	xhr.send();

}

function createFolderRow(name){
	var row = Ti.UI.createTableViewRow({}); 

	var image = Ti.UI.createImageView({
		image:'images/folder.png', 
		left: 10,
		width:50,
		height:50
	});
	
	var label= Ti.UI.createLabel({
		text:name, 
		left:70
	});
	
	row.add(image);
	row.add(label);
	
	return row;
}

function start(){
	
	var toolbar = Ti.UI.createToolbar({
		top : 0
	});
	
	var lists = Titanium.UI.createTableView({
		top : toolbar.height,
		rowHeight : 80,
		data : folders
	});
	
	lists.addEventListener('click', function(e) {
		Ti.API.debug(e.index);
		var new_win = Ti.UI.createWindow({
			url : "notes.js",
			navBarHidden : true,
			selection : e
		});
		new_win.open();
		win.visible = false;
	});
		
	var settingsButton = Ti.UI.createButton({
		title : 'Settings',
		width : 100,
		height : 35, 
		right : 30
	});
	
	var signOutButton = Ti.UI.createButton({
		title : 'Sign Out',
		width : 100,
		height : 35, 
		left : 30
	});
	
	signOutButton.addEventListener('click', function(){
		var new_win = Ti.UI.createWindow({
			url:"login.js",
			navBarHidden : true
		}); 
		new_win.open();
		win.visible = false;
	});
	
	toolbar.add(settingsButton);
	toolbar.add(signOutButton);
		
	win.add(lists);
	win.add(toolbar);
}

//Ti.include('/test/tests.js');
