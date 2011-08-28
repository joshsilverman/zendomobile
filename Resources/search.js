Ti.UI.setBackgroundColor('#fff');
// Ti.UI.orientation = Ti.UI.PORTRAIT;
var win = Ti.UI.currentWindow;
win.name = "Search";
Ti.App.current_win = win;
Ti.include('networkMethods.js');

docIds = [];
docs = {};
currentSearch = "";

search = Titanium.UI.createSearchBar({
	barColor:'#000',
	showCancel:true,
	height:43,
	top:0
});

search.addEventListener('cancel', function(e) {
	search.blur();
});

var list = Titanium.UI.createTableView({
	rowHeight : 60,
	data : [],
	backgroundColor : '#dfdacd',
	top : 50
});

list.addEventListener('click', function(e) {
	search.blur();
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
	// } else if (e.source.id == "doc") {
		// if (e.source.push == 1) {
			// enableNotifications(e.row.id, false, e);
		// } else {
			// enableNotifications(e.row.id, true, e);
		// }	
});

win.add(search);
win.add(list);

function setSearchResults(results) {	
	var data = [];
	if ( results.length < 1 ) {data.push({ title : "No results found" }) }
	for ( i in results ) { 
		// alert(JSON.stringify(results[i]));
		if (docs[results[i].document.id] == null) {
			data.push(createAddableNoteRow(results[i].document.name, results[i].document.id, false, docs[results[i].document.id])); 
		} else {
			data.push(createAddableNoteRow(results[i].document.name, results[i].document.id, true, docs[results[i].document.id])); 
		}	
	}
	list.setData(data);
}

search.addEventListener('return', function(e) {
	currentSearch = e.value;
	searchQuery(e.value);
	search.blur();
});

win.addEventListener('focus', function() {
	docs = {};
	for (i in Ti.App.data) {
		for ( j in Ti.App.data[i].tag.documents ) {
			docs[Ti.App.data[i].tag.documents[j].id] = Ti.App.data[i].tag.documents[j].userships[0].push_enabled
		}
	}
	if (Ti.App.searchDirty == true) {
		if (currentSearch != "") {
			searchQuery(currentSearch);
			Ti.App.searchDirty = false;		
		};
	}

});
