// Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;
// Titanium.UI.currentWindow.orientationModes = [Titanium.UI.LANDSCAPE_LEFT];
Titanium.UI.setBackgroundColor('#171717');
var win = Ti.UI.currentWindow;
Ti.API.info("ITS WORKING");

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

//@PLATFORM - This may need to be adjusted for Android
var dimension1 = Ti.Platform.displayCaps.platformHeight;
var dimension2 = Ti.Platform.displayCaps.platformWidth;

if (dimension1 > dimension2) {
	var screenHeight = dimension2 - 20;
	var screenWidth = dimension1;
} else {
	var screenHeight = dimension1 - 20;
	var screenWidth = dimension2;	
}

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

Ti.include('getLines.js');
reviewData = getLines(win.list);




function processData(data) {
	reviewLineIDs = []
	// alert(data["lines"]);
	var currentDate = new Date();
	for ( i in data["lines"] ) {
		var memDate = new Date();
		
		var dateTimeSet = data["lines"][i].line.mems[0].created_at.split("T")
		var date = dateTimeSet[0];
		var time = dateTimeSet[1];
		var dateSet = date.split("-");
		var timeSet = time.replace("Z", "").split(":");

		memDate.setYear(dateSet[0]);
		memDate.setMonth(dateSet[1]-1);
		memDate.setDate(dateSet[2]);
		memDate.setHours(timeSet[0]);
		memDate.setMinutes(timeSet[1]);
		memDate.setSeconds(timeSet[2]);

		if ( memDate < currentDate) {
			reviewLineIDs.push(data["lines"][i].line.mems[0].line_id);			
		}
	}
	alert("Review: " + reviewLineIDs);
	//data["document"].document.html
	var xmlstr = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"+
	"<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">"+
	"<soap:Body>"+
	"<FooBarResponse xmlns=\"http://foo.com/2010\">"+
	"<FooBarResult>"+
	"<ResponseStatus>"+
	"<Status>"+
	"<PassFail>Pass</PassFail>"+
	"<ErrorCode />"+
	"<MessageDetail />"+
	"</Status>"+
	"</ResponseStatus>"+
	"<FooBar>true</FooBar>"+
	"</FooBarResult>"+
	"</FooBarResponse>"+
	"</soap:Body></soap:Envelope>";
	

	var xml = Ti.XML.parseString(xmlstr);
	var fooBarList = xml.documentElement.getElementsByTagName("FooBar");
	alert(fooBarList);
	// docXML = Ti.XML.parseString("<wrapper><text>Some text!</text></wrapper>");
	// alert(docXML);
	
}

initialize();

function initialize() {
	
	buttonView = Ti.UI.createView({});
	var button1 = Ti.UI.createButton({
		title : 'Got it!',
		grade : 1,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad,
		top : buttonTopPad, 
		color : 'gray'
	})
	var button2 = Ti.UI.createButton({
		title : 'Kinda',
		grade : 2,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad,
		top : ((buttonTopPad * 2) + buttonHeight), 
		color : 'gray'
	})
	var button3 = Ti.UI.createButton({
		title : 'Barely',
		grade : 3,
		height : buttonHeight,
		width : buttonHeight,
		right : buttonRightPad,
		top : ((buttonTopPad * 3) + (buttonHeight * 2)), 
		color : 'gray'
	})
	var button4 = Ti.UI.createButton({
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
		buttons[i].addEventListener('touchstart', function(e) { buttonClicked(e); });
		//buttonView.add(buttons[i]);
	}
	
	optionsButton = Ti.UI.createImageView({
		image : 'images/close.png', 
		height : 35,
		width : 35, 
		top : 3,
		left : 2
	})
	
	optionsButton.addEventListener('click', function() {
		var newWin = Ti.UI.createWindow({
			url : "notes.js",
			navBarHidden : true,
			nav : win.nav,
			data : win.folder
		});	
		//TODO this is not ideal!
		win.hide();
		win.nav.open(newWin);
	});
	
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

	
	for (i in cards) { cardViews.push(createCardView(cards[i])); }
	//cardViews.push(getStats);
	
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
}

function getStats() {
	var statView = Ti.UI.createView({});
	var graph = Ti.UI.createWebView({
		url:'http://chart.apis.google.com/chart?cht=p3&chs=450x200&chd=t:73,13,10,3,1&chco=80C65A,224499,FF0000&chl=Chocolate|Puff+Pastry|Cookies|Muffins|Gelato'
	});
	statView.add(graph);
	return statView;
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
		//height : screenHeight,
		left : cardLeftPad
	});
	
	var cardView = Ti.UI.createView({
		card : cardObject,
		width : cardLeftPad + card.width + buttonLeftPad, 
		//height : card.height,
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
	for (i in buttons) { 
		buttons[i].color = 'gray'; 
		buttons[i].animate(fadeOutAnimation); 
	}
	if ( (cardViews.length - 1) >= (cardScrollableView.currentPage + 1) ) {
		cardScrollableView.scrollToView(cardScrollableView.currentPage + 1);
	} else {
		alert('This is where the stats page goes!');
	}
}


var cardScrollableView = Titanium.UI.createScrollableView({
	views:cardViews,
	showPagingControl:false,
	clipViews:false,
	left:0
});

cardScrollableView.addEventListener('scroll', function(e) {
	for (i in buttons) { buttons[i].animate( fadeOutAnimation ); }
	if (cards[cardScrollableView.currentPage].flipped == false) {
		for (i in buttons) { 
			//buttons[i].hide();
			buttons[i].color = 'gray';
			//buttons[i].opacity = 0;
		}
	} else {
		showGradeButtons();
	}
});

// UNCOMMENT HERE
win.add(cardScrollableView);
for (i in buttons) { win.add(buttons[i]); }
win.open();





//win.add(buttonView);
win.add(optionsButton);
//Ti.API.debug('Screen width = ' + screenWidth + ", cardView width = " + card.width)

