var serverURL = 'http://localhost:3000';
// var serverURL = 'http://192.168.2.20:3000';
// var serverURL = 'http://192.168.3.148:3000';
// var serverURL = 'http://ec2-204-236-227-202.compute-1.amazonaws.com'
// var serverURL = 'http://192.168.0.101:3000';
// var serverURL = 'http://studyegg.com';

Ti.include('helperMethods.js');

function renderLogin() {
	var win = Ti.UI.createWindow({
		url:"login.js",
		navBarHidden : true,
		backgroundColor : '#dfdacd',
		orientationModes : [
			Titanium.UI.PORTRAIT,
			Titanium.UI.UPSIDE_PORTRAIT
		]
	});
	win.open();
}

// Authentication
function authenticate(email, password, context) {
	// renderLogin();
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				// alert("Login success");
				// emailField.blur();
				// passwordField.blur();
				// renderLogin();
				authSuccess(email, password);
				// Ti.App.Properties.setBool('active', true);
			} else {			
				if (context != "start") {
					alert("Invalid email/password combination.");	
				} else {
					var win = Ti.UI.createWindow({
						url:"login.js",
						navBarHidden : true,
						backgroundColor : '#dfdacd',
						orientationModes : [
							Titanium.UI.PORTRAIT,
							Titanium.UI.UPSIDE_PORTRAIT
						]
					});
					win.open();	
				}
			}
		}
	};
	var params = {
		'user[email]' : email,
		'user[password]' : password
	};
	xhr.open("POST", serverURL + "/users/sign_in");
	xhr.send(params);
}

function signOut() {
	// checkLoggedIn();
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// alert("Could not log you out. Check your Internet connection and try again.");
	// } else {
		xhr = Ti.Network.createHTTPClient();
		xhr.open("GET", serverURL + "/users/sign_out");
		xhr.setRequestHeader('Content-Type', 'text/html');
		xhr.send();
		
		Ti.App.Properties.removeProperty('email');
		Ti.App.Properties.removeProperty('password');
		
		Ti.App.Properties.setBool('active', false);
		Titanium.UI.orientation = Titanium.UI.PORTRAIT;
		// Ti.App.current_win = win._parent;
		renderLogin();
		tabGroup.close();
		
		//TODO not working
		Ti.App.removeEventListener('resume', null);
		Ti.App.removeEventListener('resumed', null);
		Ti.App.removeEventListener('pause', null);
		// Ti.App.tabGroup.close();
		// win.close();
		// win.nav.close(win);		
		// Ti.App.base_window.show();
	// }
}

function reLogUser(email, password, context) {
	alert(context);
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	var params = {
		'user[email]' : email,
		'user[password]' : password
	};
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if ( this.status != 200 ) { 
				Ti.App.Properties.setBool('notification', true);
			}
		}
	};
	xhr.onload = function() {
		if (context == "push") {
			retrieveAllNotifications();
		}
	};
	xhr.open("POST", serverURL + "/users/sign_in");
	xhr.send(params);	
}



