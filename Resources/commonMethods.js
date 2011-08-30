Ti.include('network.js');

function updateCache() {
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	xhr.open("GET", serverURL + "/tags/get_tags_json");//
	xhr.setRequestHeader('Content-Type', 'text/json');
	xhr.onload = function() {
		Ti.App.data = eval(this.responseText);
	};
	xhr.send();
}

function enableNotifications(id, enable, row_object, context) {
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
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// alert("Could not connect to StudyEgg. Check your Internet connection and try again.");
	// } else {
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		xhr.open("GET", serverURL + "/documents/enable_mobile/" + id + "/" + ((enable)?1:0));
		xhr.setRequestHeader('Content-Type', 'application/json');
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
				}
			}
		}
		xhr.send();
	// }	
}

function getCards(doc, context) {
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// reviewing = false;
		// alert("Could not retrieve your cards. Check your Internet connection and try again.");
	// } else {
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		// xhr.open("GET", serverURL + "/review/" + doc);
		xhr.open("GET", serverURL + "/documents/" + doc + "/cards");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			data = JSON.parse(this.responseText);
			if (data.cards.length < 1) {
				Ti.App.reviewing = false;
				win.close();
				alert('That document has no cards to review!'); 
				
			} else {
				renderReview(data);
			}
		};
		xhr.send();
	// }		
}

function getLines(doc, context, listView) {
	
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// reviewing = false;
		// alert("Could not retrieve your cards. Check your Internet connection and try again.");
	// } else {
		renderLoading(listView, Ti.UI.currentWindow);
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		// xhr.open("GET", serverURL + "/review/" + doc);
		xhr.open("GET", serverURL + "/documents/" + doc + "/cards");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			data = JSON.parse(this.responseText);
			if (data.cards.length < 1) {
				Ti.App.reviewing = false;
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
					// _context : "push",
					orientationModes : [
						Titanium.UI.PORTRAIT
					]
				});
				Ti.App.tabGroup.hide();
				new_win.open();
				loadingComplete(listView, Ti.UI.currentWindow);
			}
		};
		xhr.send();
	// }		
}

// function overflow() {
	// // alert('yo');
	// Ti.API.debug('son');
// }

function addDocument(id, row_object, context) {
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
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// reviewing = false;
		// alert("Could not add those notes. Check your Internet connection and try again.");
	// } else {
		notesRows = [];
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		xhr.open("GET", serverURL + "/documents/add_document/" + id);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status != 200) {	
					alert("Could not add that document!");	
					if ( row_object.row.children[2].owned == true ) {
						var owned = false;
				    	var image = 'images/plus@2x.png';
					} 
					// alert(JSON.stringify(row_object.row.children[2].image));
					row_object.row.children[2].owned = owned;
				 	row_object.row.children[2].image = image;
				} else {
					updateCache();
					// Ti.App.dirty = true;					
				}
			}
		}		
		xhr.send();
	// }	
}



function addEgg(id, row_object, context){
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
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// reviewing = false;
		// alert("Could not add those notes. Check your Internet connection and try again.");
	// } else {
		notesRows = [];
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		xhr.open("GET", serverURL + "/tags/add/" + id);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status != 200) {	
					alert("Could not add that egg!");	
					if ( row_object.row.children[2].owned == true ) {
						var owned = false;
				    	var image = 'images/plus@2x.png';
					} 
					// alert(JSON.stringify(row_object.row.children[2].image));
					row_object.row.children[2].owned = owned;
				 	row_object.row.children[2].image = image;
				} else {
					updateCache();
					// Ti.App.dirty = true;					
				}
			}
		}		
		xhr.send();
	// }	
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

