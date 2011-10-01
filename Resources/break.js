Titanium.Paint = Ti.Paint = require('ti.paint');

var win = Ti.UI.currentWindow;


// var win = Ti.UI.createWindow({ backgroundColor: '#fff' });
var paintView = Ti.Paint.createPaintView({
	backgroundImage :  'images/egg@2x.png',
    top:50, right:0, bottom:50, left:0,
    // strokeWidth (float), strokeColor (string), strokeAlpha (int, 0-255)
    strokeColor : '#0f0', strokeAlpha:255, strokeWidth:10,
    eraseMode : false
});

win.add(paintView);

// var eggImage = Ti.UI.createImageView({
	// image : 'images/egg@2x.png'
// });
// win.add(eggImage);
// var buttonStrokeWidth = Ti.UI.createButton({ left:10, bottom:10, right:10, height:30, title:'Decrease Stroke Width' });

// buttonStrokeWidth.addEventListener('click', function(e) {
	// paintView.strokeWidth = (paintView.strokeWidth === 10) ? 5 : 10;
	// e.source.title = (paintView.strokeWidth === 10) ? 'Decrease Stroke Width' : 'Increase Stroke Width';
// });
// win.add(buttonStrokeWidth);

var bottomPanel = Ti.UI.createView({
	bottom : 0,
	width : Ti.Platform.displayCaps.platformWidth,
	height : 50,
	backgroundColor : '#dfdacd'
});

var buttonStrokeColorRed = Ti.UI.createButton({ 
	bottom:10, 
	right : 10, 
	width:75, 
	height:30, 
	title:'Red' 
});
buttonStrokeColorRed.addEventListener('click', function() { paintView.strokeColor = 'red'; });

var buttonStrokeColorGreen = Ti.UI.createButton({ 
	bottom:10, 
	width:75, 
	left:10, 
	height:30, 
	title:'Green' 
});
buttonStrokeColorGreen.addEventListener('click', function() { paintView.strokeColor = '#0f0'; });

var buttonStrokeColorBlue = Ti.UI.createButton({ 
	bottom:10, 
	width:75, 
	height:30, 
	title:'Blue' 
});
buttonStrokeColorBlue.addEventListener('click', function() { paintView.strokeColor = '#0000ff'; });

bottomPanel.add(buttonStrokeColorRed);
bottomPanel.add(buttonStrokeColorGreen);
bottomPanel.add(buttonStrokeColorBlue);
win.add(bottomPanel);

var topPanel = Ti.UI.createView({
	top : 0,
	width : Ti.Platform.displayCaps.platformWidth,
	height : 50,
	backgroundColor : '#dfdacd'
});

var endSessionButton = Ti.UI.createButton({ 
	title : "Done",
	top : 10,
	left : 10,
	width:75, 
	height:30
});

endSessionButton.addEventListener('click', function() {
	Titanium.UI.orientation = Titanium.UI.PORTRAIT;
	win.close();
	win._parent.close();
	Ti.App.tabGroup.show();
});

topPanel.add(endSessionButton);

var continueButton = Ti.UI.createButton({ 
	title : "Continue",
	top : 10,
	right : 10,
	width:75, 
	height:30
});

continueButton.addEventListener('click', function() {
	Titanium.UI.orientation = Titanium.UI.PORTRAIT;
	win.close();
	win._parent.close();
	Ti.App.tabGroup.show();
});

topPanel.add(continueButton);



var timeLabel = Ti.UI.createLabel({
	text : "Break time!",
	font : { fontSize : 15, fontFamily : 'Arial' },
	bottom : 0,
	textAlign : 'center'
	// left : 50
	
});
topPanel.add(timeLabel);

win.add(topPanel);

function decrement() {
	if (timeLabel.text > 0) {
		timeLabel.text = timeLabel.text - 1;
	} else {
		timeLabel.text = "";
		clearInterval(decrement);
	}
}

function message() {
	timeLabel.text = 20;
	timeLabel.font = { fontSize : 20, fontFamily : 'Arial' },
	setInterval(decrement, 1000);
}

setTimeout(message, 5000);




// var clear = Ti.UI.createButton({ bottom:40, left:100, width:75, height:30, title:'Clear' });
// clear.addEventListener('click', function() { paintView.clear(); });
// win.add(clear);

// var buttonStrokeAlpha = Ti.UI.createButton({ bottom:70, right:10, width:100, height:30, title:'Alpha : 100%' });
// buttonStrokeAlpha.addEventListener('click', function(e) {
	// paintView.strokeAlpha = (paintView.strokeAlpha === 255) ? 127 : 255;
	// e.source.title = (paintView.strokeAlpha === 255) ? 'Alpha : 100%' : 'Alpha : 50%';
// });
// win.add(buttonStrokeAlpha);

// var buttonStrokeColorEraser = Ti.UI.createButton({ bottom:40, right:10, width:100, height:30, title:'Erase : Off' });
// buttonStrokeColorEraser.addEventListener('click', function(e) {
	// paintView.eraseMode = (paintView.eraseMode) ? false : true;
	// e.source.title = (paintView.eraseMode) ? 'Erase : On' : 'Erase : Off';
// });
// win.add(buttonStrokeColorEraser);

// win.open();

