Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;
Titanium.UI.currentWindow.orientationModes = [Titanium.UI.LANDSCAPE_LEFT];
Titanium.UI.setBackgroundColor('#fff');
var win = Ti.UI.currentWindow;

var screenWidth = Ti.Platform.displayCaps.platformWidth;
var screenHeight = Ti.Platform.displayCaps.platformHeight;

var gradeValues = {
	1 : 1,
	2 : 4, 
	3 : 6, 
	4 : 9	
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

Ti.API.debug(total + " / " + possible);
Ti.API.debug(gradeCounts);

var graphContainer = Ti.UI.createView({
	top : 0,
	width : 400
	// left : 0
});

var graph = Ti.UI.createImageView({
	image : "http://chart.apis.google.com/chart?chf=bg,s,F5F5F500&chs=500x225&cht=p3&chco=16BE16|7FE97F|FD6666|E03838&chd=t:"
                    + gradeCounts[4] + "," + gradeCounts[3] + "," + gradeCounts[2] + "," + gradeCounts[1] +
                    "&chdl=Got%20it+-+" + gradeCounts[4] + "|Kinda+-+" + gradeCounts[3] +
                    "|Barely+-+" + gradeCounts[2] + "|No%20clue+-+" + gradeCounts[1] + "&chma=|2"
});

var closeLabel = Ti.UI.createLabel({
	text : total + " / " + possible,
	top : 0
});

// graphContainer.add(graph);
win.add(graph);
win.add(closeLabel);
