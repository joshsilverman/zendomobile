Ti.UI.setBackgroundColor('#fff');
container = Ti.UI.currentWindow;

var win = Titanium.UI.createWindow({
	navBarHidden : true
});

var nav = Titanium.UI.iPhone.createNavigationGroup({
   window : win
});

container.add(nav);

var activityIndicator = Titanium.UI.createActivityIndicator({
	height:50,
	width:10,
	top : 150,
	style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
});

var loadingLabel = Ti.UI.createLabel({
	text : 'Connecting to your account...',
	textAlign : 'center'
});

activityIndicator.show();
activityIndicator.show();
	
win.add(loadingLabel);
win.add(activityIndicator);

folders = [];

authenticate();

//Authenticates with Zendo
function authenticate() {
	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 1000000;
	xhr.open("POST","http://localhost:3000/tags/json");
	xhr.setRequestHeader("content-type", "application/json");
	var param = {"user[email]" : "jason.urton@gmail.com", "user[password]" : "jason123"};
	xhr.send(param);
	xhr.onerror = function(e){
		alert(e);
	}
	xhr.onComplete = getFolders();
}

//Retrieves the user's folders
function getFolders() {
	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 1000000;
	xhr.open("GET","http://grocerygenie.heroku.com/users?format=json");
	xhr.onload = function(){
		try {
			var data = eval(this.responseText);
			Ti.API.debug(this.responseText);
			for ( var i = 0; i < data.length; i ++ ) {
				folders.push(createFolderRow(data[i].user.password));
			}
		} catch(E) {
			Ti.API.debug(E);
		};
		
		start();
		
	}
	
	xhr.onerror = function(e) {
		alert(e); 
	};
	
	xhr.send();
}

//Creates folder UI elements
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

//Build explore UI
function start(){
	
	loadingLabel.hide();
	activityIndicator.hide();
	
	
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
		var newWin = Ti.UI.createWindow({
			url : "notes.js",
			navBarHidden : true,
			selection : e
		});
		nav.open(newWin);
		//new_win.open({transition : Titanium.UI.iPhone.AnimationStyle.CURL_UP});
		//win.visible = false;
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
		var newWin = Ti.UI.createWindow({
			url:"login.js",
			navBarHidden : true
		}); 
		nav.open(newWin);
		//new_win.open({transition : Titanium.UI.iPhone.AnimationStyle.CURL_DOWN});
		//win.visible = false;
	});
	
	toolbar.add(settingsButton);
	toolbar.add(signOutButton);
		
	win.add(lists);
	win.add(toolbar);
}

//Ti.include('/test/tests.js');
