var win = Ti.UI.currentWindow;
win.name = "Review";
Ti.App.current_win = win;
cardGraded = false;

Ti.include('commonMethods.js');
Ti.include('network.js');
// Ti.include('dimensions.js');

buttonHeight = 55;
buttonLeftPad = (((Ti.Platform.displayCaps.platformWidth / 4) - buttonHeight ) / 2 );
selectedColor = '3B5FD9';
unselectedColor = 'gray';

fadeInAnimation = Titanium.UI.createAnimation({
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
    opacity : 1,
    duration : 250
});
fadeOutAnimation = Titanium.UI.createAnimation({
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
    opacity : 0,
    duration : 250
});	
flipAnimation = Ti.UI.createAnimation({
	transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT,
	duration : 250
});

shortSession = true;

function renderReview() {
	cards = win.cards.terms;
	cardViews = [];
	count = 0;
	if (cards.length <= 10) {
		for ( i in cards ) {
			// alert('yo');
			cardViews.push(createCardView(cards[i]));
			cards[i].flipped = false;
			// cardViews.push(createFlashcardView(cards[i], cards[i].term.name, cards[i].term.mems[0].id));
		}	
	} else {
		shortSession = false;
		while (count < 10 ) {
			// alert('yo');
			cards[count].flipped = false;
			// cardViews.push(createFlashcardView(cards[count], cards[count].term.name, cards[count].term.mems[0].id));
			cardViews.push(createCardView(cards[count]));
			count++;
		}
	}
	
	cardScrollableView = Titanium.UI.createScrollableView({
		views : cardViews,
		showPagingControl : false,
		clipViews : false,
		left : 0
	});
		
	buttonView = Ti.UI.createView({
		bottom : 0,
		width : Ti.Platform.displayCaps.platformWidth, 
		height : buttonHeight
	});
	buttonView.opacity = 0;
	button1 = Ti.UI.createImageView({
		image : 'images/got-it@2x.png',
		grade : 4,
		height : buttonHeight,
		width : buttonHeight,
		bottom : 12,
		left : buttonLeftPad
	});
	button2 = Ti.UI.createImageView({
		image : 'images/kinda@2x.png',
		grade : 3,
		height : buttonHeight,
		width : buttonHeight,
		bottom : 12,
		left : ( buttonLeftPad * 3 ) + buttonHeight
	});
	button3 = Ti.UI.createImageView({
		image : 'images/barely@2x.png',
		grade : 2,
		height : buttonHeight,
		width : buttonHeight,
		bottom : 12,
		left : ( buttonLeftPad * 5) + ( buttonHeight * 2 )
	});
	button4 = Ti.UI.createImageView({
		image : 'images/no-clue@2x.png',
		grade : 1,
		height : buttonHeight,
		width : buttonHeight,
		bottom : 12,
		left : ( buttonLeftPad * 7) + ( buttonHeight * 3 )
	});
	buttons = [button4, button3, button2, button1];
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
		// if (win._context == "push") {
			// Ti.App.fireEvent('updateNavBar');
		// }
		cleanLoadingState();		
		Ti.App.tabGroup.show();
		win.close();
	});
		
	cardScrollableView.addEventListener('scroll', function(e) {
		buttonView.animate(fadeOutAnimation);
		if (cards[cardScrollableView.currentPage].flipped == true) {
			buttonView.animate(fadeInAnimation);
		}
		if (shortSession == false){
			if (cards.length > count) {
				cardScrollableView.addView(createFlashcardView(cards[count], cards[count].answer, cards[count].mem));
				count++;		
			}	
		}
	});

	win.add(cardScrollableView);
	win.add(buttonView);	
	win.add(closeButton);	
}