function createAddableEggRow(name, docid, owned, push){
	if (push == true) {
	    var image = Ti.UI.createImageView({
	    	image:'images/egg-feed@2x.png',
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
	    	image:'images/egg@2x.png',
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
			image:'images/plus-fade@2x.png',
	    	right: 0,
	    	touchEnabled:true,
	    	height:45,
	    	width:45,
	    	owned : true,
	    	id : "owned"
		});				
	} else {
		var addButton = Ti.UI.createImageView({
			image:'images/plus@2x.png',
	    	right: 0,
	    	touchEnabled:true,
	    	height:45,
	    	width:45,
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
		id : "label",
		// font : {
			// fontSize:16, 
			// fontFamily  : 'Arial', 
			// fontFamily  : 'Geeza Pro'
		// }
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
			image:'images/plus-fade@2x.png',
	    	right: 0,
	    	touchEnabled:true,
	    	height:45,
	    	width:45,
	    	owned : true,
	    	id : "owned"
		});				
	} else {
		var addButton = Ti.UI.createImageView({
			image:'images/plus@2x.png',
	    	right: 0,
	    	touchEnabled:true,
	    	height:45,
	    	width:45,
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

function alertNotifications(){
	// alert("Alert notifications");
	var reviewAlert = Ti.UI.createAlertDialog({
	    title : 'You have new cards to review!',
	    message : "Go to them now?",
	    buttonNames : ["Later", "Review"],
	    cancel : 0
	});
	reviewAlert.addEventListener('click', function(f) {
		if (f.index == 1) { 
			// win.hide();
			retrieveAllNotifications();
		};
	});
	reviewAlert.show();		
}

function retrieveAllNotifications() {
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// reviewing = false;
		// alert("Could not retrieve your cards. Check your Internet connection and try again.");
	// } else {
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		xhr.open("GET", serverURL + "/users/retrieve_notifications");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			data = JSON.parse(this.responseText);
			// processNotifications(data);			
			if (data.cards.length < 1) {
				Ti.App.reviewing = false;
				Titanium.UI.iPhone.appBadge = 0;
				alert('You have no pending notifications!'); 
			} else {
				var new_win = Ti.UI.createWindow({
					url : "updated_review.js",
					// url : 'review.js',
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
	// }			
}

function processNotifications(data) {
	cards = [];
	for (i in data.cards) {
		Ti.API.debug("Prompt: " + data.cards[i].prompt + ", answer: " + data.cards[i].answer + ", mem: " + data.cards[i].mem);
		cards.push(createCard(data.cards[i].prompt, data.cards[i].answer, data.cards[i].mem));
	}
	if (cards.length < 1) {
		win.show();
		Titanium.UI.iPhone.appBadge = 0;
		alert("You have no pending notifications.");
	} else {
		Ti.App.tabGroup.visible = false;
		// win.nav.visible = false;
		// reviewing = false;
		var new_win = Ti.UI.createWindow({
			url : "updated_review.js",
			backgroundColor : '#dfdacd',
			navBarHidden : false,
			cards : cards,
			// nav : Ti.App.current_win.nav, 
			_parent : Ti.App.current_win,
			_context : "push",
			orientationModes : [
				Titanium.UI.PORTRAIT
			]
		});
		new_win.open();
		// Ti.App.current_win.nav.open(new_win);			
	}
}

function updateLogo() {
	if (Titanium.UI.iPhone.appBadge == 0) {
		win.titleControl.image = 'images/logo@2x.png'
	} else {
		win.titleControl.image = 'images/logo-indicator@2x.png'
	}
}

// function processData(data, context) {
	// cards = [];
	// for (i in data.cards) {
		// Ti.API.debug("Prompt: " + data.cards[i].prompt + ", answer: " + data.cards[i].answer + ", mem: " + data.cards[i].mem);
		// cards.push(createCard(data.cards[i].prompt, data.cards[i].answer, data.cards[i].mem));
		// if (context == "cache") {
			// return;
			// // alert("Caching doc!");
		// }
	// }
	// if (cards.length < 1) {
		// reviewing = false;
		// alert('That document has no cards to review!'); 
	// } else {		
		// Ti.App.tabGroup.visible = false;
		// var new_win = Ti.UI.createWindow({
			// url : "updated_review.js",
			// backgroundColor : '#dfdacd',
			// navBarHidden : false,
			// cards : cards,
			// _parent : Titanium.UI.currentWindow,
			// _context : "normal",
			// orientationModes : [
				// Titanium.UI.PORTRAIT
			// ]
		// });
		// Ti.App.reviewing = true;
		// new_win.open();
	// }
// }

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
	// alert(context);
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	var params = {
		'user[email]' : email,
		'user[password]' : password
	};
	//TODO user is logged out when receives push
	// xhr.onreadystatechange = function() {
		// if (this.readyState == 4) {
			// if ( this.status != 200 ) { 
				// Ti.App.Properties.setBool('notification', true);
			// }
		// }
	// };
	xhr.onload = function() {
		if (context == "push") {
			retrieveAllNotifications();
		}
	};
	xhr.open("POST", serverURL + "/users/sign_in");
	xhr.send(params);	
}

activityIndicator = Titanium.UI.createActivityIndicator({
	style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
});

function renderLoading(view, currentWindow) {
	view.opacity = .25;
	activityIndicator.show();
	currentWindow.add(activityIndicator);		
}

function loadingComplete(view, currentWindow) {
	view.opacity = 1;
	activityIndicator.hide();
	currentWindow.remove(activityIndicator);
}