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
	getRecentDocs();
	// render();
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

function renderRecent(){
	
	var toolbar = Ti.UI.createToolbar({
		top : 0
	});
		
	recentList = Titanium.UI.createTableView({
		rowHeight : 60,
		data : [],
		backgroundColor : '#dfdacd'
	});
	
	recentList.addEventListener('click', function(e){
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
	win.add(recentList);
}

function setRecentList(results) {
	var data = [];
	//Insert check for push enabled -> Josh
	//Fix recent, doesn't seem to be working here or on live site
	for ( i in results ) { data.push(createNoteRow(results[i].document.name, results[i].document.id, results[i].document.tag_id, false)); }
	recentList.setData(data);
}

win.addEventListener('focus', function() {
	renderRecent();
	updateRecent();
});