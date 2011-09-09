// Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;
var win = Ti.UI.currentWindow;

// Titanium.UI.currentWindow.orientationModes = [
	// Titanium.UI.LANDSCAPE_LEFT,
	// Titanium.UI.LANDSCAPE_RIGHT	
// ];

Titanium.UI.setBackgroundColor('#fff');
// alert(JSON.stringify(win.data));
var screenWidth = Ti.Platform.displayCaps.platformWidth;
var screenHeight = Ti.Platform.displayCaps.platformHeight;
var gradeValues = {
	4 : 9,
	3 : 6, 
	2 : 4, 
	1 : 1	
}
var gradeCounts = {
	1 : 0,
	2 : 0, 
	3 : 0, 
	4 : 0	
}

total = 0;
possible = 0;

for ( i in win.data) {
	if ( win.data[i].grade != null && win.data[i].grade != 0 ) {
		possible += 9;
		total += gradeValues[win.data[i].grade];
		gradeCounts[win.data[i].grade] += 1
	}
}

if ( Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ) {
	var graph = Ti.UI.createLabel({
		text : "There was an error accessing your graph. Check your Internet connection and try again.",
		textAlign : 'center',
		left : 50,
		width : 200,
		color : 'gray',
		font : {fontSize : 14, fontStyle:'italic'} 
    });
} else {
	var graph = Ti.UI.createImageView({
		image : "http://chart.apis.google.com/chart?chf=bg,s,F5F5F500&chs=500x225&legend=bottom&cht=p3&chco=16BE16|7FE97F|FD6666|E03838&chd=t:"
	            + gradeCounts[4] + "," + gradeCounts[3] + "," + gradeCounts[2] + "," + gradeCounts[1] +
	            "&chdl=Got it - " + gradeCounts[4] + "|Kinda - " + gradeCounts[3] +
	            "|Barely - " + gradeCounts[2] + "|No clue - " + gradeCounts[1] + "&chma=|2",
	    width : 325, 
	    height : 275,
	    top :  80, 
	    left : -20
	});
}

var gradeLabel = Ti.UI.createLabel({
	text : "Your score: " + (Math.round((total/possible) * 100)) + "%",
	top : -320, 
	right : 0,
	textAlign : 'center',
	font : {fontFamily : 'Marker Felt', fontSize : 30, fontWeight:'bold'} 
});

var closeButton = Ti.UI.createButton({
	title : 'Done',
	width : 120, 
	height : 50, 
	bottom : 23,
	right : 23
});
	
closeButton.addEventListener('click', function() {
	Titanium.UI.orientation = Titanium.UI.PORTRAIT;
	win.close();
	win._parent.close();
	Ti.App.tabGroup.show();
	// Ti.App.reviewing = false;
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