function signUp(email, password) {
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {		
				Ti.App.Properties.setString('email', email);
				Ti.App.Properties.setString('password', password);	
				Ti.App.Properties.setBool('educated', false);			
				// authenticate(email, password);
				authSuccess(email, password);
				emailField.value = "";
				passwordField.value = "";
				confirmPasswordField.value = "";
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
	xhr.send(params);	
}


// Data
function getFolders(context) {
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// alert("Could not retrieve your folders. Check your Internet connection and try again.");
	// } else {
		rows = [];
		if (Ti.App.data != null) {
			for (i in Ti.App.data) {
				var pushFlag = false;
				for ( j in Ti.App.data[i].tag.documents) {
					if (pushFlag == true ) {
						break;
					}
					// alert(JSON.stringify(Ti.App.data[i].tag.documents[j].userships[0].push_enabled));
					if (Ti.App.data[i].tag.documents[j].userships[0].push_enabled == true ){
						pushFlag = true;
					}
				}

				rows.push(createFolderRow(Ti.App.data[i].tag.name, Ti.App.data[i].tag.id, false, pushFlag));
			}
			if (context != "update") {
				renderFolders(rows);
			}			
		} else {
			alert("NOT using cache");
			xhr = Ti.Network.createHTTPClient();
			xhr.setTimeout(1000000);
			// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
			xhr.open("GET", serverURL + "/tags/get_tags_json");//
			xhr.setRequestHeader('Content-Type', 'text/json');
			xhr.onload = function() {
				foldersData = eval(this.responseText);	
				for (i in foldersData) {
					folderRows.push(createFolderRow(foldersData[i].tag.name, foldersData[i].tag.id, false));
				}
				// folderRows.push(createFolderRow("Public", (folderRows.length + 1), true));
				renderFolders(folderRows);
			};
			xhr.send();	
		}
	// }
}

function updateEggs() {
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
	xhr.open("GET", serverURL + "/tags/get_tags_json");
	xhr.setRequestHeader('Content-Type', 'text/json');
	xhr.onload = function() {
		foldersData = eval(this.responseText);
		rows = [];		
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
		setEggsList(rows);
	};
	xhr.send();			
}

function getNotes(element) {
	// alert(element.row.id);
	var newWin = Ti.UI.createWindow({
		url : "notes.js",
		selection : element.row.id,
		row : element,
		barColor : '#0066b2',
		// data : notesRows,
		// nav : win.nav,
		_parent: Titanium.UI.currentWindow,
		exitOnClose: true
	});
	Titanium.UI.currentTab.open(newWin, {animated:true});	
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// alert("Could not retrieve your notes. Check your Internet connection and try again.");
	// } else {
		// notesRows = [];
		// if (Ti.App.data != null) {
			// for ( i in Ti.App.data ) {
				// if (Ti.App.data[i].tag.id == element.row.id) {					
					// for (n in Ti.App.data[i].tag.documents) {
						// notesRows.push(createNoteRow(Ti.App.data[i].tag.documents[n].name, Ti.App.data[i].tag.documents[n].id, Ti.App.data[i].tag.documents[n].tag_id, Ti.App.data[i].tag.documents[n].userships[0].push_enabled));
					// }
				// }
			// }
		// }
// 		
		// setDocumentsList(notesRows);
			// if ( notesRows.length >= 1 ) {
				// var newWin = Ti.UI.createWindow({
					// url : "notes.js",
					// selection : element.row.id,
					// row : element,
					// barColor : '#0066b2',
					// data : notesRows,
					// nav : win.nav,
					// _parent: Titanium.UI.currentWindow,
					// exitOnClose: true
				// });
				// Titanium.UI.currentTab.open(newWin, {animated:true});
			// } else {
				// alert("That folder has no documents!");
			// }				
		// } else {
			// alert("NOT using cache");
			// xhr = Ti.Network.createHTTPClient();
			// xhr.setTimeout(1000000);
			// // xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
			// xhr.open("GET", serverURL + "/tags/get_tags_json");
			// xhr.setRequestHeader('Content-Type', 'text/json');
			// xhr.onload = function() {
				// foldersData = eval(this.responseText);
				// // alert(foldersData);
				// for ( i in foldersData ) {
					// if (foldersData[i].tag.id == element.row.id) {
						// for (n in foldersData[i].tag.documents) {
							// notesRows.push(createNoteRow(foldersData[i].tag.documents[n].name, foldersData[i].tag.documents[n].id, foldersData[i].tag.documents[n].tag_id));
						// }
					// }
				// }	
				// if ( notesRows.length >= 1 ) {
					// // alert("Window");
					// var newWin = Ti.UI.createWindow({
						// url : "notes.js",
						// // navBarHidden : false,
						// selection : element,
						// barColor : '#0066b2',
						// data : notesRows,
						// nav : win.nav,
						// _parent: Titanium.UI.currentWindow,
						// exitOnClose: true
					// });
					// // win.nav.open(newWin);
					// // Titanium.UI.currentTab.open(newWin);
					// Titanium.UI.currentTab.open(newWin, {animated:true});
				// } else {
					// alert("That folder has no documents!");
				// }		
			// };
			// xhr.send();			
		// }
	// }
}

function updateDocuments(element) {
	notesRows = [];
	if (Ti.App.data != null) {
		for ( i in Ti.App.data ) {
			if (Ti.App.data[i].tag.id == element) {					
				for (n in Ti.App.data[i].tag.documents) {
					notesRows.push(createNoteRow(Ti.App.data[i].tag.documents[n].name, Ti.App.data[i].tag.documents[n].id, Ti.App.data[i].tag.documents[n].tag_id, Ti.App.data[i].tag.documents[n].userships[0].push_enabled));
				}
			}
		}
		setDocumentsList(notesRows);
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
		xhr.open("GET", serverURL + "/tags/get_tags_json");
		xhr.setRequestHeader('Content-Type', 'text/json');
		xhr.onload = function() {
			foldersData = eval(this.responseText);
			for ( i in foldersData ) {
				if (foldersData[i].tag.id == element) {
					for (n in foldersData[i].tag.documents) {
						notesRows.push(createNoteRow(foldersData[i].tag.documents[n].name, foldersData[i].tag.documents[n].id, foldersData[i].tag.documents[n].tag_id, foldersData[i].tag.documents[n].userships[0].push_enabled));
					}
				}
			}
			setDocumentsList(notesRows);	
		}
		xhr.send();			
	}	
}

function getLines(doc, context) {
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
			processData(data, context);
		};
		xhr.send();
	// }		
}

