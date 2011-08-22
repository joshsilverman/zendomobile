Ti.UI.setBackgroundColor('#fff');
var win = Ti.UI.currentWindow;
win.name = "Folders";
Ti.App.current_win = win;
// alert(Ti.App.current_win.name);
// renderNavBar();
Ti.include('networkMethods.js');

function initialize() {
	folderRows = [];
	getFolders();
}

function renderNavBar() {
	var backButton = Ti.UI.createButton({ title : 'Home' });
	backButton.addEventListener('click', function(){ 
		Ti.App.current_win = win._parent;
		win.nav.close(win); 
	});
	win.leftNavButton = backButton;	
	
}

function createFolderRow(name, id, public_folder){
	var row = Ti.UI.createTableViewRow({id : id}); 
	var image = Ti.UI.createImageView({
		image:'images/folder.png', 
		left: 10,
		width:50,
		height:50
	});
	var label= Ti.UI.createLabel({
		text : name, 
		left : 70
	});
	label.public_folder = public_folder;
	row.add(image);
	row.add(label);
	return row;
}

function renderFolders() {
	
	var toolbar = Ti.UI.createToolbar({
		top : 0		
	});
	
	var lists = Titanium.UI.createTableView({
		rowHeight : 80,
		data : folderRows
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