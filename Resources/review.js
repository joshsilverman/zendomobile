// Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;
var win = Ti.UI.currentWindow;
win.name = "Review";
Ti.App.current_win = win;
// alert(Ti.App.reviewing);
// alert(Ti.App.current_win.name);
// alert(win.reviewContext);
// Titanium.UI.currentWindow.orientationModes = [
	// Titanium.UI.LANDSCAPE_LEFT,
	// Titanium.UI.LANDSCAPE_RIGHT	
// ];
// Titanium.UI.setBackgroundColor('#fff');
// Titanium.UI.setBackgroundColor('#171717');
Ti.include('networkMethods.js');
Ti.include('dimensions.js');

buttonTopPad = 10;
buttonRightPad = 10;
buttonLeftPad = 10;
buttonHeight = ((screenHeight - (buttonTopPad * 5)) / 4);
cardLeftPad = 10;
selectedColor = '3B5FD9';
unselectedColor = 'gray';

// alert(win._parent.name);
// win.nav.hide(win._parent);

// win._parent.hide();

cards = win.cards;
cardViews = [];
for ( i in cards ) { 
	var cardNumber = i;
	cardNumber++;
	cardNumber = cardNumber.toString();
	var cardLength = cards.length.toString();
	cardViews.push(createCardView(cards[i], cardNumber, cardLength)); 
}
initialize(cardViews);

function initialize(cardViews) {
	buttonView = Ti.UI.createView({
		right : 0,
		width : buttonHeight + buttonLeftPad + buttonRightPad
	});
	buttonView.opacity = 0;
	
	button1 = Ti.UI.createButton({
		title : 'Got it!',
		images : { "unselected" : "images/got_it.png", "selected" : 'images/got_it_selected.png'},
		grade : 4,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad,
		top : buttonTopPad, 
		// backgroundImage : "images/got_it.png",
		color : unselectedColor
	});
	button2 = Ti.UI.createButton({
		title : 'Kinda',
		images : { "unselected" : "images/kinda.png", "selected" : 'images/kinda_selected.png'},
		grade : 3,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad,
		top : ((buttonTopPad * 2) + buttonHeight), 
		// backgroundImage : "images/kinda.png",
		color : unselectedColor
	});
	button3 = Ti.UI.createButton({
		title : 'Barely',
		images : { "unselected" : "images/barely.png", "selected" : 'images/barely_selected.png'},
		grade : 2,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad,
		top : ((buttonTopPad * 3) + (buttonHeight * 2)), 
		// backgroundImage : "images/barely.png",
		color : unselectedColor
	});
	button4 = Ti.UI.createButton({
		title : 'No clue',
		images : { "unselected" : "images/no_clue.png", "selected" : 'images/no_clue_selected.png'},
		grade : 1,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad, 
		top : ((buttonTopPad * 4) + (buttonHeight * 3)), 
		// backgroundImage : "images/no_clue.png",
		color : unselectedColor
	});
	
	buttons = [button4, button3, button2, button1]; //ADD BUTTON 4 BACK ON HERE
	for (i in buttons) { 
		// buttons[i].hide();
		// buttons[i].opacity = 0;
		buttons[i].addEventListener('touchstart', function(e) { buttonClicked(e); });
		buttonView.add(buttons[i]);
	}
	
	closeButton = Ti.UI.createImageView({
		image : 'images/new_close.png', 
		height : 25,
		width : 25, 
		top : 10,
		left : cardLeftPad
	});
	
	closeButton.addEventListener('click', function() {
		if (win._parent.name != "Review") {
			Titanium.UI.orientation = Titanium.UI.PORTRAIT;	
		}
		// win.hide();
		// Ti.App.current_win = win._parent;
		// win.nav.close(win);
		// win._parent.show();
		win.close();
		Ti.App.tabGroup.visible = true;
		win.nav.visible = true;
		Ti.App.reviewing = false;
	});
	
	cardScrollableView = Titanium.UI.createScrollableView({
		views:cardViews,
		showPagingControl:false,
		clipViews:false,
		left:0
	});
	
	cardScrollableView.addEventListener('scroll', function(e) {
		// for (i in buttons) { buttons[i].animate( fadeOutAnimation ); }
		buttonView.animate(fadeOutAnimation);
		if (cards[cardScrollableView.currentPage].flipped == false) {
			
			//TODO chang bg img
			for (i in buttons) { 
				//buttons[i].hide();
				buttons[i].color = unselectedColor;
				// buttons[i].backgroundImage = buttons[i].images["unselected"];
				//buttons[i].opacity = 0;
			}
			
		} else {
			showGradeButtons();
		}
	});

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
	render();
}

