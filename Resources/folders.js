Ti.UI.setBackgroundColor('#fff');
var win = Ti.UI.currentWindow;

renderNavBar();
Ti.include('networkMethods.js');

function initialize() {
	folderRows = [];
	folderData = getFolders();
}

function renderNavBar() {
	var signOutButton = Ti.UI.createButton({ title : 'Sign Out' });
	signOutButton.addEventListener('click', function(){ signOut(); });
	win.leftNavButton = signOutButton;	
}

function createFolderRow(name, id){
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
	row.add(image);
	row.add(label);
	return row;
}

function render() {
	
	var toolbar = Ti.UI.createToolbar({
		top : 0		
	});
	
	var lists = Titanium.UI.createTableView({
		rowHeight : 80,
		data : folderRows
	});
	
	lists.addEventListener('click', function(e) {
		notesData = getNotes(e);
	});

	win.add(lists);
}

initialize();