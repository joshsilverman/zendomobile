// Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;
var win = Ti.UI.currentWindow;

// Titanium.UI.currentWindow.orientationModes = [
	// Titanium.UI.LANDSCAPE_LEFT,
	// Titanium.UI.LANDSCAPE_RIGHT	
// ];

Titanium.UI.setBackgroundColor('#fff');

var screenWidth = Ti.Platform.displayCaps.platformWidth;
var screenHeight = Ti.Platform.displayCaps.platformHeight;
var gradeValues = {
	1 : 9,
	2 : 6, 
	3 : 4, 
	4 : 1	
}
var gradeCounts = {
	1 : 0,
	2 : 0, 
	3 : 0, 
	4 : 0	
}

var total = 0;
var possible = 0;

for ( i in win.data) {
	if ( win.data[i].grade != 0 ) {
		possible += 9;
		total += gradeValues[win.data[i].grade];
		gradeCounts[win.data[i].grade] += 1
	}
}

var graph = Ti.UI.createImageView({
	image : "http://chart.apis.google.com/chart?chf=bg,s,F5F5F500&chs=500x225&cht=p3&chco=16BE16|7FE97F|FD6666|E03838&chd=t:"
            + gradeCounts[1] + "," + gradeCounts[2] + "," + gradeCounts[3] + "," + gradeCounts[4] +
            "&chdl=Got it - " + gradeCounts[1] + "|Kinda - " + gradeCounts[2] +
            "|Barely - " + gradeCounts[3] + "|No clue - " + gradeCounts[4] + "&chma=|2",
    width : 450, 
    height : 275,
    top :  0, 
    left : -20
});

var gradeLabel = Ti.UI.createLabel({
	text : "Your score: " + (Math.round((total/possible) * 100)) + "%",
	top : -220, 
	right : -280,
	textAlign : 'center',
	font : {fontSize : 20, fontWeight:'bold'} 
});

var closeButton = Ti.UI.createButton({
	title : 'Back to notes',
	width : 120, 
	height : 50, 
	bottom : 23,
	right : 23
});
	
closeButton.addEventListener('click', function() {
	win.nav.close(win._parent);
	win.nav.close(win);
	// var newWin = Ti.UI.createWindow({
		// url : "notes.js",
		// navBarHidden : false,
		// nav : win.nav,
		// data : win.folder
	// });	
	// win.nav.open(newWin);
});

win.add(gradeLabel);

win.add(graph);
win.add(closeButton);

// var replayButton = Ti.UI.createButton({
	// title : 'Replay',
	// width : 100, 
	// height : 40, 
	// bottom : 10, 
	// left : 80
// });
// 
// replayButton.addEventListener('click', function() {
	// var newWin = Ti.UI.createWindow({
		// url : "newReview.js",
		// navBarHidden : true,
		// nav : win.nav,
		// data : win.data,
		// views : win.views
	// });	
	// //TODO this is not ideal!
	// // win.hide();s
	// win.nav.open(newWin);	
// });

// graphContainer.add(graph);

// win.add(replayButton);