function createCardView(cardObject, cardNumber, totalCards) {

	var cardBackground = Ti.UI.createImageView({
		image : 'images/card.png',
		status : 'front',
		width : (screenWidth - cardLeftPad - buttonLeftPad - buttonHeight - buttonRightPad),
		height : screenHeight - 80,
		left : cardLeftPad
	});
		
	var cardView = Ti.UI.createView({
		card : cardObject,
		width : cardLeftPad + cardBackground.width + buttonLeftPad, 
		left : 0
	});
	
	var prompt = Ti.UI.createLabel({
		text : cardObject.prompt,
		textAlign : 'center',
		width : cardBackground.width - 20
	});

	var answer = Ti.UI.createLabel({
		text : cardObject.answer,
		textAlign : 'center',
		width : cardBackground.width - 20,
		height : cardBackground.height - 60
	});

	var progressLabel = Ti.UI.createLabel({
		text : cardNumber + " / " + totalCards, 
		textAlign : 'right',
		right : 25, 
		top : -180,
		font:{fontSize:16},
		color : 'gray'
	});
	
	prompt.show();	
	answer.hide();
	
	cardView.add(cardBackground);
	cardView.add(progressLabel);
	cardView.add(prompt);
	cardView.add(answer);
		
	cardView.addEventListener('singletap', function(e) {
		alert('sup');
		
		cardView.animate({
			view : cardBackground,
			transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT, 
			duration : 250
		});
		
		if ( cardBackground.status == 'front' ) {
			cardBackground.status = 'back';
			cardBackground.image = 'images/card_reversed.png';
		} else {
			cardBackground.status = 'front';
			cardBackground.image = 'images/card.png';
		}
		
		// showGradeButtons();
		alert(JSON.stringify(prompt));
		alert(JSON.stringify(answer));
		if (prompt.visible == true) {
			prompt.hide();
			cardView.add(answer);
			cardView.add(progressLabel);
			answer.show();
			// Ti.API.debug('Showing answer! ' + answer.visible);
		} else {
			cardView.add(prompt);
			cardView.add(progressLabel);
			prompt.show();
			answer.hide();			
		}
		cards[cardScrollableView.currentPage].flipped = true;
	});	
	// cardView.card = cardObject;
	return cardView;
}

function showGradeButtons(){
	//TODO resolve
	for (i in buttons) { 
		// buttons[i].show();
		// buttons[i].animate(fadeInAnimation); 
		buttons[i].color = unselectedColor;
		// buttons[i].backgroundImage = buttons[i].images["unselected"];
	}
	buttonView.animate(fadeInAnimation);
	if ( cards[cardScrollableView.currentPage].grade != 0 ){
		//TODO resolve
		for (i in buttons) { 
			buttons[i].color = unselectedColor;
			// buttons[i].backgroundImage = buttons[i].images["unselected"]; 
		}
		// Ti.API.debug(buttons[cards[cardScrollableView.currentPage]].images["selected"]);

		// buttons[cards[cardScrollableView.currentPage].grade - 1].color = selectedColor;
		// buttons[cards[cardScrollableView.currentPage].grade - 1].backgroundImage = buttons[cards[cardScrollableView.currentPage].grade - 1].images["selected"];
	}
}

