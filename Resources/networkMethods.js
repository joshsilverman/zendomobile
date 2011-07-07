// serverURL = 'http://localhost:3000';
// serverURL = 'http://192.168.2.35:3000'
serverURL = 'http://zen.do'

function authenticate(email, password) {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not log you in. Check your Internet connection and try again.");
	} else {
		renderLogin();
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					authSuccess(email, password);
				} else {
					activityIndicator.hide();
					alert("Could not connect to your account!");
				}
			}
		}	
		// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
		var params = {
			'user[email]' : email,
			'user[password]' : password
		}
		xhr.open("POST", serverURL + "/users/sign_in");
		xhr.send(params);
	}
}

function getFolders() {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not retrieve your folder. Check your Internet connection and try again.");
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
			render();
		}	
		xhr.send();
	}
}

function getNotes(element) {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not retrieve your notes. Check your Internet connection and try again.");
	} else {
		notesRows = [];
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
					data : notesRows,
					nav : win.nav,
					_parent: Titanium.UI.currentWindow,
					exitOnClose: true
				});
				win.nav.open(newWin);
			} else {
				alert("That folder has no documents!");
			}		
		}	
		xhr.send();
	}
}

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

function getLines(doc) {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not retrieve your cards. Check your Internet connection and try again.");
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(1000000);
		xhr.open("GET", serverURL + "/review/" + doc);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			data = JSON.parse(this.responseText);
			processData(data);
		}	
		xhr.send();
	}
}

function processData(data) {
	reviewLineIDs = []
	
	var currentDate = new Date();
	for ( i in data["lines"] ) {
		var memDate = new Date();
		
		var dateTimeSet = data["lines"][i].line.mems[0].created_at.split("T")
		var date = dateTimeSet[0];
		var time = dateTimeSet[1];
		var dateSet = date.split("-");
		var timeSet = time.replace("Z", "").split(":");

		memDate.setYear(dateSet[0]);
		memDate.setMonth(dateSet[1]-1);
		memDate.setDate(dateSet[2]);
		memDate.setHours(timeSet[0]);
		memDate.setMinutes(timeSet[1]);
		memDate.setSeconds(timeSet[2]);

		if ( memDate < currentDate) {
			reviewLineIDs.push({
				domid : data["lines"][i].line.domid,
				mem_id : data["lines"][i].line.mems[0].id
			});
		}
	}
	var xml = replaceAll("<wrapper>" + data["document"].document.html + "</wrapper>", "&nbsp;", " ");
	xml = replaceAll(replaceAll(xml, "<br>", " "), "&ndash;", "-");
	// xml = replaceAll(xml, "&ndash;", "-");
	var dom = Ti.XML.parseString(xml);
	cards = [];
	for ( i in reviewLineIDs ) {
		var element = dom.getElementById(reviewLineIDs[i]["domid"]);
		var text = element.firstChild.nodeValue;
		if (text == null || text == undefined) { continue; }
		text = text.split(" -");
		if ( typeof(text) == 'string' ) { text = text.split("- "); }
		if ( text.length == 1 ) { 
			continue; 
		} else { cards.push(createCard(trim(text[0]), trim(text[1]), reviewLineIDs[i]["mem_id"])); }
	}
	if ( cards.length > 0 ) {
		reviewing = false;
		var new_win = Ti.UI.createWindow({
			url : "review.js",
			navBarHidden : true,
			//list : reviewList,
			cards : cards,
			nav : win.nav, 
			_parent: Titanium.UI.currentWindow,
			folder : win.data,
			orientationModes : [
				Titanium.UI.LANDSCAPE_LEFT,
				Titanium.UI.LANDSCAPE_RIGHT
			]
		}); 
		win.nav.open(new_win);					
	} else { alert('That document has no cards to review!'); }
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
// /mems/update/25488/4
function reportGrade(memID, confidence) {
	var gradeValues = {
		1 : 9,
		2 : 6, 
		3 : 4, 
		4 : 1	
	}
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	xhr.open("POST", serverURL + "/mems/update/" + memID + "/" + confidence  + "/0");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		Ti.API.debug('Posted confidence to ' + memID);
	}	
	xhr.send();
}

function signOut() {
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		alert("Could not log you out. Check your Internet connection and try again.");
	} else {
		xhr = Ti.Network.createHTTPClient();
		xhr.open("GET", serverURL + "/users/sign_out");
		xhr.setRequestHeader('Content-Type', 'text/html');
		xhr.send();
		
		Ti.App.Properties.removeProperty('email');
		Ti.App.Properties.removeProperty('password');
		
		//TODO maybe these should 
		var newWin = Ti.UI.createWindow({
			url:"login.js",
			navBarHidden : true,
			nav : win.nav,
			orientationModes : [
				Titanium.UI.PORTRAIT,
				Titanium.UI.UPSIDE_PORTRAIT
			]
		}); 	
		win.nav.open(newWin);
	}
}
