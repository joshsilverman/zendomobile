Ti.UI.setBackgroundColor('#fff');
// Ti.UI.orientation = Ti.UI.PORTRAIT;
var win = Ti.UI.currentWindow;
win.name = "Notes";
Ti.App.current_win = win;
// alert(Ti.App.current_win.name);
var reviewing = false;
// win.orientationModes = [
    // Titanium.UI.PORTRAIT,
    // Titanium.UI.LANDSCAPE_LEFT,
    // Titanium.UI.LANDSCAPE_RIGHT
// ];
renderNavBar();
Ti.include('networkMethods.js');
Ti.include('helperMethods.js');

function initialize() {
	renderInteresing();
	getInterestingEggs();
}

function renderNavBar() {
	// var back = Ti.UI.createButton({
		// title : 'Folders'		
	// });
// 	
	// back.addEventListener('click', function() {
		// Titanium.UI.orientation = Titanium.UI.PORTRAIT;
		// Ti.App.current_win = win._parent;
		// win.nav.close(win);
// 		
		// // Can be uncommented to refresh each load
		// // var newWin = Ti.UI.createWindow({
			// // url : "folders.js",
			// // navBarHidden : false, 
			// // data : win.data,
			// // nav : win.nav
		// // }); 
		// // win.nav.open(newWin);
	// });
	
	// var review = Ti.UI.createButton({
		// title:'Review'
	// });
// 
	// review.addEventListener('click', function() {	
		// var reviewList = [];
		// for ( i in notesRows ) {
			// if ( notesRows[i].children[0].status == 'checked' ) {
				// reviewList.push(notesRows[i].id);
			// }
		// }
// 		
		// if ( reviewList.length < 1 ) {
			// alert("Select a document to start reviewing!");
		// } else {
			// if ( reviewing == false ) {
				// reviewing = true;
				// getLines(reviewList, "normal");
			// }
		// }
	// });
// 
	// win.rightNavButton = review;
	// win.leftNavButton = back;
}

function renderInteresing(){

	var toolbar = Ti.UI.createToolbar({
		top : 0
	});
		
	popularList = Titanium.UI.createTableView({
		//top : toolbar.height,
		rowHeight : 60,
		data : [],
		backgroundColor : '#dfdacd'
	});
	
	popularList.addEventListener('click', function(e){
		// if (e.source.id == "label") {
			// if ( reviewing == false ) {
				// reviewing = true;
				// getLines(e.row.id, "normal");
			// }	
		// } else if (e.source.id == "add") {
			// //Insert check for added status, if not then:
			// // alert(JSON.stringify(e.row.children[2].image = null));
			// e.row.children[2].image = null;
			// addDocument(e.row.id);
// 			
		// } else if (e.source.id == "doc") {
			// if (e.source.push == 1) {
				// enableNotifications(e.row.id, false, e);
			// } else {
				// enableNotifications(e.row.id, true, e);
			// }
		// }	
		if (e.source.id == "label") {
			// if ( reviewing == false ) {
				// reviewing = true;
				getLines(e.row.id, "normal");
			// }	
		} else if (e.source.id == "add") {
			e.row.children[2].image = 'images/folder.png';
			e.row.children[2].owned = true;
			addDocument(e.row.id, e);		
		// } else if (e.source.id == "owned") {
		} else if (e.source.id == "doc") {
			if ( e.row.children[0].push == true ) {
				var push = false;
		    	var image = 'images/document@2x.png';
			} else {
				var push = true;
				var image = 'images/document-feed@2x.png';
			}
			e.row.children[0].push = push;
		 	e.row.children[0].image = image;	
			e.row.children[2].image = 'images/folder.png';
			e.row.children[2].owned = true;	 	
			if (e.source.push == 0) {
				enableNotifications(e.row.id, false, e);
			} else {
				enableNotifications(e.row.id, true, e);
			}
		}
	});
			
	// toolbar.add(back);
	// toolbar.add(review);

	win.add(popularList);
	//win.add(toolbar);
}

function setPopularResults(results) {
	//TODO no push data coming through here	
	var data = [];
	for ( i in results ) { 
		// alert(JSON.stringify(results[i].id));
		if (docs[results[i].document.id] == null) {
			data.push(createAddableNoteRow(results[i].document.name, results[i].document.id, false, docs[results[i].document.id])); 
		} else {
			data.push(createAddableNoteRow(results[i].document.name, results[i].document.id, true, docs[results[i].document.id])); 
		}	
	}
	popularList.setData(data);
}

initialize();

win.addEventListener('focus', function() {
	docs = {};
	for (i in Ti.App.data) {
		for ( j in Ti.App.data[i].tag.documents ) {
			docs[Ti.App.data[i].tag.documents[j].id] = Ti.App.data[i].tag.documents[j].userships[0].push_enabled
		}
	}
	alert(docs);
	if (Ti.App.popularDirty == true) {
		alert("Dirty");
		Ti.App.popularDirty = false;
	}
});