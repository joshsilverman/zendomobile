Ti.UI.setBackgroundColor('#fff');
container = Ti.UI.currentWindow;

var win = Titanium.UI.createWindow({
	navBarHidden : true
});

var nav = Titanium.UI.iPhone.createNavigationGroup({
   window : win
});

container.add(nav);

//Ti.API.debug("Folder clicked: " + win.selection.row.children[1].text + " ( index = " + win.selection.index + " )");

folders = [];
getNotes();

//Retrieves the user's notes
function getNotes() {
	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 1000000;
	xhr.open("GET","http://grocerygenie.heroku.com/users?format=json");
	xhr.onload = function(){
		try {
			var data = eval(this.responseText);
			Ti.API.debug(data);
			for ( var i = 0; i < data.length; i ++ ) {
				folders.push(createFolderRow(data[i].user.email));
			}
		} catch(E) {
			Ti.API.debug(E);
		}
		start();
	}
	xhr.send();
}

//Creates folder UI elements
function createFolderRow(name){
	var row = Ti.UI.createTableViewRow({}); 

    var image = Ti.UI.createImageView({
    	image:'images/unchecked.png',
    	left: 10,
    	touchEnabled:true,
    	height:25,
    	width:25,
    	id:'unchecked'
    });
	
	var label= Ti.UI.createLabel({
		text:name, 
		left:50
	});
	
	row.add(image);
	row.add(label);
	
	return row;
}

//Builds notes browser UI
function start(){

	var toolbar = Ti.UI.createToolbar({
		top : 0
	});
		
	var lists = Titanium.UI.createTableView({
		top : toolbar.height,
		rowHeight : 60,
		data : folders
	});
	
	lists.addEventListener('click', function(e){
		Ti.API.debug(e.row.children[0].id);
		if (e.row.children[0].id == 'unchecked') {
    		e.row.children[0].id = 'checked';
    		e.row.children[0].image = 'images/checked.png';
    	} else {
    		e.row.children[0].id = 'unchecked';
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
			navBarHidden : true
		}); 
		nav.open(newWin);
		//new_win.open({transition : Titanium.UI.iPhone.AnimationStyle.CURL_DOWN});
		//win.visible = false;
	});
	
	var review = Ti.UI.createButton({
		title:'Review',
		width:100,
		height:35, 
		right:30
	});

	review.addEventListener('click', function() {
		var new_win = Ti.UI.createWindow({
			url:"review.js",
			modal:true
		}); 
		new_win.open({transition : Titanium.UI.iPhone.AnimationStyle.CURL_UP});
		
	});

	toolbar.add(back);
	toolbar.add(review);

	win.add(lists);
	win.add(toolbar);
}


