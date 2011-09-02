// Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;
var win = Ti.UI.currentWindow;
win.name = "Review";
Ti.App.current_win = win;
cardGraded = false;


Ti.include('commonMethods.js');
Ti.include('network.js');
Ti.include('dimensions.js');

buttonTopPad = 10;
buttonRightPad = 10;
buttonLeftPad = 10;
// buttonHeight = ((screenHeight - (buttonTopPad * 5)) / 4);
buttonHeight = 55;
cardLeftPad = 10;
selectedColor = '3B5FD9';
unselectedColor = 'gray';

fadeInAnimation = Titanium.UI.createAnimation({
	curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,
    opacity:1,
    duration:250
});
fadeOutAnimation = Titanium.UI.createAnimation({
	curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,
    opacity:0,
    duration:250
});	
flipAnimation = Ti.UI.createAnimation({
	transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT,
	duration : 250
});

shortSession = true;

function renderReview() {
	cards = win.cards;
	cardViews = [];
	count = 0;
	if (cards.length <= 10) {
		for ( i in cards ) {
			cards[i].flipped = false;
			cardViews.push(createCardView(cards[i], cards[i].answer, cards[i].mem));
		}	
	} else {
		shortSession = false;
		while (count < 10 ) {
			cards[count].flipped = false;
			cardViews.push(createCardView(cards[count], cards[count].answer, cards[count].mem));
			count++;
		}
	}
	cardScrollableView = Titanium.UI.createScrollableView({
		views:cardViews,
		showPagingControl:false,
		clipViews:false,
		left:0
	});
	
	// alert(JSON.stringify(cardScrollableView));
	
	buttonView = Ti.UI.createView({
		bottom : 0,
		width : screenWidth, 
		height : buttonHeight
	});
	buttonView.opacity = 0;
	button1 = Ti.UI.createImageView({
		image : 'images/got-it@2x.png',
		grade : 4,
		height : buttonHeight,
		width : buttonHeight,
		bottom : 12,
		left : 100
	});
	button2 = Ti.UI.createImageView({
		image : 'images/kinda@2x.png',
		grade : 3,
		height : buttonHeight,
		width : buttonHeight,
		bottom : 12,
		left : 172
	});
	button3 = Ti.UI.createImageView({
		image : 'images/barely@2x.png',
		grade : 2,
		height : buttonHeight,
		width : buttonHeight,
		bottom : 12,
		right : 172
	});
	button4 = Ti.UI.createImageView({
		image : 'images/no-clue@2x.png',
		grade : 1,
		height : buttonHeight,
		width : buttonHeight,
		bottom : 12,
		right : 100
	});
	buttons = [button4, button3, button2, button1]; //ADD BUTTON 4 BACK ON HERE
	for (i in buttons) { 
		buttons[i].addEventListener('touchstart', function(e) { 
			buttonClicked(e); 
		});
		buttonView.add(buttons[i]);
	}
	closeButton = Ti.UI.createImageView({
		image : 'images/close@2x.png', 
		height : 40,
		width : 40, 
		top : 12,
		left : 20
	});
	closeButton.addEventListener('click', function() {
		// Ti.App.tabGroup.visible = true;
		// Ti.App.reviewing = false;
		Ti.App.tabGroup.show();
		win.close();
	});
		
		
	cardScrollableView.addEventListener('scroll', function(e) {
		buttonView.animate(fadeOutAnimation);
		// alert(cards);
		// alert(cardScrollableView.currentPage);
		// alert(cards[cardScrollableView.currentPage]);
		if (cards[cardScrollableView.currentPage].flipped == true) {
			buttonView.animate(fadeInAnimation);
		}
		// alert(count);
		if (shortSession == false){
			if (cards.length > count) {
				cardScrollableView.addView(createCardView(cards[count], cards[count].answer, cards[count].mem));
				count++;		
			}	
		}

	});
	
	
	win.add(cardScrollableView);
	win.add(buttonView);	
	win.add(closeButton);
}

// initialize(cardViews);


