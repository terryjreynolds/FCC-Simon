//GLOBAL VARIABLES (I know, I know...)

var on_off = "off";
var strict_mode;
var AI_array = [];
var Gamer_array = [];
var match_maker = [];
var count_display;
var start_button_state = "not_pressed";

//INTERACTIVE BUTTONS MODULE- Buttons and DOM events

						//grabbing the div elements
						var green = document.getElementById("green");
						var blue = document.getElementById("blue");
						var red = document.getElementById("red");
						var yellow = document.getElementById("yellow");
						var start_button = document.getElementById("start");
						var strict_button = document.getElementById("strict");
						var on_off_switch = document.getElementById("on_off_switch");


function setUpColorClicks(){

						green.addEventListener('mousedown', lightUpOnClick);
						green.addEventListener('mouseup', mouseUpRemoveClass);
						green.addEventListener('mousedown', playAudio);						
						blue.addEventListener('mousedown', lightUpOnClick);
						blue.addEventListener('mouseup', mouseUpRemoveClass);
						blue.addEventListener('mousedown', playAudio);
						red.addEventListener('mousedown', lightUpOnClick);
						red.addEventListener('mouseup', mouseUpRemoveClass);
						red.addEventListener('mousedown', playAudio);
						yellow.addEventListener('mousedown', lightUpOnClick);
						yellow.addEventListener('mouseup', mouseUpRemoveClass);
						yellow.addEventListener('mousedown', playAudio);
						
											
};

function setUpOtherClicks(){
						on_off_switch.addEventListener('click', turnOffOrOn);
						start_button.addEventListener('click', pressStartButton);
						strict_button.addEventListener('click', activateStrictMode);
						
};

function mouseUpRemoveClass(id){
    	var id = this.getAttribute("id");
    	$("#" + id).removeClass("light" + id);
      storeGamerInput(id);
    };


function turnOffSpecificClickEvent(element, task){
	element.removeEventListener('click', task);
};


function makeUserButtonsTempDead(){
						green.removeEventListener('mousedown', lightUpOnClick);
						green.removeEventListener('mouseup', mouseUpRemoveClass);
						green.removeEventListener('mousedown', playAudio);
						blue.removeEventListener('mousedown', lightUpOnClick);
						blue.removeEventListener('mouseup', mouseUpRemoveClass);
						blue.removeEventListener('mousedown', playAudio);
						red.removeEventListener('mousedown', lightUpOnClick);
						red.removeEventListener('mouseup', mouseUpRemoveClass);
						red.removeEventListener('mousedown', playAudio);
						yellow.removeEventListener('mousedown', lightUpOnClick);
						yellow.removeEventListener('mouseup', mouseUpRemoveClass);
						yellow.removeEventListener('mousedown', playAudio);
						

};

function lightUpOnClick(){
	var id = this.getAttribute("id");
	$("#" + id).addClass("light" + id);
    };

    function setCount(num){
count_display = num;
document.getElementById("counter").innerHTML = num;
};


function turnOffOrOn(){
// move the slider switch, set count to -- 
if(on_off == "on"){
	$("#on_off_switch").animate({marginLeft: "0vmin"}, 100);
	document.getElementById("counter").innerHTML = "Bye";
	setTimeout( function() {reset("off", "off", "");}, 1100);
	var is_strict_on = checkIfStrictModeOn();
		if (is_strict_on == true){
		setTimeout(function(){activateStrictMode();}, 900);
		}
}else{
	$("#on_off_switch").animate({marginLeft: "3vmin"}, 100);
	document.getElementById("counter").innerHTML = "Hi";
	setTimeout( function() {reset("on", "off", "--");}, 900);	
}
};

function pressStartButton(){
	//on press, light indicator and calls the function that creates and delivers the pattern
			
		if(on_off == "on" && strict_mode == "off"){
			start_button_state = "pressed";
		reset("on", "off", 1);		
		}else if(on_off == "on" && strict_mode == "on"){
			start_button_state = "pressed";
			reset("on", "on", 1);		
		}

};

function checkIfStrictModeOn(){
	if (strict_mode == "on"){
		return true;
	}else{
		return false;
	}
};


function activateStrictMode(){

	if (on_off == "on" && strict_mode == "off"){
		$(".strictbutton").css("background-color", "green");
		strict_mode = "on";
		
	}else if(on_off == "on" && strict_mode == "on"){
		$(".strictbutton").css("background-color", "yellow");
		strict_mode = "off";
	}

};


//activate the onoff, start, and strict buttons
setUpOtherClicks();	


