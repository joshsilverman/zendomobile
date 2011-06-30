Ti.UI.setBackgroundColor('#fff');
Ti.UI.orientation = Ti.UI.PORTAIT;
var win = Ti.UI.currentWindow;

Ti.include('networkMethods.js');
Ti.include('helperMethods.js');

function initialize() {
	notesRows = []
	notesData = getNotes(win.data);
}

function createNoteRow(name, docid){
	var row = Ti.UI.createTableViewRow({ id : docid}); 
	
    var image = Ti.UI.createImageView({
    	image:'images/unchecked.png',
    	left: 15,
    	touchEnabled:true,
    	height:25,
    	width:25,
    	status:'unchecked'
    });
	
	var label= Ti.UI.createLabel({
		text:name, 
		left:53
	});
	
	row.add(image);
	row.add(label);
	return row;
}

function render(){

	var toolbar = Ti.UI.createToolbar({
		top : 0
	});
		
	var lists = Titanium.UI.createTableView({
		top : toolbar.height,
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
		// Ti.API.debug(notesRows);
		for ( i in notesRows ) {
			notesRows[i].children[0].status = 'unchecked';
			notesRows[i].children[0].image = 'images/unchecked.png';	
		}
		
		 e.row.children[0].status = status;
		 e.row.children[0].image = image;

		// if (e.row.children[0].status == 'unchecked') {
    		// e.row.children[0].status = 'checked';
    		// e.row.children[0].image = 'images/checked.png';
    	// } else {
    		// e.row.children[0].status = 'unchecked';
    		// e.row.children[0].image = 'images/unchecked.png';
    	// }
	});
	
	var back = Ti.UI.createButton({
		title:'Back',
		width:100,
		height:35,
		left:30
	});
	
	back.addEventListener('click', function() {
		var newWin = Ti.UI.createWindow({
			url:"folders.js",
			navBarHidden : true, 
			data : win.data,
			nav : win.nav
		}); 
		win.nav.open(newWin);
	});
	
	var review = Ti.UI.createButton({
		title:'Review',
		width:100,
		height:35, 
		right:30
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
			
			cards = getLines(reviewList);

		}
	});

	toolbar.add(back);
	toolbar.add(review);

	win.add(lists);
	win.add(toolbar);
}

initialize();
