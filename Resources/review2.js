Ti.UI.setBackgroundColor('#fff');

win = Ti.UI.currentWindow;
back = Ti.UI.createButton({
    title:'Close',
    style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});
back.addEventListener('click', function(){
	win.close();
});
win.leftNavButton = back;


card = Ti.UI.createImageView({
	image : 'images/card.png',
	width : 300,
	height : 300,
	top : 0
});

var flipAnimation = Ti.UI.createAnimation();
flipAnimation.transition = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
//flipAnimation.transition = Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT;
//flipAnimation.duration = 250;
	
card.addEventListener('click', function(){
	Ti.API.debug("clicked");
	card.animate(flipAnimation);
});

win.add(card);