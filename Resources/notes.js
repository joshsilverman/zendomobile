Ti.UI.setBackgroundColor('#fff');
var notes_win = Ti.UI.currentWindow;

folders = [];

Ti.API.debug("Folder clicked: " + notes_win.selection.row.children[1].text + " ( index = " + notes_win.selection.index + " )");

getFolders();

function getFolders() {
	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 1000000;
	xhr.open("GET","http://grocerygenie.heroku.com/users?format=json");
	xhr.onload = function(){
		try {
			var data = eval(this.responseText);
			for ( var i = 0; i < data.length; i ++ ) {
				folders.push(createFolderRow(data[i].user.email));
			}
		} catch(E) {
			alert(E);
		}
		start();
	}
	xhr.send();
}

function createFolderRow(name){
	var row = Ti.UI.createTableViewRow({}); 

    var image = Ti.UI.createImageView({
    	image:'unchecked.png',
    	left: 10,
    	touchEnabled:true,
    	height:25,
    	width:25,
    	id:'unchecked'
    });
    
    image.addEventListener('click', function(e){
    	if (image.id == 'unchecked') {
    		image.id = 'checked';
    		image.image = 'checked.png';
    	} else {
    		image.id = 'unchecked';
    		image.image = 'unchecked.png';
    	}
    	
    });
	
	var label= Ti.UI.createLabel({
		text:name, 
		left:50
	});
	
	row.add(image);
	row.add(label);
	
	return row;
}

function start(){
	
	var lists = Titanium.UI.createTableView({
		bottom:60,
		rowHeight:60,
		data:folders
	});
	
	var back = Ti.UI.createButton({
		bottom:10,
		title:'Back',
		width:100,
		height:40,
		left:30
	});
	
	back.addEventListener('click', function() {
		var new_win = Ti.UI.createWindow({
			url:"explore.js",
			navBarHidden : false
		}); 
		new_win.open();
		notes_win.visible = false;
	});
	
	var review = Ti.UI.createButton({
		bottom:10,
		title:'Review',
		width:100,
		height:40, 
		right:30
	});

	review.addEventListener('click', function() {
		var new_win = Ti.UI.createWindow({
			url:"review.js",
			modal:true
		}); 
		new_win.open();
		
	});

	notes_win.add(lists);
	notes_win.add(back);
	notes_win.add(review);
}