function buttonClicked(button) {
	cleanLoadingState();
	cardGraded = true;
	cards[cardScrollableView.currentPage].grade = button.source.grade;
	reportGrade(cards[cardScrollableView.currentPage].term.mems[0].id, button.source.grade);
	buttonView.animate(fadeOutAnimation);
	if ( ( cardScrollableView.views.length - 1 ) >= ( cardScrollableView.currentPage + 1 ) ) {
		cardScrollableView.scrollToView( cardScrollableView.currentPage + 1 );
	} else {
		if (win._context == "push") {
			Ti.App.tabGroup.show();
			win.close();
		} else {
			openStats();
		}
	}
}

function openStats() {
	cleanLoadingState();
	win.hide();
	Ti.App.tabGroup.hide();
	var newWin = Ti.UI.createWindow({
		url : "stats.js",
		navBarHidden : true,
		data : cards,
		folder : win.folder,
		_parent: win
	});	
	newWin.open();	
}

function reportGrade(memID, confidence) {
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
	xhr.setRequestHeader('Cookie', Ti.App.Properties.getString('cookie'));
	xhr.onload = function() {
		if (win._context == "push") { Titanium.UI.iPhone.appBadge = Titanium.UI.iPhone.appBadge - 1; }
		Ti.App.fireEvent('updateNavBar');
		Ti.App.recentDirty = true;
	};
	xhr.send();
}

function cleanLoadingState() {
	if ( win.listView != null ) {
		win.listView.opacity = 1;
		win.activityIndicator.hide();
	}
}

function createCardView(cardObject) {

	switch (cardObject.term.phase) {
		case 1:
			return createLearningView(
				cardObject.term.name,
				cardObject.term.definition				
			);
		case 2:
			//TODO where is the MC question generated?
			return createMultipleChoiceView(
				"Which of the following is the term for the center of a cell?", 
				cardObject.term.name,
				cardObject.term.answers
			);
		case 3:
			//TODO where is the fill in the blank question generated?
			return createFillInTheBlankView(
				"Here is a fill in the _____ question.", 
				cardObject.term.name
			);
		case 4:
			return createFlashcardView(
				cardObject.term.name,
				cardObject.term.definition
			);
	}
}


function createLearningView(prompt, definition) {

	var cardBackground = Ti.UI.createImageView({
		image : 'images/review-bg@2x.png',
		status : 'front',
		left : 20,
		width : 310,
		height : 550	
	});		

	var cardView = Ti.UI.createView({
		width : 350,
		height : 450
	});
		
	//TODO appropriate prompt length
	if ( prompt.length < 300 ) {
		var prompt_text = Ti.UI.createLabel({
			text : prompt,
			height : 60,
			textAlign : 'center',
			verticalAlign : 'center',
			font : {fontSize : 20, fontFamily : 'Arial'}
		});	
		var prompt = Titanium.UI.createScrollView({
			contentWidth : 'auto',
			contentHeight : 'auto',
			height : 60,
			width : 280,		
			top : 65,
			layout : 'vertical'
		});		
	} else {
		var prompt_text = Ti.UI.createLabel({
			text : prompt,
			height : 'auto',
			textAlign : 'center',
			verticalAlign : 'center',
			top : 65,
			font:{fontSize:20,fontFamily:'Arial'}
		});	
		var prompt = Titanium.UI.createScrollView({
			contentWidth : 'auto',
			contentHeight : 'auto',
			height : 60,
			width : 280,		
			top : 65,
			borderWidth : 1,
			borderColor : '#bbb',
			borderRadius : 5,
			layout : 'vertical'
		});				
	}
	
	prompt.add(prompt_text);
	
	var answer = Titanium.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		height : 250,
		width : 280,		
		bottom : 75,
		borderWidth : 1,
		borderColor : '#bbb',
		borderRadius : 5,
		layout : 'vertical'
	});
	
	if ( definition.length < 300 ) {
		var text = Titanium.UI.createLabel({
			text : definition,
			height : 250,
			textAlign : 'center',
			verticalAlign : 'center',
	        bottom: 0,
			font : { fontSize : 20, fontFamily : 'Arial' },
			color : '#888',
		});		
	} else {
		var text = Titanium.UI.createLabel({
			text : definition,
			height : 'auto',
			textAlign : 'center',
			verticalAlign : 'center',
		    bottom: 0,
			font : { fontSize : 20, fontFamily : 'Arial' },
			color : '#888',
		});		
	}

	answer.add(text);

	var skipButton = Titanium.UI.createImageView({
		image : 'images/skip@2x.png',
		bottom : 8,
		right : 23,
		height : 60, 
		width : 60,
		action : "skip"
	});
	prompt.show();	

	cardView.add(cardBackground);
	cardView.add(prompt);
	cardView.add(answer);
	cardView.add(skipButton);
	
	return cardView;	
}

