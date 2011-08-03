Ti.UI.setBackgroundColor('#fff');
var win = Ti.UI.currentWindow;

function renderNavBar() {
	var backButton = Ti.UI.createButton({ title : 'Home' });
	backButton.addEventListener('click', function(){ win.nav.close(win); });
	win.leftNavButton = backButton;	
}

function render() {
	
}

renderNavBar();
render();
