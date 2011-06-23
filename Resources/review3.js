Titanium.UI.setBackgroundColor('#171717');
// Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;

var win = Ti.UI.currentWindow;

win.navBarHidden = false;

var back = Ti.UI.createButton({
    title:'Close',
    style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});

back.addEventListener('click', function(){
	win.close();
});

win.leftNavButton = back;

screenHeight = Math.round(Ti.Platform.displayCaps.platformHeight);
screenWidth = Math.round(Ti.Platform.displayCaps.platformWidth);
buttonTopPad = 10;
buttonRightPad = 10;
buttonLeftPad = 10;
buttonHeight = Math.round(((screenHeight - (buttonTopPad * 5)) / 4));
cardLeftPad = 10;



card1 = createCard('Jason', 'Urton');
card2 = createCard('Bill', 'DeRusha');
card3 = createCard('Josh', 'Silverman');
card4 = createCard('Word', 'Up');
card5 = createCard('Water', 'Bottle');
card6 = createCard('Benefit', 'Street');
card7 = createCard('ATP', 'Adenosine Triphosphate');


cards = [card1, card2, card3, card4, card5, card6, card7];
cardViews = []

initialize();

function initialize() {
	button1 = Ti.UI.createButton({
		title : 'Got it!',
		grade : 1,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad,
		top : buttonTopPad
	})
	button2 = Ti.UI.createButton({
		title : 'Kinda',
		grade : 2,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad,
		top : (buttonTopPad * 2 + buttonHeight)
	})
	button3 = Ti.UI.createButton({
		title : 'Barely',
		grade : 3,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad,
		top : (buttonTopPad * 3 + buttonHeight * 2)
	})
	button4 = Ti.UI.createButton({
		title : 'No clue',
		grade : 4,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad, 
		top : (buttonTopPad * 4 + buttonHeight * 3)
	})
	
	buttons = [button1, button2, button3, button4];
	for (i in buttons) { buttons[i].hide(); }
	for (i in buttons) { buttons[i].addEventListener('click', function(e) { buttonClicked(e); }); }
	for (i in cards) { cardViews.push(createCardView(cards[i])); }
}

function createCard(prompt, answer) {
	var card = new Object();
	card.prompt = prompt;
	card.answer = answer;
	card.flipped = false;
	card.grade = 0;
	return card;
}

function createCardView(cardObject) {

	var cardView = Ti.UI.createView({
		card : cardObject
	});
	
	cardView.addEventListener('singletap', function(e) {
		showGradeButtons();
		prompt.hide();
		answer.show();
		card.grade = e.source;
	});
	
	var card = Ti.UI.createImageView({
		image : 'images/card.jpg',
		width : (screenWidth - cardLeftPad - buttonLeftPad - buttonHeight - buttonRightPad),
		//height : screenHeight - 20,
		left : cardLeftPad
	});

	var prompt = Ti.UI.createLabel({
		text : cardObject.prompt,
		textAlign : 'center'
	});

	var answer = Ti.UI.createLabel({
		text : cardObject.answer,
		textAlign : 'center',
	});
	
	answer.hide();
	
	cardView.add(card);
	cardView.add(prompt);
	cardView.add(answer);
	
	return cardView;
	
}

function showGradeButtons(){
	for (i in buttons) { buttons[i].show(); }
}

function buttonClicked(button) {
	Ti.API.debug(button.source.grade);
	for (i in buttons) { buttons[i].hide(); }
	cardScrollableView.scrollToView(cardScrollableView.currentPage + 1);
}

//for (i in cardViews) { 
//	Ti.API.debug(cardViews[i]);
//	cardScrollableView.add(cardViews[i]); 
//}

var cardScrollableView = Titanium.UI.createScrollableView({
	views:cardViews,
	showPagingControl:false,
	clipViews:false,
	left:0
});

cardScrollableView.addEventListener('scroll', function(e) {
	Ti.API.debug('Scrolled to ' + cardViews[cardScrollableView.currentPage].card.prompt);
});

cardScrollableView.addEventListener('singletap', function(e) {
	Ti.API.debug("Tapped on " + cardViews[cardScrollableView.currentPage].card.prompt);
	Ti.API.debug(typeof(cardScrollableView.views[cardScrollableView.currentPage].card));
	//cardViews[cardScrollableView.currentPage].card.prompt;
	//cardScrollableView.currentPage.card.prompt.hide();
	//cardScrollableView.currentPage.card.answer.show();

});
win.add(cardScrollableView);
for (i in buttons) { win.add(buttons[i]); }

win.open();