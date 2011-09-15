Ti.include('network.js');

function updateCache() {
	xhr = Ti.Network.createHTTPClient();
	// xhr.setTimeout(1000000);
	xhr.setTimeout(10000);
	xhr.open("GET", serverURL + "/tags/get_tags_json");//
	xhr.setRequestHeader('Content-Type', 'text/json');
	xhr.setRequestHeader('Cookie', Ti.App.cookie);
	xhr.onload = function() {
		Ti.App.data = eval(this.responseText);
	};
	xhr.send();
}

function enableNotifications(id, enable, row_object, context) {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not complete your request. Check your connection and try again.");
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		xhr.open("GET", serverURL + "/documents/enable_mobile/" + id + "/" + ((enable)?1:0));
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Cookie', Ti.App.cookie);
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status != 200) {	
					alert("Could not enable notifications for that document!");	
					if ( row_object.row.children[0].push == true ) {
						var push = false;
				    	var image = 'images/document@2x.png';
					} else {
						var push = true;
						var image = 'images/document-feed@2x.png';
					}
					row_object.row.children[0].push = push;
				 	row_object.row.children[0].image = image;
				} else {
					updateCache();
					Ti.App.myEggsDirty = true;			
				}
			}
		}
		xhr.send();
	}	
}

function getLines(doc, context, listView) {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// Ti.App.reviewing = false;
		alert("Could not complete your request. Check your connection and try again.");
	} else {
		renderLoading(listView, Ti.UI.currentWindow);
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		xhr.open("GET", serverURL + "/documents/" + doc + "/cards");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Cookie', Ti.App.cookie);
		xhr.onload = function() {
			data = JSON.parse(this.responseText);
			if (data.cards.length < 1) {
				loadingComplete(listView, Ti.UI.currentWindow);
				alert('That document has no cards to review!'); 
			} else {
				var new_win = Ti.UI.createWindow({
					url : "updated_review.js",
					backgroundColor : '#dfdacd',
					navBarHidden : true,
					cards : data.cards,
					_parent : Titanium.UI.currentWindow,
					_context : "normal",
					orientationModes : [
						Titanium.UI.PORTRAIT
					]
				});
				// Ti.App.tabGroup.hide();
				new_win.open();
				loadingComplete(listView, Ti.UI.currentWindow);
			}
		};
		xhr.send();
	}		
}

function addDocument(id, row_object, context) {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not complete your request. Check your connection and try again.");
	} else {
		switch (context) {
			case "popular":
				Ti.App.myEggsDirty = true;
				Ti.App.documentsDirty = true;
				Ti.App.searchDirty = true;
				break;
			case "search":
				Ti.App.myEggsDirty = true;
				Ti.App.documentsDirty = true;
				Ti.App.popularDirty = true;
				break;
			case "recent":
				Ti.App.myEggsDirty = true;
				Ti.App.documentsDirty = true;
				Ti.App.popularDirty = true;
				Ti.App.searchDirty = true;
				break;									
		}			
		notesRows = [];
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		xhr.open("GET", serverURL + "/documents/add_document/" + id);
		xhr.setRequestHeader('Cookie', Ti.App.cookie);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status != 200) {	
					alert("Could not add that document!");	
					if ( row_object.row.children[2].owned == true ) {
						var owned = false;
				    	var image = 'images/download@2x.png';
					} 
					row_object.row.children[2].owned = owned;
				 	row_object.row.children[2].image = image;
				} else {
					updateCache();
				}
			}
		}		
		xhr.send();
	}	
}

function addEgg(id, row_object, context, trigger_dirty){
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not complete your request. Check your connection and try again.");
	} else {
		notesRows = [];
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		xhr.open("GET", serverURL + "/tags/claim_tag/" + id);
		xhr.setRequestHeader('Cookie', Ti.App.cookie);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status != 200) {	
					alert("Could not add that egg!");	
					if ( row_object.row.children[2].owned == true ) {
						row_object.row.children[2].owned = false;
				    	row_object.row.children[2].image = 'images/download@2x.png';
					} 
				} else {	
					updateCache();
					if (Ti.App.Properties.getBool('download_educated') != true) {
						// alert('you aint educated!');
						Ti.App.fireEvent('updateEggs');
						Ti.UI.currentWindow.close();
						Ti.App.Properties.setBool('download_educated', true);
					} else {
						Ti.App.myEggsDirty = true;	
					}
				}
			}
		}		
		xhr.send();
	}	
}

