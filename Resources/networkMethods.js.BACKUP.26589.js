var serverURL = 'http://localhost:3000';
// var serverURL = 'http://192.168.2.20:3000';
var serverURL = 'http://192.168.3.148:3000';
// var serverURL = 'http://ec2-204-236-227-202.compute-1.amazonaws.com'
// var serverURL = 'http://192.168.0.101:3000';
// var serverURL = 'http://studyegg.com'

Ti.include('helperMethods.js');


// Authentication
function authenticate(email, password) {
	// renderLogin();
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				authSuccess(email, password);
				updateCache();
				Ti.App.Properties.setBool('active', true);
			} else {
				alert("Invalid email/password combination.");
			}
		}
	}	;
	var params = {
		'user[email]' : email,
		'user[password]' : password
	};
	xhr.open("POST", serverURL + "/users/sign_in");
	xhr.send(params);
}

function reLogUser(email, password, context) {
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

function signOut() {
	// checkLoggedIn();
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not log you out. Check your Internet connection and try again.");
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.open("GET", serverURL + "/users/sign_out");
		xhr.setRequestHeader('Content-Type', 'text/html');
		xhr.send();
		
		Ti.App.Properties.removeProperty('email');
		Ti.App.Properties.removeProperty('password');
		
		Ti.App.Properties.setBool('active', false);
		// alert(Ti.App.Properties.getBool('active'));
		Titanium.UI.orientation = Titanium.UI.PORTRAIT;
		Ti.App.current_win = win._parent;
		win.nav.close(win);		
	}
}


// Data
function getFolders() {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not retrieve your folders. Check your Internet connection and try again.");
	} else {
<<<<<<< HEAD
		if (Ti.App.data != null) {	
			for (i in Ti.App.data) {
				folderRows.push(createFolderRow(Ti.App.data[i].tag.name, Ti.App.data[i].tag.id));
			}
			renderFolders();			
		} else {
			xhr = Ti.Network.createHTTPClient();
			xhr.setTimeout(1000000);
			// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
			xhr.open("GET", serverURL + "/tags/get_tags_json");//
			xhr.setRequestHeader('Content-Type', 'text/json');
			xhr.onload = function() {
				foldersData = eval(this.responseText);	
				for (i in foldersData) {
					folderRows.push(createFolderRow(foldersData[i].tag.name, foldersData[i].tag.id));
				}
				renderFolders();
			};
			xhr.send();	
		}
=======
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
			folderRows.push(createFolderRow("Public", (folderRows.length + 1), true));
			renderFolders();
		};
		xhr.send();
>>>>>>> sign_up
	}
}

function getNotes(element) {	
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not retrieve your notes. Check your Internet connection and try again.");
	} else {
		notesRows = [];
		if (Ti.App.data != null) {
			for ( i in Ti.App.data ) {
				if (Ti.App.data[i].tag.id == element.row.id) {
					for (n in Ti.App.data[i].tag.documents) {
						notesRows.push(createNoteRow(Ti.App.data[i].tag.documents[n].name, Ti.App.data[i].tag.documents[n].id));
					}
				}
			}	
			if ( notesRows.length >= 1 ) {
				var newWin = Ti.UI.createWindow({
					url : "notes.js",
					navBarHidden : false,
					selection : element,
					barColor : '#000',
					data : notesRows,
					nav : win.nav,
					_parent: Titanium.UI.currentWindow,
					exitOnClose: true
				});
				win.nav.open(newWin);
			} else {
				alert("That folder has no documents!");
			}				
		} else {
			xhr = Ti.Network.createHTTPClient();
			xhr.setTimeout(1000000);
			// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
			xhr.open("GET", serverURL + "/tags/get_tags_json");
			xhr.setRequestHeader('Content-Type', 'text/json');
			xhr.onload = function() {
				foldersData = eval(this.responseText);
				for ( i in foldersData ) {
					if (foldersData[i].tag.id == element.row.id) {
						for (n in foldersData[i].tag.documents) {
							notesRows.push(createNoteRow(foldersData[i].tag.documents[n].name, foldersData[i].tag.documents[n].id));
						}
					}
				}	
				if ( notesRows.length >= 1 ) {
					var newWin = Ti.UI.createWindow({
						url : "notes.js",
						navBarHidden : false,
						selection : element,
						barColor : '#000',
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
		}
	}
}

function getLines(doc, context) {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		reviewing = false;
		alert("Could not retrieve your cards. Check your Internet connection and try again.");
	} else {
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
	}		
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
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		reviewing = false;
		alert("Could not retrieve your cards. Check your Internet connection and try again.");
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		xhr.open("GET", serverURL + "/users/retrieve_notifications");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			data = JSON.parse(this.responseText);
			processNotifications(data);
		};
		xhr.send();
	}			
}