//AUDIO MODULE

    function playAudio(){
    	var id = this.getAttribute("id");
    	var cue = id + "_sound";
    	var sound = document.getElementById(cue);
    	
    	sound.load();
    	sound.play();
 	   	
    };

    function playAudioPattern(whichbutton){

    	var playsound = document.getElementById(whichbutton);

    	playsound.load();
    	playsound.play();

    };

    function soundBuzzer(){
	buzzer_sound.load();
	setTimeout( function() {buzzer_sound.play();}, 300);
	};

	function soundBell(){
	bell_sound.load();
	setTimeout( function() {bell_sound.play();}, 300);
	};

	function soundTrumpet(){
	trumpet_fanfare_sound.load();
	setTimeout( function() {trumpet_fanfare_sound.play();}, 300);
	};

  
//GAME FUNCTIONALITY MODULE

//generate a random number to push to array
function generateRandomColor(){

var integer = Math.floor((Math.random() * 4) + 0);

if (integer == 1){
	return "green";
}else if( integer == 2){
	return "blue";
}else if(integer == 3){
	return "red";
}else{
	return "yellow"
}

};

function flashThePattern(){
//creates a 20 element array of colors
for (i=0; i<= 19; i++){
	var color = generateRandomColor();
	AI_array.push(color);
}
	lightUpSequence(1500);	
};

//uses a time-intervaled loop to display the color sequence in a measured manner
function lightUpSequence(setinttimeout){

	var i = 0;
var intervalId = setInterval(function(){
	
	if(i == count_display-1){
		clearInterval(intervalId);
	}

	var element = AI_array[i];
   	$("#" + element).addClass("light" + element);
   	var sound = element + "_sound";
   	playAudioPattern(sound);
   setTimeout( function() {$("#" + element).removeClass("light" + element);}, 300);

   if(i == count_display-1){
	setUpColorClicks();
	}

   i++;
	
		}, setinttimeout);
	
};

//examines gamer input and makes decisions on how to proceed
function storeGamerInput(id){
	var color = id;

Gamer_array.push(color);
var comparison = compareTwoArrays();

	if(comparison == true && strict_mode == "on"){
		//if Gamer messed up, check for strict mode (if yes, reset) (if no, empty Gamer_array and flash pattern at same count_display)
		showSuccessOrFailure("Aww!");
		soundBuzzer();
		makeUserButtonsTempDead();
		start_button_state = "pressed";
		setTimeout( function() {reset("on", "on", 1);}, 800);

	}else if(comparison == true && strict_mode == "off"){
		//alert("You messed up not in strict mode");
		showSuccessOrFailure("Oops!");
		soundBuzzer();
		setTimeout( function() {setCount(count_display);}, 800);
		Gamer_array = [];
		match_maker = [];
		makeUserButtonsTempDead();
		var time_value = findTimeoutValue();
		setTimeout(function() {lightUpSequence(time_value);}, 800);

//if the Gamer gets it right
	}else if(comparison == false && Gamer_array.length == count_display && count_display == 20){
		showSuccessOrFailure("Win!");
		soundTrumpet();
		start_button_state = "not_pressed";		
		setTimeout( function() {reset("on", "off", "--");}, 1500);
		setTimeout( function() {$(".strictbutton").css("background-color", "yellow");}, 1600);
	}else if(comparison == false && Gamer_array.length == count_display){
	count_display++;
	showSuccessOrFailure("Yay!");
	soundBell();
	setTimeout( function() {setCount(count_display);}, 800);
	makeUserButtonsTempDead();
	Gamer_array = [];
	match_maker = [];
	var time_value2 = findTimeoutValue();
	setTimeout(function() {lightUpSequence(time_value2);}, 800);
}
};

function findTimeoutValue(){
			if(count_display >= 13){
			return 600;
			}else if (count_display >= 9){
				return 700;
			}else if (count_display >= 5){
				return 900;
			}else if (count_display >= 1){
				return 1250;
			}
};

function showSuccessOrFailure(comment){
	document.getElementById("counter").innerHTML = comment;
};

//compares gamer input to the array of colors
function compareTwoArrays(){

for(i=0; i <= Gamer_array.length-1; i++){
		 
	if ( Gamer_array[i] == AI_array[i]){
		match_maker.push("true"); 
	}else{
	match_maker.push("false"); 
	}
}	
		var are_arrays_mismatched = doesItContainFalse();

		if (are_arrays_mismatched == true){
			return true;		
		}else{
			return false;
		}
};

//helps to compare the gamer array input to the AI array
function doesItContainFalse(){
	var doesit = match_maker.indexOf("false");
	
	if (doesit !== -1){
		match_maker = [];
		return true;
	}else{
		match_maker = [];
		return false;
	}
	
};


function areWeInStrictMode(){

if (strict_mode == "on"){
	return true
}else {
	return false;
}
};

//a generic reset function 
function reset(onstate, strictstate, num){
on_off = onstate;
strict_mode = strictstate;
setCount(num);
AI_array = [];
Gamer_array = [];
match_maker = [];
if (on_off == "off"){
	start_button_state = "not_pressed";
}
if (start_button_state == "pressed"){
flashThePattern();
}	
};

			