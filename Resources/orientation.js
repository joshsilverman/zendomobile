function setOrientation(orientation) {
	Ti.UI.orientation = orientation;
	Ti.API.debug(win.nav.active);
	// Ti.API.debug(win2.titleid);
	Ti.API.debug("Orientation request: " + orientation);
	// Ti.API.debug("Orientations allowed: " + win.orient);
	// Ti.API.debug(orientation in win.orient);
	// Ti.API.debug(Titanium.UI.PORTRAIT);
    // switch (orientation) {
        // case Titanium.UI.PORTRAIT:
        	// Ti.UI.orientation = orientation;
        // case Titanium.UI.UPSIDE_PORTRAIT:
        	// Ti.UI.orientation = orientation;
        // case Titanium.UI.LANDSCAPE_LEFT:
        	// Ti.UI.orientation = orientation;
        // case Titanium.UI.LANDSCAPE_RIGHT:
        	// Ti.UI.orientation = orientation;
    // }
}

Ti.Gesture.addEventListener('orientationchange', function(e) { 
	setOrientation(e.orientation); 
});