function getPublicDocs(element){
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// reviewing = false;
		// alert("Could not retrieve those notes. Check your Internet connection and try again.");
	// } else {
		notesRows = [];
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		xhr.open("GET", serverURL + "/documents/get_public_documents");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			foldersData = eval(this.responseText);
			for ( i in foldersData ) {
				notesRows.push(createNoteRow(foldersData[i].document.name, foldersData[i].document.id, foldersData[i].document.tag_id));
			}	
			if ( notesRows.length >= 1 ) {
				var newWin = Ti.UI.createWindow({
					url : "notes.js",
					navBarHidden : false,
					selection : element,
					barColor : '#0066b2',
					data : notesRows,
					nav : win.nav,
					_parent: Titanium.UI.currentWindow,
					exitOnClose: true
				});
				win.nav.open(newWin);
			} else {
				alert("That folder has no documents!");
			}		
		};
		xhr.send();
	// }		
}

function getRecentDocs() {
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// reviewing = false;
		// alert("Could not retrieve recent documents. Check your Internet connection and try again.");
	// } else {
		notesRows = [];
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		xhr.open("GET", serverURL + "/tags/get_recent_json");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			// foldersData = Ti.App.data;
			foldersData = eval(this.responseText);
			for ( i in foldersData ) {
				notesRows.push(createNoteRow(foldersData[i].document.name, foldersData[i].document.id, foldersData[i].document.tag_id));
			}
			renderRecent();	
		};
		xhr.send();
	// }
}

function updateRecent() {
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// reviewing = false;
		// alert("Could not retrieve recent documents. Check your Internet connection and try again.");
	// } else {
		notesRows = [];
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		xhr.open("GET", serverURL + "/tags/get_recent_json");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			recentData = eval(this.responseText);
			setRecentList(recentData);
		};
		xhr.send();
	// }	
}

function getInterestingEggs(){
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// reviewing = false;
		// alert("Could not retrieve those notes. Check your Internet connection and try again.");
	// } else {
		notesRows = [];
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		xhr.open("GET", serverURL + "/documents/get_public_documents");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			// alert(JSON.stringify(Ti.App.data));
			foldersData = eval(this.responseText);
			// alert(JSON.stringify(foldersData));
			// for ( i in foldersData ) {
				// notesRows.push(createAddableNoteRow(foldersData[i].document.name, foldersData[i].document.id));
			// }	
			setPopularResults(foldersData);
			// renderInteresing();
		};
		xhr.send();
	// }		
}

function addDocument(id, row_object) {
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
				    	var image = 'images/close.png';
					} 
					alert(JSON.stringify(row_object.row.children[2].image));
					row_object.row.children[2].owned = owned;
				 	row_object.row.children[2].image = image;
				} else {
					updateCache();
					Ti.App.myEggsDirty = true;
					Ti.App.documentsDirty = true;
					Ti.App.popularDirty = true;
					Ti.App.searchDirty = true;
					// Ti.App.dirty = true;					
				}
			}
		}		
		// xhr.onreadystatechange = function() {
			// if (this.readyState == 4) {
				// if (this.status != 200) {		
					// alert("Could not add that document!");
				// } else {
					// Ti.App.dirty = true;
					// // alert("Change icon style");
					// updateCache();
					// // Ti.App.folders.push(createFolderRow("Yoooo", 1111, false));
				// }
			// }
		// }
		xhr.send();
	// }	
}