function createMultipleChoiceView(prompt, definition, answers) {

	//TODO insert MC question view from PC
	var cardView = Ti.UI.createView({
		width : 350,
		height : 450
	});	

	var cardBackground = Ti.UI.createImageView({
		image : 'images/review-bg@2x.png',
		status : 'front',
		left : 20,
		width : 310,
		height : 550	
	});		

	return cardView;

}

function createFillInTheBlankView(prompt, definition) {
	var cardBackground = Ti.UI.createImageView({
		image : 'images/review-bg@2x.png',
		status : 'front',
		left : 20,
		width : 310,
		height : 550	
	});		

	var cardView = Ti.UI.createView({
		width : 350,
		height : 450
	});
		
	if ( prompt.length < 300 ) {
		var prompt_text = Ti.UI.createLabel({
			text : prompt,
			height : 300,
			textAlign : 'center',
			verticalAlign : 'center',
			bottom : 0,
			font : {fontSize : 20, fontFamily : 'Arial'}
		});	
		var prompt = Titanium.UI.createScrollView({
			contentWidth : 'auto',
			contentHeight : 'auto',
			height : 300,
			width : 280,		
			top : 75,
			layout : 'vertical'
		});		
	} else {
		var prompt_text = Ti.UI.createLabel({
			text : prompt,
			height : 'auto',
			textAlign : 'center',
			verticalAlign : 'center',
			bottom : 0,
			font:{fontSize:20,fontFamily:'Arial'}
		});	
		var prompt = Titanium.UI.createScrollView({
			contentWidth : 'auto',
			contentHeight : 'auto',
			height : 300,
			width : 280,		
			top : 75,
			borderWidth : 1,
			borderColor : '#bbb',
			borderRadius : 5,
			layout : 'vertical'
		});				
	}
	
	prompt.add(prompt_text);
	
	var answer = Titanium.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		height : 300,
		width : 280,		
		top : 75,
		borderWidth : 1,
		borderColor : '#bbb',
		borderRadius : 5,
		layout : 'vertical'
	});
	
	if ( definition.length < 300 ) {
		var text = Titanium.UI.createLabel({
			text : definition,
			height : 300,
			textAlign : 'center',
			verticalAlign : 'center',
	        bottom: 0,
			font : { fontSize : 20, fontFamily : 'Arial' },
			color : '#888',
		});		
	} else {
		var text = Titanium.UI.createLabel({
			text : definition,
			height : 'auto',
			textAlign : 'center',
			verticalAlign : 'center',
		    bottom: 0,
			font : { fontSize : 20, fontFamily : 'Arial' },
			color : '#888',
		});		
	}

	answer.add(text);

	var skipButton = Titanium.UI.createImageView({
		image : 'images/skip@2x.png',
		bottom : 8,
		right : 23,
		height : 60, 
		width : 60,
		action : "skip"
	});
	prompt.show();	
	answer.hide();
	cardView.add(cardBackground);
	cardView.add(prompt);
	cardView.add(skipButton);
	cardView.addEventListener('singletap', function(e) {
		if (e.source.action == "skip") {
			cleanLoadingState();
			reportGrade(cards[cardScrollableView.currentPage].term.mems[0].id, 4);
			if ( ( cardScrollableView.views.length - 1 ) >= ( cardScrollableView.currentPage + 1 ) ) {
				cardScrollableView.scrollToView( cardScrollableView.currentPage + 1 );
			} else {
				if (cardGraded == true) {
					openStats();
				} else {
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
			if (prompt.visible == true) {
				prompt.hide();
				skipButton.hide();
				cardView.add(answer);
				answer.show();
				prompt.visible = false;
			} else {
				answer.hide();		
				cardView.add(prompt);
				prompt.show();
				prompt.visible = true;
			}
			cards[cardScrollableView.currentPage].flipped = true;
		}
	});	
	return cardView;
}

function createFlashcardView(prompt, definition) {

	var cardBackground = Ti.UI.createImageView({
		image : 'images/review-bg@2x.png',
		status : 'front',
		left : 20,
		width : 310,
		height : 550	
	});		

	var cardView = Ti.UI.createView({
		width : 350,
		height : 450
	});
		
	if ( prompt.length < 300 ) {
		var prompt_text = Ti.UI.createLabel({
			text : prompt,
			height : 300,
			textAlign : 'center',
			verticalAlign : 'center',
			bottom : 0,
			font : {fontSize : 20, fontFamily : 'Arial'}
		});	
		var prompt = Titanium.UI.createScrollView({
			contentWidth : 'auto',
			contentHeight : 'auto',
			height : 300,
			width : 280,		
			top : 75,
			layout : 'vertical'
		});		
	} else {
		var prompt_text = Ti.UI.createLabel({
			text : prompt,
			height : 'auto',
			textAlign : 'center',
			verticalAlign : 'center',
			bottom : 0,
			font:{fontSize:20,fontFamily:'Arial'}
		});	
		var prompt = Titanium.UI.createScrollView({
			contentWidth : 'auto',
			contentHeight : 'auto',
			height : 300,
			width : 280,		
			top : 75,
			borderWidth : 1,
			borderColor : '#bbb',
			borderRadius : 5,
			layout : 'vertical'
		});				
	}
	
	prompt.add(prompt_text);
	
	var answer = Titanium.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		height : 300,
		width : 280,		
		top : 75,
		borderWidth : 1,
		borderColor : '#bbb',
		borderRadius : 5,
		layout : 'vertical'
	});
	
	if ( definition.length < 300 ) {
		var text = Titanium.UI.createLabel({
			text : definition,
			height : 300,
			textAlign : 'center',
			verticalAlign : 'center',
	        bottom: 0,
			font : { fontSize : 20, fontFamily : 'Arial' },
			color : '#888',
		});		
	} else {
		var text = Titanium.UI.createLabel({
			text : definition,
			height : 'auto',
			textAlign : 'center',
			verticalAlign : 'center',
		    bottom: 0,
			font : { fontSize : 20, fontFamily : 'Arial' },
			color : '#888',
		});		
	}

	answer.add(text);

	var skipButton = Titanium.UI.createImageView({
		image : 'images/skip@2x.png',
		bottom : 8,
		right : 23,
		height : 60, 
		width : 60,
		action : "skip"
	});
	prompt.show();	
	answer.hide();
	cardView.add(cardBackground);
	cardView.add(prompt);
	cardView.add(skipButton);
	cardView.addEventListener('singletap', function(e) {
		if (e.source.action == "skip") {
			cleanLoadingState();
			reportGrade(cards[cardScrollableView.currentPage].term.mems[0].id, 4);
			if ( ( cardScrollableView.views.length - 1 ) >= ( cardScrollableView.currentPage + 1 ) ) {
				cardScrollableView.scrollToView( cardScrollableView.currentPage + 1 );
			} else {
				if (cardGraded == true) {
					openStats();
				} else {
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
			if (prompt.visible == true) {
				prompt.hide();
				skipButton.hide();
				cardView.add(answer);
				answer.show();
				prompt.visible = false;
			} else {
				answer.hide();		
				cardView.add(prompt);
				prompt.show();
				prompt.visible = true;
			}
			cards[cardScrollableView.currentPage].flipped = true;
		}
	});	
	return cardView;	
}



renderReview();