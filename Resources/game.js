var box2d = require("ti.box2d");

var win = Ti.UI.currentWindow;
var view = Ti.UI.createView();
win.add(view);
var world = box2d.createWorld(view);
var redBlock = Ti.UI.createView({
	backgroundColor: "red",
	width: 50,
	height: 50,
	top: 0
});

var blueBall = Ti.UI.createView({
	backgroundColor: "blue",
	borderRadius: 15,
	width: 30,
	height: 30,
	top: 100
});

// add the block body to the world
var redBodyRef = world.addBody(redBlock, {
	density: 12.0,
	friction: 0.3,
	restitution: 0.4,
	type: "dynamic"
});

// add the ball body to the world
var blueBodyRef = world.addBody(blueBall, {
	radius: 15,
	density: 12.0,
	friction: 0.3,
	restitution: 0.4,
	type: "dynamic"
});

Ti.Gesture.addEventListener('orientationchange', function(e) {
	if (e.orientation == Titanium.UI.LANDSCAPE_LEFT) {
		world.setGravity(9.91, 0);
	} else if (e.orientation == Titanium.UI.LANDSCAPE_RIGHT) {
		world.setGravity(-9.91, 0);
	} else if (e.orientation == Titanium.UI.UPSIDE_PORTRAIT) {
		world.setGravity(0, 9.91);
	} else if (e.orientation == Titanium.UI.PORTRAIT) {
		world.setGravity(0, -9.91);
	}
});

world.addEventListener("collision", function(e) {
	if ((e.a == redBodyRef || e.b == redBodyRef) && e.phase == "begin") {
		Ti.API.info("the red block collided with something");

		Ti.API.info(JSON.stringify(e));
		Ti.Media.vibrate();
	}
});

// start the world
world.start();
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

// var bottomPanel = Ti.UI.createView({
	// bottom : 0,
	// width : Ti.Platform.displayCaps.platformWidth,
	// height : 50,
	// backgroundColor : '#dfdacd'
// });
// 
// var buttonStrokeColorRed = Ti.UI.createButton({ 
	// bottom:10, 
	// right : 10, 
	// width:75, 
	// height:30, 
	// title:'Red' 
// });
// buttonStrokeColorRed.addEventListener('click', function() { paintView.strokeColor = 'red'; });
// 
// var buttonStrokeColorGreen = Ti.UI.createButton({ 
	// bottom:10, 
	// width:75, 
	// left:10, 
	// height:30, 
	// title:'Green' 
// });
// buttonStrokeColorGreen.addEventListener('click', function() { paintView.strokeColor = '#0f0'; });
// 
// var buttonStrokeColorBlue = Ti.UI.createButton({ 
	// bottom:10, 
	// width:75, 
	// height:30, 
	// title:'Blue' 
// });
// buttonStrokeColorBlue.addEventListener('click', function() { paintView.strokeColor = '#0000ff'; });
// 
// bottomPanel.add(buttonStrokeColorRed);
// bottomPanel.add(buttonStrokeColorGreen);
// bottomPanel.add(buttonStrokeColorBlue);
// win.add(bottomPanel);

// var topPanel = Ti.UI.createView({
	// top : 0,
	// width : Ti.Platform.displayCaps.platformWidth,
	// height : 50,
	// backgroundColor : '#dfdacd'
// });
// 
// var endSessionButton = Ti.UI.createButton({ 
	// title : "Done",
	// top : 10,
	// left : 10,
	// width:75, 
	// height:30
// });
// 
// endSessionButton.addEventListener('click', function() {
	// Titanium.UI.orientation = Titanium.UI.PORTRAIT;
	// win.close();
	// win._parent.close();
	// Ti.App.tabGroup.show();
// });
// 
// topPanel.add(endSessionButton);
// 
// var continueButton = Ti.UI.createButton({ 
	// title : "Continue",
	// top : 10,
	// right : 10,
	// width:75, 
	// height:30
// });
// 
// continueButton.addEventListener('click', function() {
	// Titanium.UI.orientation = Titanium.UI.PORTRAIT;
	// win.close();
	// win._parent.close();
	// Ti.App.tabGroup.show();
// });
// 
// topPanel.add(continueButton);
// 
// 
// 
// var timeLabel = Ti.UI.createLabel({
	// text : "Break time!",
	// font : { fontSize : 15, fontFamily : 'Arial' },
	// bottom : 0,
	// textAlign : 'center'
	// // left : 50
// 	
// });
// topPanel.add(timeLabel);
// 
// win.add(topPanel);
// 
// function decrement() {
	// if (timeLabel.text > 0) {
		// timeLabel.text = timeLabel.text - 1;
	// } else {
		// timeLabel.text = "";
		// clearInterval(decrement);
	// }
// }
// 
// function message() {
	// timeLabel.text = 20;
	// timeLabel.font = { fontSize : 20, fontFamily : 'Arial' },
	// setInterval(decrement, 1000);
// }
// 
// setTimeout(message, 5000);