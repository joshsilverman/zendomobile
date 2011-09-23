Ti.include('network.js');

function updateCache() {
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(10000);
	xhr.open("GET", serverURL + "/tags/get_tags_json");//
	xhr.setRequestHeader('Content-Type', 'text/json');
	xhr.setRequestHeader('Cookie', Ti.App.Properties.getString('cookie'));
	xhr.onload = function() {
		Ti.App.data = eval(this.responseText);
	};
	xhr.send();
}

function enableNotifications(id, enable, row_object, context) {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not complete your request. Check your connection and try again.");
	} else {
		switch (context) {
			case "popular":
				Ti.App.myEggsDirty = true;
				Ti.App.documentsDirty = true;
				Ti.App.searchDirty = true;
				break;
			case "documents":
				Ti.App.myEggsDirty = true;
				Ti.App.popularDirty = true;
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
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		xhr.open("GET", serverURL + "/documents/enable_mobile/" + id + "/" + ((enable)?1:0));
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Cookie', Ti.App.Properties.getString('cookie'));
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
					row_object.row.children[2].image = 'images/download@2x.png';
					row_object.row.children[2].owned = false;	 				 	
				} else {
					updateCache();			
				}
			}
		}
		xhr.send();
	}	
}

function getLines(doc, context, listView) {
	// var currMem = Ti.Platform.availableMemory;
	// Ti.API.debug("Current memory: " + currMem);
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not complete your request. Check your connection and try again.");
	} else {
		renderLoading(listView, Ti.UI.currentWindow);
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		xhr.open("GET", serverURL + "/documents/" + doc + "/cards");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Cookie', Ti.App.Properties.getString('cookie'));
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status != 200) {
					loadingComplete(listView, Ti.UI.currentWindow);
					alert('That document has no cards to review!'); 
				}	
			}
		};	
		xhr.onload = function() {
			data = JSON.parse(this.responseText);
			if (data.cards.length < 1) {
				loadingComplete(listView, Ti.UI.currentWindow);
				alert('That document has no cards to review!'); 
			} else {
				var new_win = Ti.UI.createWindow({
					url : "updated_review.js",
					backgroundColor : '#dfdacd',
					navBarHidden : false,
					cards : data.cards,
					_parent : Titanium.UI.currentWindow,
					_context : "normal",
					orientationModes : [
						Titanium.UI.PORTRAIT
					],
					listView : listView,
					activityIndicator : activityIndicator
				});
				// Ti.App.tabGroup.hide();
				// activityIndicator.hide();
				new_win.open();
				// loadingComplete(listView, Ti.UI.currentWindow);
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
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Cookie', Ti.App.Properties.getString('cookie'));
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
		// if (trigger_dirty != false) {
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
		// }
		notesRows = [];
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		xhr.open("GET", serverURL + "/tags/claim_tag/" + id);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Cookie', Ti.App.Properties.getString('cookie'));
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status != 200) {	
					alert("Could not add that egg!");	
					if ( row_object.row.children[2].owned == true ) {
						var owned = false;
				    	var image = 'images/download@2x.png';
					} 
					row_object.row.children[2].owned = owned;
				 	row_object.row.children[2].image = image;
				} else {	
					updateCache();			
					if (Ti.App.Properties.getBool('download_educated') != true) {
						Ti.App.tabGroup.setActiveTab(0);						
						Ti.App.Properties.setBool('download_educated', true);
						// Ti.App.fireEvent('updateEggs');
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
		backgroundColor : '#dfdacd'
	}); 
	if (push == true) {
		var image = Ti.UI.createImageView({
			image : 'images/egg-feed@2x.png', 
	    	left : 5,
	    	touchEnabled : true,
	    	height : 60,
	    	width : 50,
			id : "egg"
		});				
	} else {
		var image = Ti.UI.createImageView({
			image : 'images/egg@2x.png', 
	    	left : 5,
	    	touchEnabled : true,
	    	height : 60,
	    	width : 50,
			id : "egg"
		});		
	} 
	var label= Ti.UI.createLabel({
		text : name, 
		left : 63
	});
	label.public_folder = public_folder;
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
		id : tagid,
		backgroundColor : '#dfdacd'
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
		backgroundColor : '#dfdacd'
	}); 
	if (push_enabled == 1) {
	    var image = Ti.UI.createImageView({
	    	image:'images/document-feed@2x.png',
	    	left: 5,
	    	touchEnabled:true,
	    	height:50,
	    	width:50,
	    	status:'unchecked',
	    	id : "doc",
	    	push : true
	    });				
	} else {
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
	}
	var label= Ti.UI.createLabel({
		text : name, 
		left : 58, 
		id : "label"
	});
	row.add(image);
	row.add(label);
	return row;
}

function createAddableNoteRow(name, docid, owned, push){
	if (push == true) {
	    var image = Ti.UI.createImageView({
	    	image:'images/document-feed@2x.png',
	    	left: 5,
	    	touchEnabled:true,
	    	height:50,
	    	width:50,
	    	push : true,
	    	status:'checked',
	    	id : "doc"    
	    });		
	} else {
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
	}
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
		backgroundColor : '#dfdacd',
		owned : owned
	}); 
	row.add(image);
	row.add(label);
	row.add(addButton);
	return row;
}

function retrieveAllNotifications() {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// Ti.App.reviewing = false;
		alert("Could not complete your request. Check your connection and try again.");
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		xhr.open("GET", serverURL + "/users/retrieve_notifications");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Cookie', Ti.App.Properties.getString('cookie'));
		xhr.onload = function() {
			data = JSON.parse(this.responseText);
			if (data.cards.length < 1) {
				// Ti.App.reviewing = false;
				Titanium.UI.iPhone.appBadge = 0;
				alert('You have no pending notifications!'); 
				Ti.App.fireEvent('updateNavBar');
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
				// Ti.App.reviewing = true;								
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
	xhr.setRequestHeader('Cookie', Ti.App.Properties.getString('cookie'));
	xhr.send(params);	
}

activityIndicator = Titanium.UI.createActivityIndicator({
	style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
});

function renderLoading(view, currentWindow) {
	var loadTimeout = function() {
		view.opacity = 1;
		activityIndicator.hide();
	};
    setTimeout(loadTimeout, 10000);

	view.opacity = .25;
	activityIndicator.show();
	currentWindow.add(activityIndicator);		
}

function loadingComplete(view, currentWindow) {
	view.opacity = 1;
	activityIndicator.hide();
	// currentWindow.remove(activityIndicator);
}