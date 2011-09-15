//TODO @PLATFORM - This may need to be adjusted for Android
var dimension1 = Ti.Platform.displayCaps.platformHeight;
var dimension2 = Ti.Platform.displayCaps.platformWidth;

if (dimension1 > dimension2) {
	var screenHeight = dimension2 - 20;
	var screenWidth = dimension1;
} else {
	var screenHeight = dimension1 - 20;
	var screenWidth = dimension2;	
}