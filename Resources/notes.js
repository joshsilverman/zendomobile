Ti.UI.setBackgroundColor('#fff');
Ti.UI.orientation = Ti.UI.PORTAIT;

// var container = Ti.UI.currentWindow;
// var win = Titanium.UI.createWindow({navBarHidden : true});
// var nav = Titanium.UI.iPhone.createNavigationGroup({window : win});
// container.add(nav);

var win = Ti.UI.currentWindow;

Ti.include('getNotes.js');

function initialize() {
	notesRows = []
	notesData = getNotes(win.data);
}

function createNoteRow(name, docid){
	var row = Ti.UI.createTableViewRow({ id : docid}); 
	
    var image = Ti.UI.createImageView({
    	image:'images/unchecked.png',
    	left: 10,
    	touchEnabled:true,
    	height:25,
    	width:25,
    	status:'unchecked'
    });
	
	var label= Ti.UI.createLabel({
		text:name, 
		left:50
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
		Ti.API.debug(e.row.children[0].status);
		if (e.row.children[0].status == 'unchecked') {
    		e.row.children[0].status = 'checked';
    		e.row.children[0].image = 'images/checked.png';
    	} else {
    		e.row.children[0].status = 'unchecked';
    		e.row.children[0].image = 'images/unchecked.png';
    	}
	});
	
	var back = Ti.UI.createButton({
		title:'Back',
		width:100,
		height:35,
		left:30
	});
	
	back.addEventListener('click', function() {
		var newWin = Ti.UI.createWindow({
			url:"explore.js",
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
			var new_win = Ti.UI.createWindow({
				url:"newReview.js",
				navBarHidden:true,
				list : reviewList,
				nav : win.nav, 
				folder : win.data
			}); 
			win.nav.open(new_win);	
		}
	});

	toolbar.add(back);
	toolbar.add(review);

	win.add(lists);
	win.add(toolbar);
}

initialize();