function buttonClicked(button) {
	cards[cardScrollableView.currentPage].grade = button.source.grade;
	reportGrade(cards[cardScrollableView.currentPage].memID, cards[cardScrollableView.currentPage].grade);
	buttonView.animate(fadeOutAnimation);
	//TODO resolve
	for (i in buttons) { 
		buttons[i].color = unselectedColor;
		// buttons[i].backgroundImage = buttons[i].images["unselected"];
		// buttons[i].animate(fadeOutAnimation); 
	}
	if ( ( cardViews.length - 1 ) >= ( cardScrollableView.currentPage + 1 ) ) {
		cardScrollableView.scrollToView( cardScrollableView.currentPage + 1 );
	} else {
		if (win._context == "push") {
			win._parent.show();
			if (win._parent.name != "Review") {
				Titanium.UI.orientation = Titanium.UI.PORTRAIT;	
			}
			Ti.App.current_win = win._parent;
			win.nav.close(win);
		} else {
			// alert("Bromine");
			var newWin = Ti.UI.createWindow({
				url : "stats.js",
				navBarHidden : true,
				nav : win.nav,
				data : cards,
				// views : cardViews,
				folder : win.folder,
				_parent: Titanium.UI.currentWindow
			});	
			win.nav.close(win);
			// win.hide();
			// Ti.App.current_win = win._parent;
			// win.nav.close(win);
			// win._parent.show();
			// Ti.App.tabGroup.visible = true;
			// win.nav.visible = true;
			// alert("Bromine");
			// win.hide();
			// win._parent.show();
			newWin.open();
			// win.nav.open(newWin);			
		}
	}
}

function render() {
	win.add(cardScrollableView);
	win.add(buttonView);
	// for (i in buttons) { win.add(buttons[i]); }
	
	win.add(closeButton);
	win.open();
}

// TODO for replay 
// if ( win.views == null ) {
	// getLines(win.list);
// } else {
	// cards = win.data;
	// initialize(win.views);
// }


//win.add(buttonView);
//Ti.API.debug('Screen width = ' + screenWidth + ", cardView width = " + card.width)
//var xml = Ti.XML.parseString(xmlstr);
//
// Ti.API.debug(xmlstr);
// var xml = Ti.XML.parseString(xmlstr);
// Ti.API.debug(xml);
// var fooBarList = xml.documentElement.getElementsByTagName("FooBar");
// Ti.API.debug(fooBarList);
// var win = Titanium.UI.createWindow({
	// navBarHidden : true
// });


// var nav = Titanium.UI.iPhone.createNavigationGroup({
   // window : win
// });
// 
// container.add(nav);

//var win = Ti.UI.createWindow({});

//win.navBarHidden = false;

// var back = Ti.UI.createButton({
    // title:'Close',
    // style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
// });
// 
// back.addEventListener('click', function(){
	// win.close();
// });
// 
// win.leftNavButton = back;



//TODO peel back options button
	// optionsButton.addEventListener('click', function() {
		// var w = Ti.UI.createWindow({
			// backgroundColor : 'gray',
			// orientationModes : [Titanium.UI.LANDSCAPE_LEFT]
		// });
// 		
		// var foldersButton = Ti.UI.createButton({
			// title:'Folders',
			// width:100,
			// height:30,
			// left : cardLeftPad,
			// bottom : 50
		// }); 
// 		
		// foldersButton.addEventListener('click', function() {
			// Ti.UI.orientation = Ti.UI.PORTRAIT;
// 
			// var newWin = Ti.UI.createWindow({
				// url : "explore.js",
				// navBarHidden : true,
				// nav : win.nav
			// });
			// //w.close();
			// //win.close();
// 
			// win.nav.open(newWin);
		// });
// 		
		// var doneButton = Ti.UI.createButton({
			// title : 'Done',
			// width : 100,
			// height : 30,
			// left : cardLeftPad,
			// bottom : 10
		// });
// 		
		// doneButton.addEventListener('click',function() {
			// w.close();
		// });
		// w.add(doneButton);
		// w.add(foldersButton);
		// w.open({
			// modal : true,
			// modalTransitionStyle : Ti.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL,
			// //modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_CURRENT_CONTEXT,
			// navBarHidden:true
		// });
	// });

	
	// for (i in cards) { cardViews.push(createCardView(cards[i])); }
