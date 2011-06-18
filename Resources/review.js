Ti.UI.setBackgroundColor('#fff');
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

function getCards(){
	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 1000000;
	xhr.open("GET","http://grocerygenie.heroku.com/users?format=json");
	xhr.onload = function(){
		try {
			var data = eval(this.responseText);
			for ( var i = 0; i < data.length; i ++ ) {
				Ti.API.debug("Created pairing: " + data[i].user.first_name + " / " + data[i].user.last_name);
				
				var card = new Object();
				card.prompt = data[i].user.first_name;
				card.answer = data[i].user.last_name;
				card.flipped = false;
				card.grade = null;
				
				cards.push(card);
			}
		} catch(E) {
			alert(E);
		}
		start();
	}
	xhr.send();
}

cards = [];
cardViews = [];
getCards();
index = 0;

function createCard(prompt, answer) {
	
	var cardView = Ti.UI.createView({
		width:300,
		height:300
	});
	
	var cardBackground = Ti.UI.createImageView({
		image: 'images/card.png',
		width:300,
		height:300,
		top:0
	});
	
	var promptLabel = Ti.UI.createLabel({
		text:"",
		top:82,
		height:50,
		textAlign:'center'
	});
	
	var answerLabel = Ti.UI.createLabel({
		text:"",
		top:195,
		height:75,
		width:275,
		textAlign:'center',
		opacity:0
	});
	
	var flipButton = Ti.UI.createButton({
		title:'Show',
		width:100,
		height:50,
		top:185,
		index:0
	});
	
	cardView.add(cardBackground);
	cardView.add(promptLabel);
	cardView.add(answerLabel);
	cardView.add(flipButton);
	
	return cardView;
}

function createUI() {
	
	cardNumber = Ti.UI.createLabel({
		text : (index + 1) + " / " + cards.length, 
		top : 0,
		left : win.width - 50,
		height : 50,
		width : 275
	});
	
	cardBackground = Ti.UI.createImageView({
		image: 'images/card.png',
		width:300,
		height:300,
		top:20
	});
	
	promptLabel = Ti.UI.createLabel({
		text:"",
		top:82,
		height:50,
		textAlign:'center'
	});
	
	answerLabel = Ti.UI.createLabel({
		text:"",
		top:195,
		height:75,
		width:275,
		textAlign:'center',
		opacity:0
	});
	
	flipButton = Ti.UI.createButton({
		title:'Show',
		width:100,
		height:50,
		top:205,
		index:0
	});
	
	//for (i in cards) {
	//	cardViews.push(createCard(cards[i].prompt, cards[i].answer));
	//	scrollView.add(cardViews[i]);
	//}
	
	button_animation = Titanium.UI.createAnimation({
		curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,
	    opacity:1,
	    duration:750
	});
	
	button_1 = Ti.UI.createButton({
		title:'No Clue',
		bottom:25,
		width:65,
		left:25,
		height:50,
	    opacity:0,
	    value:1
	});
	
	button_2 = Ti.UI.createButton({
		title:'Barely',
		bottom:25,
		width:65,
		left:94,
		height:50,
		opacity:0,
		value:2
	});
	
	button_3 = Ti.UI.createButton({
		title:'Kinda',
		bottom:25,
		width:65,
		left:162,
		height:50,
		opacity:0,
		value:3
	});
	
	button_4 = Ti.UI.createButton({
		title:'Got it!',
		bottom:25,
		width:65,
		right:25,
		height:50,
		opacity:0,
		value:4
	});
	
	buttons = new Array(button_1, button_2, button_3, button_4);
	
	for (i in buttons) { buttons[i].addEventListener('click', grade_click); }
	
	flipButton.addEventListener('click', fadeInOnFlip);
	
	graphView = Ti.UI.createImageView({url:'http://chart.apis.google.com/chart?cht=p3&chs=450x200&chd=t:73,13,10,3,1&chco=80C65A,224499,FF0000&chl=Chocolate|Puff+Pastry|Cookies|Muffins|Gelato'});
	
}

function grade_click(e) {
	//Ti.API.debug("Card " + cards[index].prompt + " set to: " + e.source.value);
	cards[index].grade = e.source.value;		
	if (index < cards.length - 1) {
		for (i in buttons) { buttons[i].opacity = 0; buttons[i].hide(); }
		index++;
		showCurrentCard();	
	} else {
		showCurrentCard();
		alert("No more cards!");
	}		
}
	
