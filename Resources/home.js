Ti.UI.setBackgroundColor('#fff');
var win = Ti.UI.currentWindow;

var notes_button = Ti.UI.createButton({
	title:'Go to Notes',
	width:100,
	height:50
});

notes_button.addEventListener('click', function() {
	var new_win = Ti.UI.createWindow({
		url:"explore.js",
		navBarHidden : true
	});
	
	new_win.open();
	win.visible = false;
});

win.add(notes_button);