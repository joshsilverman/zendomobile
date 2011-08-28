Ti.UI.setBackgroundColor('#fff');
var win = Ti.UI.currentWindow;
win.name = "Folders";
Ti.App.current_win = win;
dataHash = {};
// folderRows = [];
// alert(folderRows);
Ti.include('networkMethods.js');
function initialize() {
	updateCache("login");
	// folderRows = [];
	// getFolders();
}

function renderNavBar() {
	var backButton = Ti.UI.createButton({ title : 'Home' });
	backButton.addEventListener('click', function(){ 
		Ti.App.current_win = win._parent;
		win.nav.close(win); 
	});
	win.leftNavButton = backButton;		
}

function renderFolders(rows) {
	// alert(dataHash);
	var toolbar = Ti.UI.createToolbar({
		top : 0		
	});
	eggList = Titanium.UI.createTableView({
		rowHeight : 80,
		data : rows,
		backgroundColor : '#dfdacd'
	});
	eggList.addEventListener('click', function(e) {
		if (e.source.public_folder == true){
			getPublicDocs(e);
		} else {
			notesData = getNotes(e);	
		}	
	});
	win.add(eggList);
}

// function setEggsList(results) {
	// // var data = [];
	// //Insert check for push enabled -> Josh
	// //Fix recent, doesn't seem to be working here or on live site
	// // for ( i in results ) { data.push(createNoteRow(results[i].document.name, results[i].document.id, results[i].document.tag_id, results[i].document)); }
	// eggList.setData(results);
// }
// 
// win.addEventListener('focus', function() {	
	// if (Ti.App.myEggsDirty == true) {
		// alert("Dirty");
		// updateDocuments(win.selection);
		// Ti.App.myEggsDirty = false;
	// }
// });


initialize();