// Notifications
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
			processNotifications(data);
		};
		xhr.send();
	// }			
}

function attemptAutoLogin() {
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// alert("Could not log you in. Check your Internet connection and try again.");
	// } else {
		if (Ti.App.Properties.getString('email') != '' && Ti.App.Properties.getString('email') != null) {
			authenticate(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'));
		}
	// }
}

function enableNotifications(id, enable, row_object) {
	// alert("Enable");
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// alert("Could not connect to StudyEgg. Check your Internet connection and try again.");
	// } else {
		// alert(Ti.App.data);
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
					// alert(JSON.stringify(Ti.App.data));
					updateCache();
					// alert(JSON.stringify(Ti.App.data));
					Ti.App.myEggsDirty = true;
					Ti.App.documentsDirty = true;
					Ti.App.popularDirty = true;
					Ti.App.searchDirty = true;
					// Ti.App.dirty = true;					
				}
			}
		}
		xhr.send();
	// }	
}


// Misc Network
function updateCache(context) {
	// alert("Updating cache");
	// alert(context);
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
	xhr.open("GET", serverURL + "/tags/get_tags_json");//
	xhr.setRequestHeader('Content-Type', 'text/json');
	xhr.onload = function() {
		// alert(Ti.App.data);
		Ti.App.data = eval(this.responseText);
		// alert(Ti.App.data);
		// dataHash = {};
		// for (i in Ti.App.data) {
			// dataHash[Ti.App.data[i].tag.id] = [];
			// for (j in Ti.App.data[i].tag.documents){
				// dataHash[Ti.App.data[i].tag.id].push(Ti.App.data[i].tag.documents[j].id);
			// }
		// }
		// alert(dataHash);

		// Ti.App.eggs = [];
		// tmp = [];
		// Ti.App.documents = [];
		// // alert(test.length);
		// alert(Ti.App.eggList.length);
		// for (i in Ti.App.data) {
			// alert(Ti.App.data[i].tag.name);
			// alert(Ti.App.data[i].tag.id);
			// tmp.push(createFolderRow(Ti.App.data[i].tag.name, Ti.App.data[i].tag.id, false));
			// alert(Ti.App.data[i]);
			// alert(Ti.App.data[i].tag.name);
		// }
		// Ti.App.eggList = tmp;
		// alert(JSON.stringify(Ti.App.eggList));
		// for (i in Ti.App.eggList) {
			// alert(JSON.stringify(Ti.App.eggList[i]));
		// }
		// Ti.App.eggList[0] = "Yooo"
		// alert(JSON.stringify(Ti.App.eggList[0]));
		// alert(Ti.App.eggList);
		// alert(JSON.stringify(tmp));
		// Ti.App.Properties.setList('test', test);
		// alert("Incoming:");
		// alert(Titanium.App.Properties.getList('test'));
		// Ti.App.eggList = tmp;
		// alert(Ti.App.eggList.length);
		
		if (context == "login") {
			getFolders();
		}		
	
		// } else if (context == "update") {
			// getFolders("update");
		// }
	};
	xhr.send();
}

function searchQuery(text) {
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	// xhr.onreadystatechange = function() {
		// if (this.readyState == 4) {
			// if (this.status == 200) {		
				// Ti.App.Properties.setString('email', email);
				// Ti.App.Properties.setString('password', password);				
				// // authenticate(email, password);
				// authSuccess(email, password);
				// emailField.value = "";
				// passwordField.value = "";
				// confirmPasswordField.value = "";
			// } else {
				// alert("Could not create your account... Did you enter your email address correctly?");
			// }
		// }
	// };
	xhr.onload = function() {
		results = eval(this.responseText);
		// alert(foldersData);
		setSearchResults(results);
	}
	var params = {
		'q' : text,
	};
	xhr.open("POST", serverURL + "/search/full_query");
	xhr.send(params);		
}

function cacheCards() {
	for (i in Ti.App.data) {
		for (j in Ti.App.data[i].tag.documents) {
			getLines(Ti.App.data[i].tag.documents[j].id, "cache");
		}
	}
}

