Ti.UI.setBackgroundColor('#fff');
var win = Ti.UI.currentWindow;
win.name = "Folders";
Ti.App.current_win = win;
Ti.include('networkMethods.js');

function initialize() {
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



function renderFolders(data) {
	// folderRows = [];
	// for (i in Ti.App.data) { folderRows.push(createFolderRow(Ti.App.data[i].tag.name, Ti.App.data[i].tag.id, false)); }
	var toolbar = Ti.UI.createToolbar({
		top : 0		
	});
	
	var lists = Titanium.UI.createTableView({
		rowHeight : 80,
		data : data
	});
	
	lists.addEventListener('click', function(e) {
		if (e.source.public_folder == true){
			getPublicDocs(e);
		} else {
			notesData = getNotes(e);	
		}	
	});

	win.add(lists);
}

initialize();

