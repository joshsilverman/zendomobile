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
		
		// Can be uncommented to refresh each load
		// var newWin = Ti.UI.createWindow({
			// url : "folders.js",
			// navBarHidden : false, 
			// data : win.data,
			// nav : win.nav
		// }); 
		// win.nav.open(newWin);
	});
	
	var review = Ti.UI.createButton({
		title:'Review'
	});

	review.addEventListener('click', function() {	
		var reviewList = [];
		for ( i in notesRows ) {
			if ( notesRows[i].children[0].status == 'checked' ) {
				reviewList.push(notesRows[i].id);
			}
		}
		
		if ( reviewList.length < 1 ) {
			alert("Select a document to start reviewing!");
		} else {
			if ( reviewing == false ) {
				reviewing = true;
				getLines(reviewList, "normal");
			}
		}
	});

	win.rightNavButton = review;
	win.leftNavButton = back;
}

function render(){

	var toolbar = Ti.UI.createToolbar({
		top : 0
	});
		
	var lists = Titanium.UI.createTableView({
		//top : toolbar.height,
		rowHeight : 60,
		data : notesRows
	});
	
	lists.addEventListener('click', function(e){
		if ( e.row.children[0].status == 'checked' ) {
			var status = 'unchecked';
		    var image = 'images/unchecked.png';
		} else {
			var status = 'checked';
			var image = 'images/checked.png';
		}
		for ( i in notesRows ) {
			notesRows[i].children[0].status = 'unchecked';
			notesRows[i].children[0].image = 'images/unchecked.png';	
		}
		
		 e.row.children[0].status = status;
		 e.row.children[0].image = image;
	});
	
	// toolbar.add(back);
	// toolbar.add(review);

	win.add(lists);
	//win.add(toolbar);
}

initialize();