function createFolderRow(name, id, public_folder, push){
	var row = Ti.UI.createTableViewRow({
		id : id,
		hasChild : true,
		backgroundColor : '#dfdacd',
		height : 80
	}); 
	// if (push == true) {
		// var image = Ti.UI.createImageView({
			// image : 'images/egg-feed@2x.png', 
	    	// left : 5,
	    	// touchEnabled : true,
	    	// height : 100,
	    	// width : 80,
			// id : "egg"
		// });				
	// } else {
		var image = Ti.UI.createImageView({
			image : 'images/egg@2x.png', 
	    	left : 5,
	    	touchEnabled : true,
	    	height : 60,
	    	width : 50,
			id : "egg"
		});		
	// } 
	var label= Ti.UI.createLabel({
		text : name, 
		left : 63,
		color : '#000'
	});
	label.public_folder = public_folder;
	row.add(image);
	row.add(label);
	return row;
}

function createEggCarton(name, id){
	var row = Ti.UI.createTableViewRow({
		id : id,
		hasChild : true,
		backgroundColor : '#dfdacd',
		height : 80
	}); 
	var image = Ti.UI.createImageView({
		image : 'images/egg-group.png', 
    	left : 5,
    	touchEnabled : true,
    	height : 60,
    	width : 60,
		id : "egg"
	});		
	var label= Ti.UI.createLabel({
		text : name, 
		left : 73,
		color : '#000'
	});
	row.add(image);
	row.add(label);
	return row;
}

function createAddableEggRow(name, tagid, owned){
	// if (push == true) {
	    // var image = Ti.UI.createImageView({
	    	// image:'images/egg-feed@2x.png',
	    	// left: 5,
	    	// touchEnabled:true,
	    	// height:50,
	    	// width:50,
	    	// push : true,
	    	// status:'checked',
	    	// id : "doc"    
	    // });		
	// } else {
    var image = Ti.UI.createImageView({
    	image:'images/egg@2x.png',
    	left: 5,
    	touchEnabled:true,
    	push : false,
	    height : 60,
	    width : 50,
    	status:'unchecked',
    	id : "doc"    
    });		
	// }
	if (owned == true) {
		var addButton = Ti.UI.createImageView({
			image:'images/download-faded@2x.png',
	    	right: 10,
	    	touchEnabled:true,
	    	height:25,
	    	width:25,
	    	owned : true,
	    	id : "owned"
		});				
	} else {
		var addButton = Ti.UI.createImageView({
			image:'images/download@2x.png',
	    	right: 10,
	    	touchEnabled:true,
	    	height:25,
	    	width:25,
	    	owned : false,
	    	id : "add"
		});		
	}
	// TODO screen independent row formatting!
	var label= Ti.UI.createLabel({
		text : name, 
		left : 63,
		width : 210,
		id : "label",
		color : '#000'
	});
	var row = Ti.UI.createTableViewRow({ 
		id : tagid,
		backgroundColor : '#dfdacd',
		height : 80
	}); 
	row.add(image);
	row.add(label);
	row.add(addButton);
	return row;
}

function createNoteRow(name, docid, tagId, push_enabled){
	var row = Ti.UI.createTableViewRow({ 
		id : docid,
		tagId : tagId,
		backgroundColor : '#dfdacd',
		height : 85
	}); 
	// if (push_enabled == 1) {
	    // var image = Ti.UI.createImageView({
	    	// image:'images/document-feed@2x.png',
	    	// left: 5,
	    	// touchEnabled:true,
	    	// height:80,
	    	// width:80,
	    	// status:'unchecked',
	    	// id : "doc",
	    	// push : true
	    // });				
	// } else {
	    var image = Ti.UI.createImageView({
	    	image:'images/document@2x.png',
	    	left: 5,
	    	touchEnabled:true,
	    	height:50,
	    	width:50,
	    	status:'unchecked',
	    	id : "doc",
	    	push : false
	    });		
	// }
	var label= Ti.UI.createLabel({
		text : name, 
		left : 58, 
		id : "label", 
		color : '#000'
	});
	row.add(image);
	row.add(label);
	return row;
}