function createCardView(cardObject, cardNumber, totalCards) {

	// alert(cardObject.prompt);
	// alert(cardObject.answer);

	var cardBackground = Ti.UI.createImageView({
		image : 'images/review-bg@2x.png',
		status : 'front',
		// height : 445
		left : 20,
		width : 310,
		height : 550
		// width : (screenWidth - cardLeftPad - buttonLeftPad - buttonHeight - buttonRightPad),
		// height : screenHeight - 80,
		// left : cardLeftPad		
	});		

	var cardView = Ti.UI.createView({
		card : cardObject,
		width : 350,
		height : 450
		// width : cardLeftPad + cardBackground.width + buttonLeftPad, 
		// left : 0
	});
	
	var prompt = Ti.UI.createLabel({
		text : cardObject.prompt,
		textAlign : 'center',
		width : 300,
		font:{fontSize:20,fontFamily:'Arial'}
	});

	var answer = Titanium.UI.createScrollView({
		contentWidth:50,
		contentHeight:50,
		// backgroundColor : '#000',
		height:300,
		width:280,		
		top:75,
		showVerticalScrollIndicator:true
	});
	// answer.addEventListener('click', function() {
		// alert('yo');
	// });
// 
	var text = Titanium.UI.createTextArea({
		value:cardObject.answer,
		editable : false,
		// height:300,
		// width:280,
		// top:75,
		verticalAlign : 'center',
        bottom: 0,
        // height:'auto',		
		font:{fontSize:20,fontFamily:'Arial'},
		color:'#888',
		textAlign:'center',
		borderWidth:1,
		borderColor:'#bbb',
		borderRadius:5
	});

	answer.add(text);

	var skipButton = Titanium.UI.createImageView({
		image : 'images/skip@2x.png',
		bottom : 8,
		right : 23,
		height : 60, 
		width : 60,
		action : "skip"
	});
// 	
	

	prompt.show();	
	answer.hide();
	// skipButton.show();		

	// cardView.add(scrollView);
	cardView.add(cardBackground);
	// cardView.add(progressLabel);
	cardView.add(prompt);
	// cardView.add(answer);
	// alert(cards.length);
	// alert(cardScrollableView.currentPage);
	cardView.add(skipButton);
	// win.add(cardView);

	cardView.addEventListener('singletap', function(e) {
		// alert(cards);
		// alert(cards[cardScrollableView.currentPage].flipped);
		if (e.source.action == "skip") {
			// getLines(4095, "push");
			if ( ( cardScrollableView.views.length - 1 ) >= ( cardScrollableView.currentPage + 1 ) ) {
				cardScrollableView.scrollToView( cardScrollableView.currentPage + 1 );
			} else {
				if (cardGraded == true) {
					openStats();
				} else {
					// Ti.App.reviewing = false;
					Ti.App.tabGroup.show();
					win.close();
				}
			}
			return;
		} else {
			cardView.animate({
				view : cardBackground,
				transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT, 
				duration : 250
			});
			if ( cardBackground.status == 'front' ) {
				cardBackground.status = 'back';
				cardBackground.image = 'images/review-bg@2x.png';
			} else {
				cardBackground.status = 'front';
				cardBackground.image = 'images/review-bg@2x.png';
			}
			
			
			buttonView.animate(fadeInAnimation);
			// alert(JSON.stringify(prompt));
			// alert(JSON.stringify(answer));	
			if (prompt.visible == true) {
				prompt.hide();
				skipButton.hide();
				cardView.add(answer);
				// cardView.add(progressLabel);
				answer.show();
				prompt.visible = false;
				// Ti.API.debug('Showing answer! ' + answer.visible);
			} else {
				// skipButton.hide();
				// alert("show prompt");
				answer.hide();		
	
				cardView.add(prompt);
				// cardView.add(progressLabel);
				prompt.show();
				prompt.visible = true;
			}
			cards[cardScrollableView.currentPage].flipped = true;
		}
	});	
	cardView.card = cardObject;
	return cardView;
}


function buttonClicked(button) {
	cardGraded = true;
	// alert(button.source.grade);
	// alert(cards[cardScrollableView.currentPage].grade);
	cards[cardScrollableView.currentPage].grade = button.source.grade;
	// alert(cards[cardScrollableView.currentPage].grade);
	//Everything being posted 9
	// alert(cards[cardScrollableView.currentPage].mem);
	// alert(button.source.grade);
	// alert(cards[cardScrollableView.currentPage].grade);
	reportGrade(cards[cardScrollableView.currentPage].mem, button.source.grade);
	buttonView.animate(fadeOutAnimation);
	if ( ( cardScrollableView.views.length - 1 ) >= ( cardScrollableView.currentPage + 1 ) ) {
		cardScrollableView.scrollToView( cardScrollableView.currentPage + 1 );
	} else {
		if (win._context == "push") {
			// Ti.App.reviewing = false;
			Ti.App.tabGroup.show();
			win.close();
		} else {
			openStats();
		}
	}
}

function openStats() {
	win.hide();
	Ti.App.tabGroup.hide();
	// Ti.App.reviewing = false;
	var newWin = Ti.UI.createWindow({
		url : "stats.js",
		navBarHidden : true,
		// nav : win.nav,
		data : cards,
		folder : win.folder,
		_parent: win
	});	
	newWin.open();	
}


function reportGrade(memID, confidence) {
	// alert(confidence);
	var gradeValues = {
		4 : 9,
		3 : 6, 
		2 : 4, 
		1 : 1	
	};
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(10000);
	xhr.open("POST", serverURL + "/mems/update/" + memID + "/" + gradeValues[confidence]  + "/0");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		Ti.API.debug('Posted confidence ' + gradeValues[confidence] + ' to ' + memID);
		Titanium.UI.iPhone.appBadge = Titanium.UI.iPhone.appBadge - 1;
	};
	xhr.send();
}

renderReview();