function fadeInOnFlip(e) {

	win.animate(animation);
	cards[index].flipped = true;
	flipButton.hide();
	for (i in buttons) { buttons[i].show(); buttons[i].animate(button_animation); }
	answerLabel.show();
	answerLabel.animate(button_animation);
}

function showCurrentCard(){
	//snapBack();
	cardNumber.text = (index + 1) + " / " + cards.length

	if (cards[index] != null) {
		
		if (cards[index].flipped == false) {
			answerLabel.opacity = 0;
			answerLabel.hide();
						
			for (i in buttons) { 
				buttons[i].color = 'gray'; 
				buttons[i].opacity = 0;
				buttons[i].hide(); 
			}
			
			promptLabel.text = cards[index].prompt;
			answerLabel.text = cards[index].answer;
			
			flipButton.show();
			promptLabel.show();
			
		} else {
			promptLabel.text = cards[index].prompt;
			answerLabel.text = cards[index].answer;
			
			flipButton.hide();
			
			promptLabel.show();
			answerLabel.opacity = 1;
			answerLabel.show();
			
			for (i in buttons) { 
				buttons[i].opacity = 1; 
				buttons[i].show(); 
				buttons[i].color = 'gray'
			}
			
			if (cards[index].grade != 0) {
				
				switch (cards[index].grade) {
					case 1:
						button_1.color = '395CA8';
						break;
					case 2:
						button_2.color = '395CA8';
						break;
					case 3:
						button_3.color = '395CA8';
						break;
					case 4:
						button_4.color = '395CA8';
						break;
				}
			}
		}		
	}
}

function swipe(e){
	if (e.direction == 'left'){
		if ( index > 0 ) {
			index--;
			showCurrentCard();
		}
	} else {
		if ( index < (cards.length -1) ){
			index++;
			showCurrentCard();			
		} else {
			reviewComplete();
			win.add(graphView);
		}
	}
}

function reviewComplete() {
	cardBackground.hide();
	promptLabel.hide();
	answerLabel.hide();
	flipButton.hide();
	for (i in buttons) { buttons[i].hide(); }
}

function snapBack(){
	promptLabel.left = Math.round((( Ti.Platform.displayCaps.platformWidth - promptLabel.width ) / 2 ))
	cardBackground.left = 10;
	flipButton.left = 110;
}

function start(){
	createUI();

	animation = Ti.UI.createAnimation({
		view : cardBackground, 
		transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT,
		duration : 250
	});
	
	for (i in buttons) {
		win.add(buttons[i]);
		buttons[i].hide();
	}
	
	win.add(cardNumber);
	win.add(cardBackground);
	win.add(promptLabel);
	win.add(answerLabel);
	win.add(flipButton);
	
	//win.add(scrollView);
	
	//win.addEventListener('swipe', function(e){
		
	//})
	
	win.addEventListener('touchstart', function (e){
		x_start = e.x;
	});
	
	//win.addEventListener('touchmove', function(e){
		//Ti.API.debug(e.x);
		//var deltax = e.x - x_start;
	    //olt = olt.translate(deltaX,0,0);
	   // cardBackground.animate({transform: olt, duration: 100}); 

		//cardx = e.x + card.animatedCenter.x - card.width/2;   //card.card.left + (e.x - x_start);
		//promptx = e.x + prompt.animatedCenter.x - prompt.width/2; //prompt.left + (e.x - x_start);
		//answerx = e.x + answer.animatedCenter.x - answer.width/2; //answer.left + (e.x - x_start);
		//flipx =  e.x + flip.animatedCenter.x - flip.width/2; //flip.left + (e.x - x_start);
		
		//card.animate({center:{x:cardx}, duration:1});
		
	//});
	
	win.addEventListener('touchend', function(e){
		//Ti.API.debug("Dist: " + (e.x - x_start));
		if ((e.x - x_start) > 30 || (e.x - x_start) < -30) {
			if (e.x > x_start){
				swipe({direction:'left'});
			} else {
				swipe({direction:'right'});
				//card.animate({transition:Ti.UI.iPhone.AnimationStyle.CURL_UP});

			}
			
		}
		
		snapBack();
	});
	
	showCurrentCard();

}