function createAddableNoteRow(name, docid, owned, push){
	// if (push == true) {
	    // var image = Ti.UI.createImageView({
	    	// image:'images/document-feed@2x.png',
	    	// left: 5,
	    	// touchEnabled:true,
	    	// height:50,
	    	// width:50,
	    	// push : true,
	    	// status:'checked',
	    	// id : "doc"    
	    // });		
	// } else {
	    var image = Ti.UI.createImageView({
	    	image:'images/document@2x.png',
	    	left: 5,
	    	touchEnabled:true,
	    	push : false,
	    	height:50,
	    	width:50,
	    	status:'unchecked',
	    	id : "doc"    
	    });		
	// }
	if (owned == true) {
		var addButton = Ti.UI.createImageView({
			image:'images/download-faded@2x.png',
	    	right: 10,
	    	touchEnabled:true,
	    	height:25,
	    	width:25,
	    	owned : true,
	    	id : "owned"
		});				
	} else {
		var addButton = Ti.UI.createImageView({
			image:'images/download@2x.png',
	    	right: 10,
	    	touchEnabled:true,
	    	height:25,
	    	width:25,
	    	owned : false,
	    	id : "add"
		});		
	}
	var label= Ti.UI.createLabel({
		text : name, 
		left : 58,
		width : 220,
		id : "label"
	});
	var row = Ti.UI.createTableViewRow({ 
		id : docid,
		backgroundColor : '#dfdacd'
	}); 
	row.add(image);
	row.add(label);
	row.add(addButton);
	return row;
}

function retrieveAllNotifications() {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not complete your request. Check your connection and try again.");
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		xhr.open("GET", serverURL + "/users/retrieve_notifications");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Cookie', Ti.App.cookie);
		xhr.onload = function() {
			data = JSON.parse(this.responseText);
			if (data.cards.length < 1) {
				Titanium.UI.iPhone.appBadge = 0;
				alert('You have no pending notifications!'); 
			} else {
				var new_win = Ti.UI.createWindow({
					url : "updated_review.js",
					backgroundColor : '#dfdacd',
					navBarHidden : false,
					cards : data.cards,
					_parent : Titanium.UI.currentWindow,
					_context : "push",
					orientationModes : [
						Titanium.UI.PORTRAIT
					]
				});
				Ti.App.tabGroup.hide();
				new_win.open();
			}			

		};
		xhr.send();
	}			
}

function updateLogo() {
	if (Titanium.UI.iPhone.appBadge == 0) {
		win.titleControl.image = 'images/logo@2x.png'
	} else {
		win.titleControl.image = 'images/logo-indicator@2x.png'
	}
}

function createCard(prompt, answer, memID) {
	var card = new Object();
	card.prompt = prompt;
	card.answer = answer;
	card.flipped = false;
	card.grade = 0;
	card.memID = memID;
	return card;
}

function reLogUser(email, password, context) {
	xhr = Titanium.Network.createHTTPClient();
	xhr.setTimeout(10000);
	var params = {
		'user[email]' : email,
		'user[password]' : password
	};
	xhr.onerror = function(e) {
		Ti.API.debug("Error: " + e.error);
	};
	// xhr.clearCookies(serverURL);
	xhr.onload = function() {
		if (context == "push") {
			retrieveAllNotifications();
		}
	};
	xhr.open("POST", serverURL + "/users/sign_in");
	xhr.setRequestHeader('Cookie', Ti.App.cookie);
	xhr.send(params);	
}

activityIndicator = Titanium.UI.createActivityIndicator({
	// style : Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
	message : 'Loading...', 
	width : 'auto'
});

function renderLoading(view, currentWindow) {
	view.opacity = .25;
	activityIndicator.show();
	currentWindow.add(activityIndicator);		
}

function loadingComplete(view, currentWindow) {
	view.opacity = 1;
	activityIndicator.hide();
	// currentWindow.remove(activityIndicator);
}

