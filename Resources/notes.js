Ti.UI.setBackgroundColor('#fff');
// Ti.UI.orientation = Ti.UI.PORTRAIT;
var win = Ti.UI.currentWindow;
win.name = "Notes";
Ti.App.current_win = win;
var reviewing = false;

renderNavBar();
Ti.include('networkMethods.js');
Ti.include('helperMethods.js');

function initialize() {
	notesRows = win.data;
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
		
	var lists = Titanium.UI.createTableView({
		rowHeight : 60,
		data : notesRows
	});
	
	lists.addEventListener('click', function(e){
		// if ( e.row.children[0].status == 'checked' ) {
			// var status = 'unchecked';
		    // var image = 'images/unchecked.png';
		// } else {
			// var status = 'checked';
			// var image = 'images/checked.png';
		// }
		// for ( i in notesRows ) {
			// notesRows[i].children[0].status = 'unchecked';
			// notesRows[i].children[0].image = 'images/unchecked.png';	
		// }
// 		
		 // e.row.children[0].status = status;
		 // e.row.children[0].image = image;
		if ( reviewing == false ) {
			reviewing = true;
			getLines(e.row.id, "normal");
		}			 
	});
	
	// toolbar.add(back);
	// toolbar.add(review);

	win.add(lists);
	//win.add(toolbar);
}

initialize();
