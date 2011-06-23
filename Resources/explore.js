Ti.UI.setBackgroundColor('#fff');
var container = Ti.UI.currentWindow;


var win = Titanium.UI.createWindow({navBarHidden : true});
var nav = Titanium.UI.iPhone.createNavigationGroup({window : win});
container.add(nav);
folders = [];
var xhr = Ti.Network.createHTTPClient();
xhr.onerror = function(e) { alert("Error: " + e.error);}

function initialize() {

	activityIndicator = Titanium.UI.createActivityIndicator({
		height:50,
		width:10,
		top : 150,
		style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
	});
	
	loadingLabel = Ti.UI.createLabel({
		text : 'Connecting to your account...',
		textAlign : 'center'
	});
	
	activityIndicator.show();
		
	win.add(loadingLabel);
	win.add(activityIndicator);
	
	xhr.onload = getFolders;
	authenticate();
}

function authenticate() {
	
	var params = {
		'user[email]' : 'jason.urton@gmail.com',
		'user[password]' : 'jason123'
	}

	xhr.open("POST", "http://localhost:3000/users/sign_in");
	xhr.send(params);
}

function getFolders() {
	//xhr.open("GET", "http://localhost:3000/tags/get_tags_json");//
	xhr.open("GET", "http://localhost:3000/review/4094");//
	xhr.setRequestHeader('Content-Type', 'application/json');
	//xhr.setRequestHeader('Content-Type', 'text/json');
	xhr.send();
	xhr.onload = function() {
		
		//alert('yooo');
		//responseXML = (new DOMParser()).parseFromString(this.responseText, "text/xml");
		//var result = this.responseText;
		//alert(typeof(result));
		// var xml = Ti.XML.parseString(result);
		//var xml = Ti.XML.parseString(this.responseText);
		var resonseXML = (new DOMParser()).parseFromString(this.responseText, "text/xml");
		alert(resonseXML);
		// foldersData = eval(this.responseText);		
		// for (i in foldersData) {
			// folders.push(createFolderRow(foldersData[i].tag.name));
		// }
		render();

	}
	
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
		text : name, 
		left : 70
	});
	
	row.add(image);
	row.add(label);
	
	return row;
}

function render() {
		
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
initialize();