function authenticate(email, password, context) {
	if (context == "start" && (Ti.App.Properties.getString('email') == '' || Ti.App.Properties.getString('email') == null)){
		var win = Ti.UI.createWindow({
			url:"login.js",
			navBarHidden : true,
			backgroundColor : '#dfdacd',
			orientationModes : [
				Titanium.UI.PORTRAIT
			]
		});
		win.open();	
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		xhr.onerror = function() {
			if (context != "start") {
				alert("Invalid email/password combination.");	
			} else {			
				var win = Ti.UI.createWindow({
					url:"login.js",
					navBarHidden : true,
					backgroundColor : '#dfdacd',
					orientationModes : [
						Titanium.UI.PORTRAIT
					]
				});
				win.open();		
			}		
		};
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {			
				if (this.status == 200) {
					// alert(xhr.getResponseHeader("Set-Cookie"));
					Ti.App.cookie = xhr.getResponseHeader("Set-Cookie");	
					updateCache();		
					authSuccess(email, password);
				}
			}
		}
		var params = {
			'user[email]' : email,
			// 'user[password]' : Titanium.Utils.md5HexDigest(password)
			'user[password]' : password
		};
		xhr.open("POST", serverURL + "/users/sign_in");
		// xhr.setRequestHeader('Cookie', Ti.App.cookie);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')  
		//TODO FIX
		xhr.setRequestHeader("User-Agent", "Appcelerator Titanium/1.7.1 (iPhone Simulator/4.2; iPhone OS; en_US;)");	
		xhr.send(params);		
	};
}

function signOut() {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not complete your request. Check your connection and try again.");
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.open("GET", serverURL + "/users/sign_out");
		xhr.setRequestHeader('Content-Type', 'text/html');
		xhr.setRequestHeader('Cookie', Ti.App.cookie);
		xhr.send();
		
		Ti.App.Properties.removeProperty('email');
		Ti.App.Properties.removeProperty('password');

		Ti.App.Properties.setBool('active', false);
		Titanium.UI.orientation = Titanium.UI.PORTRAIT;
		var win = Ti.UI.createWindow({
			url:"login.js",
			navBarHidden : true,
			backgroundColor : '#dfdacd',
			orientationModes : [
				Titanium.UI.PORTRAIT,
			]
		});
		win.open();	
		Ti.App.data = null;
		Ti.App.cookie = null;
	}
}

function signUp(email, password) {
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(10000);
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {				
				Ti.App.cookie = xhr.getResponseHeader("Set-Cookie");	
				Ti.App.Properties.setString('email', email);
				Ti.App.Properties.setString('password', password);
				Ti.App.Properties.setBool('educated', false);	
				Ti.App.Properties.setBool('download_educated', false);		
				authSuccess(email, password);
				emailField.value = "";
				passwordField.value = "";
				confirmPasswordField.value = "";				
				Ti.App.myEggsDirty = true;
				Ti.App.documentsDirty = true;
				// Ti.UI.currentWindow.close();
			} else {
				alert("Could not create your account... Did you enter your email address correctly?");
			}
		}
	};
	var params = {
		'user[email]' : email,
		'user[password]' : password
	};
	xhr.open("POST", serverURL + "/users");
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')  
	//TODO FIX
	xhr.setRequestHeader("User-Agent", "Appcelerator Titanium/1.7.1 (iPhone Simulator/4.2; iPhone OS; en_US;)");	
	xhr.send(params);	
}

function authSuccess(email, password) {
	Ti.App.Properties.setString('email', email);
	Ti.App.Properties.setString('password', password);
	// registerDevice(Ti.App.Properties.getString("token"));
	var new_win = Ti.UI.createWindow({
		url : "folders.js",
		backgroundColor : '#dfdacd',
		navBarHidden : true,
		_context : "normal",
		_parent : Ti.UI.currentWindow,
		exitOnClose : true,
		orientationModes : [
			Titanium.UI.PORTRAIT
		]
	});	
	Ti.App.myEggsDirty = true;
	new_win.open();
}

function registerDevice(token) {
	xhr = Ti.Network.createHTTPClient();
	xhr.open("POST", serverURL + "/users/add_device/" + token);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Cookie', Ti.App.cookie);
	xhr.send();
}


