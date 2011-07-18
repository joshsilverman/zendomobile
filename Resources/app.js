Ti.App.Properties.setBool('active', false);
Ti.include('helperMethods.js');
Ti.include('networkMethods.js');

var serverURL = 'http://192.168.0.102:3000';



function render() {
	var container = Ti.UI.createWindow({
		navBarHidden : true,
		orientationModes : [
			Titanium.UI.PORTRAIT,
			Titanium.UI.UPSIDE_PORTRAIT,
			Titanium.UI.LANDSCAPE_LEFT,
			Titanium.UI.LANDSCAPE_RIGHT
		]
	});
	
	var newWin = Ti.UI.createWindow({
		url:"login.js",
		navBarHidden : true,
		//TODO not working!
		orientationModes : [
			Titanium.UI.PORTRAIT,
			Titanium.UI.UPSIDE_PORTRAIT
		]
	});
	
	var nav = Titanium.UI.iPhone.createNavigationGroup({
	   window : newWin
	});
	
	newWin.nav = nav;
	container.add(nav);
	container.open();
}

function requestLines(doc) {
	// checkLoggedIn();
	if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
		reviewing = false;
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

function createCard(prompt, answer, memID) {
	var card = new Object();
	card.prompt = prompt;
	card.answer = answer;
	card.flipped = false;
	card.grade = 0;
	card.memID = memID;
	return card;
}

function processData(data) {
	reviewLineIDs = []
	
	//TODO date checking for mems!
	// var currentDate = new Date();
	// for ( i in data["lines"] ) {
		// if ( data["lines"][i].line.mems[0].review_after == null ) {
			// reviewLineIDs.push({
				// domid : data["lines"][i].line.domid,
				// mem_id : data["lines"][i].line.mems[0].id
			// });
		// } else {
			// var memDate = new Date();
			// // Ti.API.debug(data["lines"][i].line.mems[0].review_after);
			// var dateTimeSet = data["lines"][i].line.mems[0].review_after.split("T")
// 			
			// var date = dateTimeSet[0];
			// var time = dateTimeSet[1];
			// var dateSet = date.split("-");
			// var timeSet = time.replace("Z", "").split(":");
// 	
			// memDate.setYear(dateSet[0]);
			// memDate.setMonth(dateSet[1]-1);
			// memDate.setDate(dateSet[2]);
			// memDate.setHours(timeSet[0]);
			// memDate.setMinutes(timeSet[1]);
			// memDate.setSeconds(timeSet[2]);		
// 			
			// if ( memDate < currentDate || memDate == null) {
				// reviewLineIDs.push({
					// domid : data["lines"][i].line.domid,
					// mem_id : data["lines"][i].line.mems[0].id
				// });
			// }			
		// }		
	// }
	for ( i in data["lines"] ) {
		reviewLineIDs.push({
			domid : data["lines"][i].line.domid,
			mem_id : data["lines"][i].line.mems[0].id
		});
	}	
	var xml = replaceAll("<wrapper>" + data["document"].document.html + "</wrapper>", "&nbsp;", " ");
	xml = replaceAll(replaceAll(xml, "<br>", " "), "&ndash;", "-");
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
		
		//alert("Opening review window!");
		//alert("Nav: " + win.nav);NOT AVAILABLE ON NOTIFICATION
		//alert("Current win: " + Titanium.UI.currentWindow);
		//alert("Data: " + win.data); NOT AVAILABLE ON NOTIFICATION
		reviewing = false;
		var new_win = Ti.UI.createWindow({
			url : "review.js",
			navBarHidden : true,
			//list : reviewList,
			cards : cards,
			modal : true,
			//nav : win.nav, 
			//_parent: Titanium.UI.currentWindow,
			//TODO need this?
			//folder : win.data,
			orientationModes : [
				Titanium.UI.LANDSCAPE_LEFT,
				Titanium.UI.LANDSCAPE_RIGHT
			]
		}); 
		//Titanium.UI.currentWindow.hide();
		// new_win.open();
		win.nav.open(new_win);					
	} else { 
		reviewing = false;
		alert('That document has no cards to review!'); 
	}
}

render();

// omniAuth();
// 
// function omniAuth() {
	// // alert(Ti.App.Properties.getBool('active'));
	// xhr = Ti.Network.createHTTPClient();
	// xhr.setTimeout(1000000);
	// xhr.onload = function() {
		// alert(this.responseText);	
	// }	
	// // xhr.onreadystatechange = function() {
		// // if (this.readyState == 4) {
			// // if (this.status == 200) {
				// // if ( Ti.App.Properties.getBool('active') == 0 ) {
					// // // alert('User is logged in but not in app, trying to get saved login...');
					// // authSuccess(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'));
				// // }
// // 
			// // } else {
				// // // alert('User is not logged in to server... Attempting auto login...');
				// // attemptAutoLogin();
			// // }
		// // }
	// // }	
	// xhr.open("GET", "http://zen.do/auth/open_id?openid_url=gmail.com");
	// xhr.setRequestHeader('Content-Type', 'text/html');
	// xhr.send();
// }

// nav.open(newWin);
// win.open();

//USER OPENS THE APP MANUALLY:
//if new user:
//	ask user if they would like to enable push
//	if no:
//		take user to their notes
//	if yes:
//		inform Zendo user want to receive notifications
//		register with UA:
// 			Ti.include('urbanairship.js');
// 			Ti.include('pushRegistration.js');
// 			UrbanAirship.key='gjah01G_R0O6v1bpPGGVwg';
// 			UrbanAirship.secret ='fy0VM1uWRIumLKgkAs67og';
// 			UrbanAirship.master_secret='yUj9LSpyS7qMYjtiwvmUEA';
// 			UrbanAirship.baseurl = 'https://go.urbanairship.com';
//
//if returning user:
//	take user to their notes		
//
//USER ENTERS THE APP VIA A PUSH NOTIFICATION:
//	take the user directly to cards that need to be reviewed

//Query server, check if push notifications are enabled
//If enabled:
//	register();

//If disabled:
//	unregister();