Titanium.UI.setBackgroundColor('#171717');
Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;

container = Ti.UI.currentWindow;

var win = Titanium.UI.createWindow({
	navBarHidden : true
});


var nav = Titanium.UI.iPhone.createNavigationGroup({
   window : win
});

container.add(nav);


//var win = Ti.UI.createWindow({});

//win.navBarHidden = false;

var back = Ti.UI.createButton({
    title:'Close',
    style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});

back.addEventListener('click', function(){
	win.close();
});

win.leftNavButton = back;

//@PLATFORM - This may need to be adjusted for Android
screenHeight = Ti.Platform.displayCaps.platformHeight - 20;
screenWidth = Ti.Platform.displayCaps.platformWidth;
Ti.API.debug('Screen height: ' + screenHeight + ", screen width: " + screenWidth);
buttonTopPad = 10;
buttonRightPad = 10;
buttonLeftPad = 10;
buttonHeight = ((screenHeight - (buttonTopPad * 5)) / 4);
cardLeftPad = 10;

card1 = createCard('Jason', 'Urton');
card2 = createCard('Bill', 'DeRusha');
card3 = createCard('Josh', 'Silverman');
card4 = createCard('Word', 'Up');
card5 = createCard('Water', 'Bottle');
card6 = createCard('Benefit', 'Street');
card7 = createCard('ATP', 'Adenosine Triphosphate');
card8 = createCard('Ultra long monologue on the importance of being prompt to any and all social gatherings', 'Insert long winded answer');

cards = [card1, card2, card3, card4, card5, card6, card7, card8];
cardViews = []

initialize();

function initialize() {
	
	buttonView = Ti.UI.createView({});
	button1 = Ti.UI.createButton({
		title : 'Got it!',
		grade : 1,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad,
		top : buttonTopPad, 
		color : 'gray'
	})
	button2 = Ti.UI.createButton({
		title : 'Kinda',
		grade : 2,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad,
		top : ((buttonTopPad * 2) + buttonHeight), 
		color : 'gray'
	})
	button3 = Ti.UI.createButton({
		title : 'Barely',
		grade : 3,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad,
		top : ((buttonTopPad * 3) + (buttonHeight * 2)), 
		color : 'gray'
	})
	button4 = Ti.UI.createButton({
		title : 'No clue',
		grade : 4,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad, 
		top : ((buttonTopPad * 4) + (buttonHeight * 3)), 
		color : 'gray'
	})
	
	buttons = [button1, button2, button3, button4];
	for (i in buttons) { 
		buttons[i].hide();
		buttons[i].opacity = 0;
		buttons[i].addEventListener('click', function(e) { buttonClicked(e); });
		buttonView.add(buttons[i]);
	}
	
	for (i in cards) { cardViews.push(createCardView(cards[i])); }
	
	fadeInAnimation = Titanium.UI.createAnimation({
		curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,
	    opacity:1,
	    duration:250
	});
		
	flipAnimation = Ti.UI.createAnimation({
		transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT,
		duration : 250
	});
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

	var card = Ti.UI.createImageView({
		image : 'images/card.png',
		width : (screenWidth - cardLeftPad - buttonLeftPad - buttonHeight - buttonRightPad),
		//height : screenHeight - 20,
		left : cardLeftPad
	});
	
	var cardView = Ti.UI.createView({
		card : cardObject,
		width : cardLeftPad + card.width + buttonLeftPad, 
		left : 0
	});
	
	var prompt = Ti.UI.createLabel({
		text : cardObject.prompt,
		textAlign : 'center',
		width : card.width - 20
	});

	var answer = Ti.UI.createLabel({
		text : cardObject.answer,
		textAlign : 'center',
		width : card.width - 20
	});

	prompt.show();	
	answer.hide();
	
	cardView.add(card);
	cardView.add(prompt);
	cardView.add(answer);
	
	cardView.addEventListener('singletap', function(e) {
		cardView.animate({
			view : card,
			transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT, 
			duration : 250
		});
		showGradeButtons();
		if (prompt.visible == true) {
			prompt.hide();
			cardView.add(answer);
			answer.show();
			Ti.API.debug('Showing answer! ' + answer.visible);

		} else {
			cardView.add(prompt);
			prompt.show();
			answer.hide();			
		}
		
		cards[cardScrollableView.currentPage].flipped = true;
	});	
	
	return cardView;
	
}

function showGradeButtons(){
	for (i in buttons) { 
		buttons[i].show();
		buttons[i].animate(fadeInAnimation); 
		buttons[i].color = 'gray';
	}
	if ( cards[cardScrollableView.currentPage].grade != 0 ){
		for (i in buttons) { buttons[i].color = 'gray'; }
		buttons[cards[cardScrollableView.currentPage].grade - 1].color = '#336699';
	}
	
}

function buttonClicked(button) {
	cards[cardScrollableView.currentPage].grade = button.source.grade;
	//Ti.API.debug(cards[cardScrollableView.currentPage].prompt + " given grade: " + cards[cardScrollableView.currentPage].grade);
	for (i in buttons) { 
		buttons[i].hide();
		buttons[i].color = 'gray'; 
	}
	cardScrollableView.scrollToView(cardScrollableView.currentPage + 1);
}


var cardScrollableView = Titanium.UI.createScrollableView({
	views:cardViews,
	showPagingControl:false,
	clipViews:false,
	left:0
});

cardScrollableView.addEventListener('scroll', function(e) {
	if (cards[cardScrollableView.currentPage].flipped == false) {
		for (i in buttons) { 
			buttons[i].hide();
			buttons[i].color = 'gray';
			buttons[i].opacity = 0;
		}
	} else {
		showGradeButtons();
	}
});

win.add(cardScrollableView);
//win.add(buttonView);
for (i in buttons) { win.add(buttons[i]); }

//Ti.API.debug('Screen width = ' + screenWidth + ", cardView width = " + card.width)

win.open();