// Misc Network
function updateCache() {
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
	xhr.open("GET", serverURL + "/tags/get_tags_json");//
	xhr.setRequestHeader('Content-Type', 'text/json');
	xhr.onload = function() {
		rawData = eval(this.responseText);
		// folders = [];
		// notes = [];
		// for (i in rawData) {
			// folders.push({"name" : rawData[i].tag.name,
						  // "tag_id" : rawData[i].tag.id});
			// notes.push({"folder" : rawData[i].tag.name, 
						// "documents" : []});		
			// for (j in rawData[i].tag.documents) {
				// notes
				// notes[rawData[i].tag.name].push(rawData[i].tag.documents[j].name);
			// }
		// }
		// Ti.App.folders = folders;
		// Ti.App.notes = notes;
		Ti.App.data = rawData
	};

	xhr.send();
}

function reportGrade(memID, confidence) {
	//Should confidence be converted using this?
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
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not register your device with StudyEgg.");
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.open("POST", serverURL + "/users/add_device/" + token);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			Ti.API.debug('Added device with token' + token);
		};
		xhr.send();
	}
}


// Utility
function createNoteRow(name, docid){
	var row = Ti.UI.createTableViewRow({ id : docid}); 
    var image = Ti.UI.createImageView({
    	image:'images/unchecked.png',
    	left: 15,
    	touchEnabled:true,
    	height:25,
    	width:25,
    	status:'unchecked'
    });
	
	var label= Ti.UI.createLabel({
		text:name, 
		left:53
	});
	
	row.add(image);
	row.add(label);
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
		// alert("Bro");
		var new_win = Ti.UI.createWindow({
			url : "review.js",
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
	cards = [];
	for (i in data.cards) {
		Ti.API.debug("Prompt: " + data.cards[i].prompt + ", answer: " + data.cards[i].answer + ", mem: " + data.cards[i].mem);
		cards.push(createCard(data.cards[i].prompt, data.cards[i].answer, data.cards[i].mem));
	}
	if (cards.length < 1) {
		reviewing = false;
		alert('That document has no cards to review!'); 
	} else {
		reviewing = false;
		var new_win = Ti.UI.createWindow({
			url : "review.js",
			navBarHidden : true,
			cards : cards,
			nav : win.nav, 
			_parent : Titanium.UI.currentWindow,
			_context : "normal",
			orientationModes : [
				Titanium.UI.LANDSCAPE_LEFT,
				Titanium.UI.LANDSCAPE_RIGHT
			]
		});
		
		// Ti.App.fireEvent('orientationchange', {currentOrientation:Titanium.UI.LANDSCAPE_RIGHT});
		Titanium.UI.orientation = Titanium.UI.LANDSCAPE_RIGHT;
		// adjustViews();
		// win.hide();
		win.nav.open(new_win);			
	}
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
<<<<<<< HEAD
=======

function createCard(prompt, answer, memID) {
	var card = new Object();
	card.prompt = prompt;
	card.answer = answer;
	card.flipped = false;
	card.grade = 0;
	card.memID = memID;
	return card;
}

function reportGrade(memID, confidence) {
	//Should confidence be converted using this?
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

function signOut() {
	// checkLoggedIn();
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not log you out. Check your Internet connection and try again.");
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.open("GET", serverURL + "/users/sign_out");
		xhr.setRequestHeader('Content-Type', 'text/html');
		xhr.send();
		
		Ti.App.Properties.removeProperty('email');
		Ti.App.Properties.removeProperty('password');
		
		Ti.App.Properties.setBool('active', false);
		// alert(Ti.App.Properties.getBool('active'));
		Titanium.UI.orientation = Titanium.UI.PORTRAIT;
		win.nav.close(win);		
	}
}

function signUp(email, password) {
	// alert("Reglogging user");
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	var params = {
		'user[email]' : email,
		'user[password]' : password
	};
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if ( this.status != 200 ) { 
				// Ti.App.Properties.setBool('notification', true);
			}
		}
	};

	xhr.open("POST", serverURL + "/users/sign_up");
	xhr.send(params);	
}

function getPublicDocs(element){
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		reviewing = false;
		alert("Could not retrieve these notes. Check your Internet connection and try again.");
	} else {
		notesRows = [];
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		xhr.open("GET", serverURL + "/documents/get_public_documents");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			foldersData = eval(this.responseText);
			alert(foldersData);
			for ( i in foldersData ) {
				notesRows.push(createNoteRow(foldersData[i].document.name, foldersData[i].document.id));
			}	
			if ( notesRows.length >= 1 ) {
				var newWin = Ti.UI.createWindow({
					url : "notes.js",
					navBarHidden : false,
					selection : element,
					barColor : '#000',
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
	}		
}

function registerDevice(token) {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not register your device with StudyEgg.");
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.open("POST", serverURL + "/users/add_device/" + token);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			Ti.API.debug('Added device with token' + token);
		};
		xhr.send();
	}
}
>>>>>>> sign_up