function reportGrade(memID, confidence) {
	var gradeValues = {
		4 : 9,
		3 : 6, 
		2 : 4, 
		1 : 1	
	};
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	xhr.open("POST", serverURL + "/mems/update/" + memID + "/" + gradeValues[confidence]  + "/0");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		Ti.API.debug('Posted confidence ' + gradeValues[confidence] + ' to ' + memID);
		Titanium.UI.iPhone.appBadge = Titanium.UI.iPhone.appBadge - 1;
	};
	xhr.send();
}

function registerDevice(token) {
	// if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		// alert("Could not register your device with StudyEgg.");
	// } else {
		xhr = Ti.Network.createHTTPClient();
		xhr.open("POST", serverURL + "/users/add_device/" + token);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			Ti.API.debug('Added device with token' + token);
		};
		xhr.send();
	// }
}


// Utility
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
		left : 60
	});
	
	label.public_folder = public_folder;
	row.add(image);
	row.add(label);
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
		left : 55, 
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
			image:'images/folder.png',
	    	right: 0,
	    	touchEnabled:true,
	    	height:50,
	    	width:50,
	    	owned : true,
	    	id : "owned"
		});				
	} else {
		var addButton = Ti.UI.createImageView({
			image:'images/close.png',
	    	right: 0,
	    	touchEnabled:true,
	    	height:50,
	    	width:50,
	    	owned : false,
	    	id : "add"
		});		
	}
	var label= Ti.UI.createLabel({
		text : name, 
		left : 53,
		width : 220,
		id : "label"
	});
	var row = Ti.UI.createTableViewRow({ 
		id : docid,
		backgroundColor : '#dfdacd'
		// hasDetail : true
		// rightImage : 'images/close.png'
	}); 
	
	row.add(image);
	row.add(label);
	row.add(addButton);
	return row;
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

		win.nav.visible = false;
		reviewing = false;
		var new_win = Ti.UI.createWindow({
			url : "review.js",
			backgroundColor : '#dfdacd',
			navBarHidden : true,
			cards : cards,
			nav : Ti.App.current_win.nav, 
			_parent : Ti.App.current_win,
			_context : "push",
			orientationModes : [
				Titanium.UI.LANDSCAPE_LEFT,
				Titanium.UI.LANDSCAPE_RIGHT
			]
		});
		Titanium.UI.orientation = Titanium.UI.LANDSCAPE_RIGHT;
		Ti.App.current_win.nav.open(new_win);			
	}
}

function processData(data, context) {

	// alert(win.nav.name);
	cards = [];
	for (i in data.cards) {
		Ti.API.debug("Prompt: " + data.cards[i].prompt + ", answer: " + data.cards[i].answer + ", mem: " + data.cards[i].mem);
		cards.push(createCard(data.cards[i].prompt, data.cards[i].answer, data.cards[i].mem));
		if (context == "cache") {
			return;
			// alert("Caching doc!");
		}
	}
	if (cards.length < 1) {
		reviewing = false;
		alert('That document has no cards to review!'); 
	} else {		
		Ti.App.tabGroup.visible = false;

		// win.nav.visible = false;
		reviewing = false;
		var new_win = Ti.UI.createWindow({
			url : "review.js",
			backgroundColor : '#dfdacd',
			navBarHidden : true,
			cards : cards,
			// nav : win.nav, 
			_parent : Titanium.UI.currentWindow,
			// _parent : Ti.App.base_window,
			_context : "normal",
			orientationModes : [
				Titanium.UI.LANDSCAPE_LEFT,
				Titanium.UI.LANDSCAPE_RIGHT
			]
		});
		// tabGroup.activeTab.open(new_win);
		Titanium.UI.orientation = Titanium.UI.LANDSCAPE_RIGHT;
		Ti.App.reviewing = true;
		// win.close(Ti.App.base_window);
		// alert(Ti.App.base_window.name);
		// alert(Ti.App.base_window);
		// win.nav.hide(Ti.App.current_win);
		// Ti.App.base_window.nav.open(new_win);
		new_win.open();
		// win.open(new_win);
		// win.nav.open(new_win);	
		// alert(Ti.App.current_win);
		// alert(Ti.App.current_win.name);
		// Ti.App.current_win.nav.open(new_win);
		// Titanium.UI.currentTab.open(new_win);
	}
}
	
