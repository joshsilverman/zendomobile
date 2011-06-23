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

// authenticate();
getFolders();

function extractToken(){
	
}

//Authenticates with Zendo
function authenticate() {
	
	var email = 'jason.urton@gmail.com';
	var password = 'jason123';
	var authToken = '';
	var cookie;
	
	xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 1000000;
	xhr.task = 1;

	xhr.onerror = function(e) {
		
		alert("Error: " + e.error);
	}
	// xhr.open("GET", "http://localhost:3000/tags/json");
	// xhr.open("GET", "http://localhost:3000/users/sign_in");
	xhr.onload = function(e) {
		
		switch (xhr.task) {
			case 1:
				// rawCookie = xhr.getResponseHeader("Set-Cookie").replace("; path=/; HttpOnly", "");
				//cookie = xhr.getResponseHeader("Set-Cookie").replace("_dougie_session=", "").replace("; path=/; HttpOnly", "");
				xhr.task = 2;
				// token = this.responseText.match("authenticity_token\" type=\"hidden\" value=\"[A-Za-z0-9/+=]*").toString().replace('authenticity_token" type="hidden" value="', '').toString();
				var params = {
					'user[password]' : password,
					'user[email]' : email//, 
					// 'authenticity_token' : token	
				}
				
				alert(xhr.getResponseHeader("Test"));
				
				xhr.open("POST", "http://localhost:3000/users/sign_in");
				//xhr.setRequestHeader('Content-Type', 'text/html');
				xhr.setRequestHeader("Cookie", "cookie=kjhgh;");// + cookie);
				xhr.send(params); //send params
				// Ti.API.debug("Got response: " + this.responseText);
				
				break;
				
			case 2:
			
				// alert(xhr.getResponseHeader("Set-Cookie").replace("_dougie_session=", "").replace("; path=/; HttpOnly", ""));
				// alert(xhr.responseData);
				// alert(xhr.getResponse());
				alert(xhr.getResponseHeader("Test"));
				// alert(xhr.getResponseHeader("Cookie"));
				// alert(xhr.getResponseHeader("HTTP_COOKIE"));
				//cookie = xhr.getResponseHeader("Set-Cookie").replace("_dougie_session=", "").replace("; path=/; HttpOnly", "");		
				xhr.task = 3;
				xhr.open("GET", "http://localhost:3000/tags/json");//
				xhr.setRequestHeader('Content-Type', 'text/json');
				xhr.setRequestHeader('accept', '*/*');
				xhr.setRequestHeader("Cookie", "cookie=kjhgh;");
				// Ti.API.debug("Got response: " + this.responseText);
				xhr.send();
				// Ti.API.debug("Got response: " + this.responseText);

				// Ti.API.debug("Got response: " + this.responseText);
				break;
				
			case 3:
				
				break;
		}
	}	
	// xhr.setRequestHeader('Content-Type', 'text/html');
	// xhr.send();
	xhr.onload();
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