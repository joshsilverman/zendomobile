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
getCards();
index = 0;

function createUI() {
	
	card = Ti.UI.createImageView({
		image: 'card.png',
		width:300,
		height:300,
		top:0
	});
	
	prompt = Ti.UI.createLabel({
		text:"",
		top:62,
		height:50,
		textAlign:'center'
	});
	
	answer = Ti.UI.createLabel({
		text:"",
		top:175,
		height:75,
		width:275,
		textAlign:'center',
		opacity:0
	});
	
	flip = Ti.UI.createButton({
		title:'Show',
		width:100,
		height:50,
		top:185,
		index:0
	});
	
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
	
	flip.addEventListener('click', fadeInOnFlip);
	
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
	cards[index].flipped = true;
	flip.hide();
	for (i in buttons) { buttons[i].show(); buttons[i].animate(button_animation); }
	answer.show();
	answer.animate(button_animation);
}

function showCurrentCard(){
	snapBack();

	if (cards[index] != null) {
		
		if (cards[index].flipped == false) {
			answer.opacity = 0;
			answer.hide();
						
			for (i in buttons) { 
				buttons[i].backgroundColor = 'fff'; 
				buttons[i].opacity = 0;
				buttons[i].hide(); 
			}
			
			prompt.text = cards[index].prompt;
			answer.text = cards[index].answer;
			
			flip.show();
			prompt.show();
			
		} else {
			prompt.text = cards[index].prompt;
			answer.text = cards[index].answer;
			
			flip.hide();
			
			prompt.show();
			answer.opacity = 1;
			answer.show();
			
			for (i in buttons) { 
				buttons[i].opacity = 1; 
				buttons[i].show(); 
				buttons[i].backgroundColor = '#fff'
			}
			
			if (cards[index].grade != 0) {
				
				switch (cards[index].grade) {
					case 1:
						button_1.backgroundColor = 'blue'
						break;
					case 2:
						button_2.backgroundColor = 'blue'
						break;
					case 3:
						button_3.backgroundColor = 'blue'
						break;
					case 4:
						button_4.backgroundColor = 'blue'
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
			//reviewComplete();
			alert("No more cards!");
		}
	}
}

function reviewComplete() {
	card.hide();
	prompt.hide();
	answer.hide();
	flip.hide();
	for (i in buttons) { buttons[i].hide(); }
}

function snapBack(){
	Ti.API.debug("Width: " + prompt.width);
	prompt.left = Math.round((( Ti.Platform.displayCaps.platformWidth - prompt.width ) / 2 ))
	card.left = 10;
	//card.
	flip.left = 110;
}

function start(){
	createUI();

	for (i in buttons) {
		win.add(buttons[i]);
		buttons[i].hide();	
	}
	
	win.add(card);
	win.add(prompt);
	win.add(answer);
	win.add(flip);
	
	win.addEventListener('touchstart', function (e){
		x_start = e.x;
	});
	
	win.addEventListener('touchmove', function(e){
		Ti.API.debug(e.x);
		var deltax = e.x - x_start;
	    olt = olt.translate(deltaX,0,0);
	    card.animate({transform: olt, duration: 100}); 

		//cardx = e.x + card.animatedCenter.x - card.width/2;   //card.card.left + (e.x - x_start);
		//promptx = e.x + prompt.animatedCenter.x - prompt.width/2; //prompt.left + (e.x - x_start);
		//answerx = e.x + answer.animatedCenter.x - answer.width/2; //answer.left + (e.x - x_start);
		//flipx =  e.x + flip.animatedCenter.x - flip.width/2; //flip.left + (e.x - x_start);
		
		//card.animate({center:{x:cardx}, duration:1});
		
	});
	
	win.addEventListener('touchend', function(e){
		//Ti.API.debug("Dist: " + (e.x - x_start));
		if ((e.x - x_start) > 40 || (e.x - x_start) < -40) {
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