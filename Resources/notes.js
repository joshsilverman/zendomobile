Ti.UI.setBackgroundColor('#fff');
// Ti.UI.orientation = Ti.UI.PORTRAIT;
var win = Ti.UI.currentWindow;
win.name = "Notes";
Ti.App.current_win = win;
var reviewing = false;

// renderNavBar();
Ti.include('networkMethods.js');
Ti.include('helperMethods.js');

function initialize() {
	// notesRows = win.data;
	render();
}

function renderNavBar() {
	
	var back = Ti.UI.createButton({
		title : 'Folders'		
	});
	
	back.addEventListener('click', function() {
		Titanium.UI.orientation = Titanium.UI.PORTRAIT;
		Ti.App.current_win = win._parent;
		win.nav.close(win);
	});
	
	win.leftNavButton = back;
}

function render(){

	var toolbar = Ti.UI.createToolbar({
		top : 0
	});
	
	
	lists = Titanium.UI.createTableView({
		rowHeight : 60,
		data : win.data,
		backgroundColor : '#dfdacd'
	});
	
	lists.addEventListener('click', function(e){
		// alert(JSON.stringify(win.row.children[0]));
		if (e.source.id == "label") {
			if ( reviewing == false ) {
				reviewing = true;
				getLines(e.row.id, "normal");
			}	
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
			if (e.source.push == 0) {
				enableNotifications(e.row.id, false, e);
			} else {
				enableNotifications(e.row.id, true, e);
			}
		}	
	});
	
	// toolbar.add(back);
	// toolbar.add(review);

	win.add(lists);
	updateDocuments(win.selection);
}

function setDocumentsList(results) {
	// var data = [];
	//Insert check for push enabled -> Josh
	//Fix recent, doesn't seem to be working here or on live site
	// for ( i in results ) { data.push(createNoteRow(results[i].document.name, results[i].document.id, results[i].document.tag_id, results[i].document)); }
	lists.setData(results);
}

initialize();

win.addEventListener('focus', function() {	
	if (Ti.App.documentsDirty == true) {
		alert("Dirty");
		updateDocuments(win.selection);
		Ti.App.documentsDirty = false;
	}
});

// win.addEventListener('focus', function() {	
	// if (Ti.App.dirty != true) {
		// return;
	// }
	// //For each tag
	// for (i in Ti.App.data) {
		// //If it is the current tag
		// if (Ti.App.data[i].tag.id == win.selection) {
			// //For each doc within the tag
			// for (j in Ti.App.data[i].tag.documents) {
				// //For each row in the list
				// for (k in win.data) {
					// //If the row id matches the doc id AND the push status is not the same for these two 
					// // alert("In here");
					// if (Ti.App.data[i].tag.documents[j].id == win.data[k].id && win.data[k].children[0].push != Ti.App.data[i].tag.documents[j].userships[0].push_enabled) {
						// if (win.data[k].children[0].status == "unchecked"){
							// win.data[k].children[0].status = "checked";
							// win.data[k].children[0].image = 'images/checked.png';
							// win.data[k].children[0].push = true;
						// } else {
							// win.data[k].children[0].status = "unchecked";
							// win.data[k].children[0].image = 'images/unchecked.png';
							// win.data[k].children[0].push = false;
						// }
					// }
				// }		
			// }	
		// }
	// }
// 	
	// if (win.selection == null){
		// var docIds = [];
		// for (k in win.data) { docIds.push(win.data[k].id); }
		// alert(docIDs);
		// for (i in Ti.App.data) {
			// if (Ti.App.data[i].tag.id == null) {
				// for (j in Ti.App.data[i].tag.documents) {	
					// // alert()			
					// if (docIds.indexOf(Ti.App.data[i].tag.documents[j].id) == -1) {
						// // alert(JSON.stringify(Ti.App.data[i].tag.documents[j]));
						// lists.appendRow(createNoteRow(Ti.App.data[i].tag.documents[j].name, Ti.App.data[i].tag.documents[j].id, Ti.App.data[i].tag.documents[j].tag_id, Ti.App.data[i].tag.documents[j].userships[0].push_enabled));
					// }
				// }
			// }
		// }
	// }
	// Ti.App.dirty = false;
// });