function authSuccess(email, password) {
	// updateCache("login");
	// alert(email);
	// alert(password);
	Ti.App.Properties.setString('email', email);
	Ti.App.Properties.setString('password', password);
	registerDevice(Ti.App.Properties.getString("token"));
	// win.close();
	// container.close();
	
	Ti.include('browser.js');
	// win.close();
	// newWin.close();

	// var newWin = Ti.UI.createWindow({
		// url : 'browser.js',
		// // navBarHidden : false,
		// barColor : '#000',
		// nav : win.nav,
		// _parent: Titanium.UI.currentWindow,
		// orientationModes : [
			// Titanium.UI.PORTRAIT,
			// Titanium.UI.UPSIDE_PORTRAIT,
			// // Titanium.UI.LANDSCAPE_LEFT,
			// // Titanium.UI.LANDSCAPE_RIGHT
		// ]
	// });
	// win.nav.open(newWin);
	
	// emailField.blur();
	// passwordField.blur();
	// Ti.App.base_window = win;
	// win.hide();
	
	// container.close();
	// activityIndicator.hide();	
}
	
	
	
	
	
	// reviewLineIDs = []
// 	
	// //TODO date checking for mems!
	// // var currentDate = new Date();
	// // for ( i in data["lines"] ) {
		// // if ( data["lines"][i].line.mems[0].review_after == null ) {
			// // reviewLineIDs.push({
				// // domid : data["lines"][i].line.domid,
				// // mem_id : data["lines"][i].line.mems[0].id
			// // });
		// // } else {
			// // var memDate = new Date();
			// // // Ti.API.debug(data["lines"][i].line.mems[0].review_after);
			// // var dateTimeSet = data["lines"][i].line.mems[0].review_after.split("T")
// // 			
			// // var date = dateTimeSet[0];
			// // var time = dateTimeSet[1];
			// // var dateSet = date.split("-");
			// // var timeSet = time.replace("Z", "").split(":");
// // 	
			// // memDate.setYear(dateSet[0]);
			// // memDate.setMonth(dateSet[1]-1);
			// // memDate.setDate(dateSet[2]);
			// // memDate.setHours(timeSet[0]);
			// // memDate.setMinutes(timeSet[1]);
			// // memDate.setSeconds(timeSet[2]);		
// // 			
			// // if ( memDate < currentDate || memDate == null) {
				// // reviewLineIDs.push({
					// // domid : data["lines"][i].line.domid,
					// // mem_id : data["lines"][i].line.mems[0].id
				// // });
			// // }			
		// // }		
	// // }
	// for ( i in data["lines"] ) {
		// reviewLineIDs.push({
			// domid : data["lines"][i].line.domid,
			// mem_id : data["lines"][i].line.mems[0].id
		// });
	// }
	// var xml = replaceAll("<wrapper>" + data["document"].document.html + "</wrapper>", "&nbsp;", " ");
	// xml = replaceAll(replaceAll(xml, "<br>", " "), "&ndash;", "-");
	// var dom = Ti.XML.parseString(xml);
	// cards = [];
	// for ( i in reviewLineIDs ) {
		// var element = dom.getElementById(reviewLineIDs[i]["domid"]);
		// var text = element.firstChild.nodeValue;
		// if (text == null || text == undefined) { continue; }
		// text = text.split(" -");
		// if ( typeof(text) == 'string' ) { text = text.split("- "); }
		// if ( text.length == 1 ) { 
			// continue; 
		// } else { cards.push(createCard(trim(text[0]), trim(text[1]), reviewLineIDs[i]["mem_id"])); }
	// }
	// if ( cards.length > 0 ) {
		// reviewing = false;
		// var new_win = Ti.UI.createWindow({
			// url : "review.js",
			// navBarHidden : true,
			// reviewContext : context,
			// //list : reviewList,
			// cards : cards,
			// _context : "normal",
			// nav : win.nav, 
			// _parent: Titanium.UI.currentWindow,
			// //TODO need this?
			// //folder : win.data,
			// orientationModes : [
				// Titanium.UI.LANDSCAPE_LEFT,
				// Titanium.UI.LANDSCAPE_RIGHT
			// ]
		// }); 
		// // win.nav.hide(win);
		// // new_win.open();
		// win.nav.open(new_win);			
// 
	// } else { 
		// reviewing = false;
		// alert('That document has no cards to review!'); 
	// }
