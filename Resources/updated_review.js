// Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;
var win = Ti.UI.currentWindow;
win.name = "Review";
Ti.App.current_win = win;
cardGraded = false;
// Titanium.App.addEventListener('processCards', function() {
	// alert("yoooooo son!");
// });

Ti.include('commonMethods.js');
Ti.include('network.js');
Ti.include('dimensions.js');

buttonTopPad = 10;
buttonRightPad = 10;
buttonLeftPad = 10;
buttonHeight = ((screenHeight - (buttonTopPad * 5)) / 4);
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
// alert(win.doc_id);
// alert(win._context);
// getCards(win.doc_id, win._context);

function renderReview() {
	cards = win.cards;
	cardViews = [];
	count = 0
	if (cards.length <= 10) {
		for ( i in cards ) { 
			cardViews.push(createCardView(cards[i], cards[i].answer, cards[i].mem));
		}	
	} else {
		while (count <= 10 ) {
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
		height : 50,
		width : 50, 
		top : 15,
		left : cardLeftPad
	});
	closeButton.addEventListener('click', function() {
		// Ti.App.tabGroup.visible = true;
		Ti.App.reviewing = false;
		Ti.App.tabGroup.show();
		win.close();
	});
		
		
	cardScrollableView.addEventListener('scroll', function(e) {
		buttonView.animate(fadeOutAnimation);
		if (cards[cardScrollableView.currentPage].flipped == true) {
			buttonView.animate(fadeInAnimation);
		}
		if (cards.length > count) {
			cardScrollableView.addView(createCardView(cards[count], cards[count].answer, cards[count].mem));
			count++;		
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
		image : 'images/review-bg-solid@2x.png',
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
	// text.addEventListener('click', function() {
		// alert("supppppn bruh");
	// });
	answer.add(text);
	// var answer = Ti.UI.createLabel({
		// text : cardObject.answer,
		// textAlign : 'center',
		// width : cardBackground.width - 20,
		// height : cardBackground.height - 60
	// });
	
// 	
	// var text = Ti.UI.createLabel({
		// text : cardObject.answer,
		// textAlign : 'center',
		// width : cardBackground.width - 20,
		// height : cardBackground.height - 60
	// });

	


	// var progressLabel = Ti.UI.createLabel({
		// text : cardNumber + " / " + totalCards, 
		// textAlign : 'right',
		// right : 25, 
		// top : -180,
		// font:{fontSize:16},
		// color : 'gray'
	// });
	
	var skipButton = Titanium.UI.createImageView({
		image : 'images/skip@2x.png',
		bottom : 20,
		right : 30,
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
					Ti.App.reviewing = false;
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
				cardBackground.image = 'images/review-bg-solid@2x.png';
			} else {
				cardBackground.status = 'front';
				cardBackground.image = 'images/review-bg-solid@2x.png';
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

// function showGradeButtons(){
	// //TODO resolve
	// for (i in buttons) { 
		// // buttons[i].show();
		// // buttons[i].animate(fadeInAnimation); 
		// buttons[i].color = unselectedColor;
		// // buttons[i].backgroundImage = buttons[i].images["unselected"];
	// }
	// buttonView.animate(fadeInAnimation);
	// if ( cards[cardScrollableView.currentPage].grade != 0 ){
		// //TODO resolve
		// for (i in buttons) { 
			// // buttons[i].color = unselectedColor;
			// // buttons[i].backgroundImage = buttons[i].images["unselected"]; 
		// }
		// // Ti.API.debug(buttons[cards[cardScrollableView.currentPage]].images["selected"]);
// 
		// // buttons[cards[cardScrollableView.currentPage].grade - 1].color = selectedColor;
		// // buttons[cards[cardScrollableView.currentPage].grade - 1].backgroundImage = buttons[cards[cardScrollableView.currentPage].grade - 1].images["selected"];
	// }
// }

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
			Ti.App.reviewing = false;
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
	Ti.App.reviewing = false;
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

// function render() {
	// win.add(cardScrollableView);
	// win.add(buttonView);	
	// win.add(closeButton);
	// win.open();
// }

function reportGrade(memID, confidence) {
	// alert(confidence);
	var gradeValues = {
		4 : 9,
		3 : 6, 
		2 : 4, 
		1 : 1	
	};
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	xhr.open("POST", serverURL + "/mems/update/" + memID + "/" + gradeValues[confidence]  + "/0");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		Ti.API.debug('Posted confidence ' + gradeValues[confidence] + ' to ' + memID);
		Titanium.UI.iPhone.appBadge = Titanium.UI.iPhone.appBadge - 1;
	};
	xhr.send();
}

renderReview();




// 
// // Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;
// var win = Ti.UI.currentWindow;
// win.name = "Review";
// Ti.App.current_win = win;
// // alert(Ti.App.reviewing);
// // alert(Ti.App.current_win.name);
// // alert(win.reviewContext);
// // Titanium.UI.currentWindow.orientationModes = [
	// // Titanium.UI.LANDSCAPE_LEFT,
	// // Titanium.UI.LANDSCAPE_RIGHT	
// // ];
// // Titanium.UI.setBackgroundColor('#fff');
// // Titanium.UI.setBackgroundColor('#171717');
// Ti.include('networkMethods.js');
// Ti.include('dimensions.js');
// 
// buttonTopPad = 10;
// buttonRightPad = 10;
// buttonLeftPad = 10;
// buttonHeight = ((screenHeight - (buttonTopPad * 5)) / 4);
// cardLeftPad = 10;
// selectedColor = '3B5FD9';
// unselectedColor = 'gray';
// 
// // alert(win._parent.name);
// // win.nav.hide(win._parent);
// 
// // win._parent.hide();
// 
// cards = win.cards;
// cardViews = [];
// for ( i in cards ) { 
	// var cardNumber = i;
	// cardNumber++;
	// cardNumber = cardNumber.toString();
	// var cardLength = cards.length.toString();
	// cardViews.push(createCardView(cards[i], cardNumber, cardLength)); 
// }
// initialize(cardViews);
// 
// function initialize(cardViews) {
	// buttonView = Ti.UI.createView({
		// right : 0,
		// width : buttonHeight + buttonLeftPad + buttonRightPad
	// });
	// buttonView.opacity = 0;
// 	
	// button1 = Ti.UI.createButton({
		// title : 'Got it!',
		// images : { "unselected" : "images/got_it.png", "selected" : 'images/got_it_selected.png'},
		// grade : 4,
		// height : buttonHeight,
		// width : buttonHeight,
		// right : buttonRightPad,
		// top : buttonTopPad, 
		// // backgroundImage : "images/got_it.png",
		// color : unselectedColor
	// });
	// button2 = Ti.UI.createButton({
		// title : 'Kinda',
		// images : { "unselected" : "images/kinda.png", "selected" : 'images/kinda_selected.png'},
		// grade : 3,
		// height : buttonHeight,
		// width : buttonHeight,
		// right : buttonRightPad,
		// top : ((buttonTopPad * 2) + buttonHeight), 
		// // backgroundImage : "images/kinda.png",
		// color : unselectedColor
	// });
	// button3 = Ti.UI.createButton({
		// title : 'Barely',
		// images : { "unselected" : "images/barely.png", "selected" : 'images/barely_selected.png'},
		// grade : 2,
		// height : buttonHeight,
		// width : buttonHeight,
		// right : buttonRightPad,
		// top : ((buttonTopPad * 3) + (buttonHeight * 2)), 
		// // backgroundImage : "images/barely.png",
		// color : unselectedColor
	// });
	// button4 = Ti.UI.createButton({
		// title : 'No clue',
		// images : { "unselected" : "images/no_clue.png", "selected" : 'images/no_clue_selected.png'},
		// grade : 1,
		// height : buttonHeight,
		// width : buttonHeight,
		// right : buttonRightPad, 
		// top : ((buttonTopPad * 4) + (buttonHeight * 3)), 
		// // backgroundImage : "images/no_clue.png",
		// color : unselectedColor
	// });
// 	
	// buttons = [button4, button3, button2, button1]; //ADD BUTTON 4 BACK ON HERE
	// for (i in buttons) { 
		// // buttons[i].hide();
		// // buttons[i].opacity = 0;
		// buttons[i].addEventListener('touchstart', function(e) { buttonClicked(e); });
		// buttonView.add(buttons[i]);
	// }
// 	
	// closeButton = Ti.UI.createImageView({
		// image : 'images/new_close.png', 
		// height : 25,
		// width : 25, 
		// top : 10,
		// left : cardLeftPad
	// });
// 	
	// closeButton.addEventListener('click', function() {
		// if (win._parent.name != "Review") {
			// Titanium.UI.orientation = Titanium.UI.PORTRAIT;	
		// }
		// // win.hide();
		// // Ti.App.current_win = win._parent;
		// // win.nav.close(win);
		// // win._parent.show();
		// win.close();
		// Ti.App.tabGroup.visible = true;
		// win.nav.visible = true;
		// Ti.App.reviewing = false;
	// });
// 	
	// cardScrollableView = Titanium.UI.createScrollableView({
		// views:cardViews,
		// showPagingControl:false,
		// clipViews:false,
		// left:0
	// });
// 	
	// cardScrollableView.addEventListener('scroll', function(e) {
		// // for (i in buttons) { buttons[i].animate( fadeOutAnimation ); }
		// buttonView.animate(fadeOutAnimation);
		// if (cards[cardScrollableView.currentPage].flipped == false) {
// 			
			// //TODO chang bg img
			// for (i in buttons) { 
				// //buttons[i].hide();
				// buttons[i].color = unselectedColor;
				// // buttons[i].backgroundImage = buttons[i].images["unselected"];
				// //buttons[i].opacity = 0;
			// }
// 			
		// } else {
			// showGradeButtons();
		// }
	// });
// 
	// fadeInAnimation = Titanium.UI.createAnimation({
		// curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,
	    // opacity:1,
	    // duration:250
	// });
	// fadeOutAnimation = Titanium.UI.createAnimation({
		// curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,
	    // opacity:0,
	    // duration:250
	// });	
	// flipAnimation = Ti.UI.createAnimation({
		// transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT,
		// duration : 250
	// });
	// render();
// }
// 
// function createCardView(cardObject, cardNumber, totalCards) {
// 
	// // var cardBackground = Ti.UI.createImageView({
		// // image : 'images/card.png',
		// // status : 'front',
		// // width : (screenWidth - cardLeftPad - buttonLeftPad - buttonHeight - buttonRightPad),
		// // height : screenHeight - 80,
		// // left : cardLeftPad
	// // });
	// var cardBackground = Ti.UI.createImageView({
		// image : 'images/review-bg@2x.png',
		// status : 'front',
		// // height : 445
		// width : (screenWidth - cardLeftPad - buttonLeftPad - buttonHeight - buttonRightPad),
		// height : screenHeight - 80,
		// left : cardLeftPad		
	// });	
// 		
	// // var cardView = Ti.UI.createView({
		// // card : cardObject,
		// // width : cardLeftPad + cardBackground.width + buttonLeftPad, 
		// // left : 0
	// // });
	// var cardView = Ti.UI.createView({
		// card : cardObject,
		// width : 350,
		// height : 450
		// // width : cardLeftPad + cardBackground.width + buttonLeftPad, 
		// // left : 0
	// });	
// 	
	// var prompt = Ti.UI.createLabel({
		// text : cardObject.prompt,
		// textAlign : 'center',
		// width : cardBackground.width - 20
	// });
// 
	// var answer = Ti.UI.createLabel({
		// text : cardObject.answer,
		// textAlign : 'center',
		// width : cardBackground.width - 20,
		// height : cardBackground.height - 60
	// });
// 
	// var progressLabel = Ti.UI.createLabel({
		// text : cardNumber + " / " + totalCards, 
		// textAlign : 'right',
		// right : 25, 
		// top : -180,
		// font:{fontSize:16},
		// color : 'gray'
	// });
// 	
	// prompt.show();	
	// answer.hide();
// 	
	// cardView.add(cardBackground);
	// cardView.add(progressLabel);
	// cardView.add(prompt);
	// cardView.add(answer);
// 		
	// cardView.addEventListener('singletap', function(e) {		
		// cardView.animate({
			// view : cardBackground,
			// transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT, 
			// duration : 250
		// });
// 		
		// if ( cardBackground.status == 'front' ) {
			// cardBackground.status = 'back';
			// cardBackground.image = 'images/review-bg@2x.png';
		// } else {
			// cardBackground.status = 'front';
			// cardBackground.image = 'images/review-bg@2x.png';
		// }
// 		
		// // showGradeButtons();
		// if (prompt.visible == true) {
			// prompt.hide();
			// cardView.add(answer);
			// cardView.add(progressLabel);
			// answer.show();
			// // Ti.API.debug('Showing answer! ' + answer.visible);
		// } else {
			// cardView.add(prompt);
			// cardView.add(progressLabel);
			// prompt.show();
			// answer.hide();			
		// }
		// cards[cardScrollableView.currentPage].flipped = true;
	// });	
	// // cardView.card = cardObject;
	// return cardView;
// }
// 
// function showGradeButtons(){
	// //TODO resolve
	// for (i in buttons) { 
		// // buttons[i].show();
		// // buttons[i].animate(fadeInAnimation); 
		// buttons[i].color = unselectedColor;
		// // buttons[i].backgroundImage = buttons[i].images["unselected"];
	// }
	// buttonView.animate(fadeInAnimation);
	// if ( cards[cardScrollableView.currentPage].grade != 0 ){
		// //TODO resolve
		// for (i in buttons) { 
			// buttons[i].color = unselectedColor;
			// // buttons[i].backgroundImage = buttons[i].images["unselected"]; 
		// }
		// // Ti.API.debug(buttons[cards[cardScrollableView.currentPage]].images["selected"]);
// 
		// // buttons[cards[cardScrollableView.currentPage].grade - 1].color = selectedColor;
		// // buttons[cards[cardScrollableView.currentPage].grade - 1].backgroundImage = buttons[cards[cardScrollableView.currentPage].grade - 1].images["selected"];
	// }
// }
// 
// function buttonClicked(button) {
	// cards[cardScrollableView.currentPage].grade = button.source.grade;
	// reportGrade(cards[cardScrollableView.currentPage].memID, cards[cardScrollableView.currentPage].grade);
	// buttonView.animate(fadeOutAnimation);
	// //TODO resolve
	// for (i in buttons) { 
		// buttons[i].color = unselectedColor;
		// // buttons[i].backgroundImage = buttons[i].images["unselected"];
		// // buttons[i].animate(fadeOutAnimation); 
	// }
	// if ( ( cardViews.length - 1 ) >= ( cardScrollableView.currentPage + 1 ) ) {
		// cardScrollableView.scrollToView( cardScrollableView.currentPage + 1 );
	// } else {
		// if (win._context == "push") {
			// win._parent.show();
			// if (win._parent.name != "Review") {
				// Titanium.UI.orientation = Titanium.UI.PORTRAIT;	
			// }
			// Ti.App.current_win = win._parent;
			// win.nav.close(win);
		// } else {
			// // alert("Bromine");
			// var newWin = Ti.UI.createWindow({
				// url : "stats.js",
				// navBarHidden : true,
				// nav : win.nav,
				// data : cards,
				// // views : cardViews,
				// folder : win.folder,
				// _parent: Titanium.UI.currentWindow
			// });	
			// win.nav.close(win);
			// // win.hide();
			// // Ti.App.current_win = win._parent;
			// // win.nav.close(win);
			// // win._parent.show();
			// // Ti.App.tabGroup.visible = true;
			// // win.nav.visible = true;
			// // alert("Bromine");
			// // win.hide();
			// // win._parent.show();
			// newWin.open();
			// // win.nav.open(newWin);			
		// }
	// }
// }
// 
// function render() {
	// win.add(cardScrollableView);
	// win.add(buttonView);
	// // for (i in buttons) { win.add(buttons[i]); }
// 	
	// win.add(closeButton);
	// win.open();
// }
