
//Shahar//

//dictionary for all the users in the system
var users = {}
var foodAmount;
var fivePoints;
var fifteenPoints;
var twentyfivePoints;
var gameDuration;
var monsterQuantity;
var upButton = 38;
var downButton = 40;
var rightButton = 37;
var leftButton = 39;
var showUp = 'ArrowUp';
var showDown = 'ArrowDown';
var showRight = 'ArrowRight';
var showLeft = 'ArrowLeft';
var loginUser;
var context;
var playSound;
var checkboxsound;


$(document).ready( function () {
	//deafult user - username = k, password = k
	users['k'] = 'k'


	//Register validation
    $( "#signupForm" ).validate( {
        rules: {
			username: {
                required: true,
				freeUser: true,
            },
            fullname: {
               required: true,
               noDigits: true,
            } ,
            dateofbirth: {
                required: true,
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 6,
                validPassword: true
            },
            confirm_password: {
                required: true,
                minlength: 6,
                equalTo: "#password"
            },

        },
        messages: {
			username: {
                required: "Please enter a username",
				freeUser: "This username already taken"
            },
            fullname: {
                required: "Please enter your full name",
                noDigits: "Your full name cannot include digits"
            },
            dateofbirth: {
                required: "Please enter your date of birth",
            },
            email: {
                required: "Please enter your email",
                email: "Please enter a valid email"
            },
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 6 characters long",
                validPassword: "Your password must contain one digit and one letter"
            },
            confirm_password: {
                required: "Please provide a password",
				minlength: "Your password must be at least 6 characters long",
                equalTo: "Please enter the same password as above"
            },

        },

        submitHandler: function() {
            //get elements
			let username = document.getElementById("username").value;
			let password = document.getElementById("password").value;

			//insert to storage
			users[username] = password

			showWelcome();
			alert('You have successfully registered!');

            //reset details
            let form = $("#signupForm");
            form[0].reset();

        },
    });


	//Login validation
	$( "#loginForm" ).validate( {
        rules: {
			loginuser: {
                required: true,
				userExist: true,
            },
            loginpassword: {
               required: true,
			   confirmPassword: true,
            } ,
        },
        messages: {
			loginuser: {
                required: "Please enter a username",
				userExist: "The username is not valid"
            },
            loginpassword: {
                required: "Please provide a password",
                confirmPassword: "The password is not valid"
            },
        },

        submitHandler: function() {
			loginUser = document.getElementById("loginuser").value;
			document.getElementById("showuser").innerHTML = loginUser;
			document.getElementById("login").style.display = 'none';
			document.getElementById("signup").style.display = 'none';
			document.getElementById("logout").style.display = 'block';
			document.getElementById("settings").style.display = 'block';
			document.getElementById("toRegister").disabled= true;
			document.getElementById("toRegister").style.backgroundColor ='#ffaaaf';
			document.getElementById("toRegister").style.cursor ='not-allowed';
			document.getElementById("toLogin").disabled= true;
			document.getElementById("toLogin").style.backgroundColor ='#ffaaaf';
			document.getElementById("toLogin").style.cursor ='not-allowed';
			resetSettings();
			showSettings();
            //reset details
            let form = $("#loginForm");
            form[0].reset();

        },
    });


	//Settings validation
	$( "#settingsForm" ).validate( {
		rules: {
			down: {
				checkKey: true,
			} ,
		},
		messages: {
			down: {
				checkKey: "You need to choose diffrent key for each button",
			},

		},
	
		submitHandler: function() {
			document.getElementById("gameMenu").style.display = 'block';
			showGame();
			playSound = document.getElementById("myAudio");
			playSound.volume = 0.1;
			playSound.currentTime = 0;
			document.getElementById('accept').checked = true;
			controlSound()
			showChosenSettings()
			context = canvas.getContext("2d");
			Start();
			
		},
	});

});


$(function() {
	//Password must contain at least one digit and one letter
	$.validator.addMethod('validPassword', function (value, element) {
		return this.optional(element) ||
			/\d/.test(value) &&
			/[a-z]/i.test(value);
	});

	//Full name can't contain digits
	$.validator.addMethod('noDigits', function (value, element) {
		return this.optional(element) || !/[0-9]/i.test(value);
	});

	//Taken username
	$.validator.addMethod('freeUser', function (value, element) {
		if(value in users){
			return false;
		}
		else{
			return true;
		}
	});

	//user in the system
	$.validator.addMethod('userExist', function (value, element) {
		if(value in users){
			return true;
		}
		else{
			return false;
		}
	});

	//Check if this is the password of the user
	$.validator.addMethod('confirmPassword', function (value, element) {
		let user_name = document.getElementById("loginuser").value;
		let user_password = users[user_name]

		if(value == user_password){
			return true;
		}
		else{
			return false;
		}
	});

	//check if the key actions not equal
	$.validator.addMethod("checkKey", function(value, element) {
		let upCheck = document.getElementById("up").value;
		let downCheck = document.getElementById("down").value;
		let rightCheck = document.getElementById("right").value;
		let leftCheck = document.getElementById("left").value;

		if(upCheck == downCheck || upCheck == rightCheck || upCheck == leftCheck || downCheck == rightCheck || downCheck == leftCheck || rightCheck == leftCheck){
			return false;
		}

		else{
			return true;
		}

	});

});


function showPassword() {
	var x = document.getElementById("loginpassword");
	if (x.type === "password") {
	  x.type = "text";
	} else {
	  x.type = "password";
	}
  }

function updateballsNumber(){
	var slider = document.getElementById("rangeballs");
	var output = document.getElementById("ballsvalue");
	output.innerHTML = slider.value;
	foodAmount = parseInt(document.getElementById("rangeballs").value);
}

function updateDuration(){
	gameDuration = parseInt(document.getElementById("rangeduration").value);

}

function updateColors(color){
	if(color == '5points'){
		fivePoints = document.getElementById("5point").value;
	}
	else if(color == '15points'){
		fifteenPoints = document.getElementById("15point").value;
	}
	else if( color == '25points'){
		twentyfivePoints =  document.getElementById("25point").value;	
	}

}

function updateMonsters(){
	monsterQuantity = parseInt(document.getElementById("monsterquantity").value);
}


function updateButton(event, direction){
	var keyName = event.key;
	var key = event.keyCode;
	//up
	if(direction == 'up'){
		document.getElementById("up").value = keyName;
		showUp = keyName;
		upButton = key;
	}
	else if(direction == 'down'){
		document.getElementById("down").value = keyName;
		showDown = keyName;
		downButton = key;
	}	
	else if(direction == 'right'){
		document.getElementById("right").value = keyName;
		showRight = keyName;
		rightButton = key;
	}
	else if(direction == 'left'){
		document.getElementById("left").value = keyName;
		showLeft = keyName;
		leftButton = key;
	}

}

function randomSettings(){
	//random keys action
	upButton = 38;
	downButton = 40;
	rightButton = 39;
	leftButton = 37;
	showUp = 'ArrowUp';
 	showDown = 'ArrowDown';
 	showRight = 'ArrowRight';
 	showLeft = 'ArrowLeft';
	document.getElementById("up").value = 'ArrowUp';
	document.getElementById("down").value = 'ArrowDown';
	document.getElementById("right").value = 'ArrowRight';
	document.getElementById("left").value = 'ArrowLeft';

	//random food amount
	document.getElementById("rangeballs").value = Math.floor(Math.random() * (41) + 50);
	document.getElementById("ballsvalue").innerHTML = document.getElementById("rangeballs").value;
	foodAmount = parseInt(document.getElementById("rangeballs").value);

	//random colors
	document.getElementById("5point").value = "#" + Math.floor(Math.random()*16777215).toString(16);
	document.getElementById("15point").value = "#" + Math.floor(Math.random()*16777215).toString(16);
	document.getElementById("25point").value = "#" + Math.floor(Math.random()*16777215).toString(16);

	fivePoints = document.getElementById("5point").value;
	fifteenPoints = document.getElementById("15point").value;
	twentyfivePoints =  document.getElementById("25point").value;

	//random duration
	document.getElementById("rangeduration").value = Math.floor(Math.random() * (61) + 60);
	gameDuration = parseInt(document.getElementById("rangeduration").value);

	//random monsters
	document.getElementById("monsterquantity").value = Math.floor(Math.random() * (4) + 1);
	monsterQuantity = parseInt(document.getElementById("monsterquantity").value);


}

function resetSettings(){

	document.getElementById("settingsForm").reset();
	//defult keys action
	upButton = 38;
	downButton = 40;
	rightButton = 39;
	leftButton = 37;
	showUp = 'ArrowUp';
	showDown = 'ArrowDown';
	showRight = 'ArrowRight';
	showLeft = 'ArrowLeft';
	document.getElementById("up").value = 'ArrowUp';
	document.getElementById("down").value = 'ArrowDown';
	document.getElementById("right").value = 'ArrowRight';
	document.getElementById("left").value = 'ArrowLeft';

	//deafult food amount
	document.getElementById("rangeballs").value = 50;
	document.getElementById("ballsvalue").innerHTML = 50;
	foodAmount = parseInt(document.getElementById("rangeballs").value);
	
	//deafult colors
	document.getElementById("5point").value = "#ccffeb";
	document.getElementById("15point").value = "#ccccff";
	document.getElementById("25point").value = "#ffc299";

	fivePoints = document.getElementById("5point").value;
	fifteenPoints = document.getElementById("15point").value;
	twentyfivePoints =  document.getElementById("25point").value;
	
	//deafult duration
	document.getElementById("rangeduration").value = 60;
	gameDuration = parseInt(document.getElementById("rangeduration").value);
	
	//deafult monsters
	document.getElementById("monsterquantity").value = 1;
	monsterQuantity = parseInt(document.getElementById("monsterquantity").value);
}



function showWelcome() {
	if(gameStarted){
		// if game already started
		finishIntervals();
		checkboxsound = document.getElementById('accept');
		checkboxsound.checked = false;
		controlSound();
	} 
    document.getElementById("Game").style.display="none"; 
    document.getElementById("Login").style.display="none"; 
	document.getElementById("Register").style.display="none"; 
	document.getElementById("Settings").style.display="none"; 
	document.getElementById("About").style.display="none"; 
	document.getElementById("Welcome").style.display="block";
	document.getElementsByTagName("body")[0].style.backgroundImage = 'url(./images/wallpaper.jpg)';

}

function showLogin(){
	if(gameStarted){
		// if game already started
		finishIntervals();
		checkboxsound = document.getElementById('accept');
		checkboxsound.checked = false;
		controlSound();
	}
	document.getElementById("Game").style.display="none"; 
	document.getElementById("Login").style.display="block"; 
	document.getElementById("Register").style.display="none"; 
	document.getElementById("Settings").style.display="none"; 
	document.getElementById("Welcome").style.display="none"; 
	document.getElementById("About").style.display="none"; 
	document.getElementsByTagName("body")[0].style.backgroundImage = 'url(./images/wallpaper.jpg)';
}

function showRegister(){
	if(gameStarted){
		// if game already started
		finishIntervals();
		checkboxsound = document.getElementById('accept');
		checkboxsound.checked = false;
		controlSound();
	}
	document.getElementById("Game").style.display="none"; 
	document.getElementById("Login").style.display="none"; 
	document.getElementById("Register").style.display="block"; 
	document.getElementById("Settings").style.display="none"; 
	document.getElementById("Welcome").style.display="none";
	document.getElementById("About").style.display="none";  
	document.getElementsByTagName("body")[0].style.backgroundImage = 'url(./images/wallpaper.jpg)';
}

function showGame(){
	if(gameStarted){
		// if game already started
		newGame();
	}
	else{
		initIntervals();
	}
	document.getElementById("Game").style.display="block"; 
	document.getElementById("Login").style.display="none"; 
	document.getElementById("Register").style.display="none"; 
	document.getElementById("Settings").style.display="none"; 
	document.getElementById("Welcome").style.display="none"; 
	document.getElementById("About").style.display="none"; 
	document.getElementsByTagName("body")[0].style.backgroundImage = 'none';
	document.getElementsByTagName("body")[0].style.backgroundColor = "#181818";

}

function showAbout(){
	if(gameStarted){
		// if game already started
		finishIntervals();
	}
	document.getElementById("Game").style.display="none"; 
	document.getElementById("Login").style.display="none"; 
	document.getElementById("Register").style.display="none"; 
	document.getElementById("Settings").style.display="none"; 
	document.getElementById("Welcome").style.display="none"; 
	document.getElementById("About").style.display="block"; 
}

function showSettings(){
	if(gameStarted){
		// if game already started
		finishIntervals();
		checkboxsound = document.getElementById('accept');
		checkboxsound.checked = false;
		controlSound();
	}
	document.getElementById("Game").style.display="none"; 
	document.getElementById("Login").style.display="none"; 
	document.getElementById("Register").style.display="none"; 
	document.getElementById("Settings").style.display="block"; 
	document.getElementById("Welcome").style.display="none"; 
	document.getElementById("About").style.display="none"; 
	document.getElementsByTagName("body")[0].style.backgroundImage = 'url(./images/wallpaper.jpg)';
}

function logOut(){

	loginUser;
	document.getElementById("showuser").innerHTML = 'guest';
	document.getElementById("logout").style.display = 'none';
	document.getElementById("gameMenu").style.display = 'none';
	document.getElementById("settings").style.display = 'none';
	document.getElementById("login").style.display = 'block';
	document.getElementById("signup").style.display = 'block';
	document.getElementById("toRegister").disabled= false;
	document.getElementById("toRegister").style.backgroundColor ='#fa4756';
	document.getElementById("toRegister").style.cursor ='pointer';
	document.getElementById("toLogin").disabled= false;
	document.getElementById("toLogin").style.backgroundColor ='#fa4756';
	document.getElementById("toLogin").style.cursor ='pointer';
	resetSettings();
	showWelcome();
	loginUser = none;
	checkboxsound = document.getElementById('accept');
	checkboxsound.checked = false;
	controlSound();
	document.getElementsByTagName("body")[0].style.backgroundImage = 'url(./images/wallpaper.jpg)';
	//reset game
}





//Shahar//





////About/////

function showAbout(){
	// Get the modal
	var modal = document.getElementById("About");
	modal.style.display = "block";
	
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	  modal.style.display = "none";
	}
	// When the user clicks on ESC button, close the modal
	$(document).on(
	  'keydown', function(event) {
		if (event.key == "Escape") {
		  modal.style.display = "none";
		}
	});
	
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	  if (event.target == modal) {
		modal.style.display = "none";
	  }
	}
}

////About/////


////GAME/////

// pacman's indexes and properties
var shape = new Object();
var pac_color;
// special point's & chillPill & slowPill indexes
var specialPoint = new Object();
var chillPill = new Object();
var slowPill = new Object();
// each board, for each character
// that can "run over" the other char
// board properties
var board;
var boardlength;
var centerBoard;
var ghostBoard;
var specialPointBoard;
var interval;
var heightOfIndex;
var widthOfIndex;
// game properties
var score;
var start_time;
var time_elapsed;
var amountLifeLeft;
var amountOfBallsLeft;
var timeOfGame;
var food_remain;
var amountOfFood;
var flagContinueToResetPacman = false;
// helps to determine if to finish old intervals
var gameStarted = false;
var color_5Pts;
var color_15Pts;
var color_25Pts;
// Define global args for pacman draw
// So will not reset after every keydown and keep the draw
var startAngle = 0.15 * Math.PI;
var finishAngle = 1.85 * Math.PI;
var flag_clockwise =false;
var eye_x = 5;
var eye_y = -15;

// ghost's properties
var arrOfPosToResetGhosts = new Array();
var ghostAmount;
var ghostsCanAttack = true;
var ghostsSlowDown = false;


boardlength = 20;

function Start() {

	/* 
	board[i][j] : 9 -> slowPill - static pill
	board[i][j] : 8 -> chillPill - static pill
	board[i][j] : 7 -> special point
	board[i][j] : 6 -> ghosts
	board[i][j] : 5 -> obstacle
	board[i][j] : 4 -> pacman
	board[i][j] : 3 -> 25 points
	board[i][j] : 2 -> 15 points
	board[i][j] : 1 -> 5 points
	board[i][j] : 0 -> empty cell
	*/
	gameStarted = true;
	board = new Array();
	ghostBoard = new Array();
	specialPointBoard = new Array();
	// variables from Settings
	timeOfGame = gameDuration;
	ghostAmount = monsterQuantity;
	amountOfFood =  foodAmount;
	color_5Pts = fivePoints;
	color_15Pts = fifteenPoints;
	color_25Pts = twentyfivePoints;

	// cell inside board
	heightOfIndex = canvas.height / boardlength;
    widthOfIndex =  canvas.width / boardlength;
	// Length of board
	centerBoard = parseInt((boardlength-1) / 2,10);
	score = 0;
	amountLifeLeft = 5;
	food_remain = amountOfFood;
	amountOfBallsLeft = amountOfFood;
	// Amount of different balls of points
	var amount5Pts = 0.6 * food_remain;
	var amount25Pts = 0.1 * food_remain;
	pac_color = "#f8be00";
	var cnt = boardlength*boardlength;
	var pacman_remain = 1;
	var c1=0;
	var c2=0;
	var c3=0;
	start_time = new Date();
	// define array that helps rearrange ghosts when they eat pacman
	var pos_1 = new Object();
	pos_1.i = 0;
	pos_1.j = 0;
	var pos_2 = new Object();
	pos_2.i = 0;
	pos_2.j = boardlength-1;
	var pos_3 = new Object();
	pos_3.i = boardlength-1;
	pos_3.j = 0;
	var pos_4 = new Object();
	pos_4.i = boardlength-1;
	pos_4.j = boardlength-1;
	arrOfPosToResetGhosts.push(pos_1,pos_2,pos_3,pos_4);

	//////////////////////// init ghosts
	ghosts = new Array(ghostAmount);
	var flag_0_0 = false;
	var flag_0_9 = false;
	var flag_9_0 = false;
	var flag_9_9 = false;
	// define ghosts by amount, and by corners of canvas
	if(ghostAmount == 1){
		flag_0_0 = true;
	}
	else if(ghostAmount == 2){
		flag_0_0 = true;
		flag_0_9 = true;
	}
	else if(ghostAmount == 3){
		flag_0_0 = true;
		flag_0_9 = true;
		flag_9_0 = true;
	}
	else if(ghostAmount == 4){
		flag_0_0 = true;
		flag_0_9 = true;
		flag_9_0 = true;
		flag_9_9 = true;
	}
	
	



	///////////////// init board
	for (var i = 0; i < boardlength; i++) {
		board[i] = new Array();
		ghostBoard[i] = new Array();
		specialPointBoard[i] = new Array();
		for (var j = 0; j < boardlength; j++) {
			// ghosts
			if(i==0 && j==0 && flag_0_0){
				ghosts[0] = new Object();
				ghosts[0].i = 0;
				ghosts[0].j = 0;
				ghosts[0].img = new Image();
				ghosts[0].img.src = "./images/blue_ghost.png";
				// ghost last two directions in array,
				// when we check if it stucks
				// according to the the equality of array's values. 
				ghosts[0].lastDistances = new Array();
				ghostBoard[i][j] = 6;
			}
			if(i==0 && j==boardlength-1 && flag_0_9){
				ghosts[1] = new Object();
				ghosts[1].i = 0;
				ghosts[1].j = boardlength-1;
				ghosts[1].img = new Image();
				ghosts[1].img.src = "./images/red_ghost.png";
				// ghost last two directions in array,
				// when we check if it stucks
				// according to the the equality of array's values. 
				ghosts[1].lastDistances = new Array();
				ghostBoard[i][j] = 6;

			}
			if(i==boardlength-1 && j==0 && flag_9_0){
				ghosts[2] = new Object();
				ghosts[2].i = boardlength-1;
				ghosts[2].j = 0;
				ghosts[2].img = new Image();
				ghosts[2].img.src = "./images/black_ghost.png";
				// ghost last two directions in array,
				// when we check if it stucks
				// according to the the equality of array's values. 
				ghosts[2].lastDistances = new Array();
				ghostBoard[i][j] = 6;

			}
			if(i==boardlength-1 && j==boardlength-1 && flag_9_9){
				ghosts[3] = new Object();
				ghosts[3].i = boardlength-1;
				ghosts[3].j = boardlength-1;
				ghosts[3].img = new Image();
				ghosts[3].img.src = "./images/orange_ghost.png";
				// ghost last two directions in array,
				// when we check if it stucks
				// according to the the equality of array's values. 
				ghosts[3].lastDistances = new Array();
				ghostBoard[i][j] = 6;
			}
			if (
				//wall 1
				(i ==4  && j == 1) ||
				(i ==5  && j == 1) ||
				(i ==6  && j == 1) ||
				//wall 2
				(i ==13  && j == 1) ||
				(i ==14 && j == 1) ||
				(i ==15 && j == 1) ||
				//wall 3
				(i ==2  && j == 3) ||
				(i ==2 && j == 4) ||
				(i ==2  && j == 5) ||
				(i ==2 && j == 6) ||
				(i ==3 && j == 6) ||
				(i ==4 && j == 6) ||
				//wall 4
				(i ==17  && j == 3) ||
				(i ==17 && j == 4) ||
				(i ==17  && j == 5) ||
				(i ==17 && j == 6) ||
				(i ==16 && j == 6) ||
				(i ==15 && j == 6) ||
				//wall 5
				(i ==2  && j == 15) ||
				(i ==2 && j == 14) ||
				(i ==2  && j == 13)||
				(i ==2 && j == 12) ||
				(i ==3 && j == 12) ||
				(i ==4 && j == 12) ||
				//wall 6
				(i ==17 && j == 15) ||
				(i ==17 && j == 14) ||
				(i ==17 && j == 13) ||
				(i ==17 && j == 12) ||
				(i ==16 && j == 12) ||
				(i ==15 && j == 12) ||
				//wall 7
				(i ==13 && j == 18) ||
				(i ==14 && j == 18) ||
				(i ==15 && j == 18) ||
				//wall 8
				(i ==4  && j == 18) ||
				(i ==5 && j == 18) ||
				(i ==6 && j == 18) ||
				//wall 9 (x)
				(i ==6 && j == 16) ||
				(i ==6 && j == 15) ||
				(i ==5 && j == 15) || 
				(i ==7 && j == 15) ||
				(i ==6 && j == 14) ||
				//wall 10 (x)
				(i ==13 && j == 16) ||
				(i ==13 && j == 15) ||
				(i ==12 && j == 15) || 
				(i ==14 && j == 15) ||
				(i ==13 && j == 14) ||
				//wall 11 (x)
				(i ==13 && j == 5) ||
				(i ==13 && j == 4) ||
				(i ==12 && j == 4) ||
				(i ==14 && j == 4) ||
				(i ==13 && j == 3) ||
				//wall 12 (x)
				(i ==6 && j == 5) ||
				(i ==6 && j == 4) ||
				(i ==5 && j == 4) ||
				(i ==7 && j == 4) ||
				(i ==6 && j == 3) ||
				//wall 13 (long one)
				(i ==0 && j == 8) ||
				(i ==2 && j == 8) ||
				(i ==5 && j == 8) ||
				(i ==7 && j == 8) ||
				(i ==9 && j == 8) ||
				(i ==10 && j == 8) ||
				(i ==12 && j == 8) ||
				(i ==14 && j == 8) ||
				(i ==15 && j == 8) ||
				(i ==17 && j == 8) ||
				(i ==19 && j == 8) ||
				//wall 15 (long one)
				(i ==1 && j == 10) ||
				(i ==3 && j == 10) ||
				(i ==4 && j == 10) ||
				(i ==5 && j == 10) ||
				(i ==6 && j == 10) ||
				(i ==8 && j == 10) ||
				(i ==9 && j == 10) ||
				(i ==11 && j == 10) ||
				(i ==12 && j == 10) ||
				(i ==14 && j == 10) ||
				(i ==15 && j == 10) ||
				(i ==17 && j == 10) ||
				(i ==19 && j == 10) 

			) {
				// obstacles
				board[i][j] = 5;
			}
			else{
				board[i][j] = 0;
			}
		}
	}

	
	while(food_remain > 0){
		// food 5pts
		if(c1<amount5Pts){
			var emptyCell = findRandomEmptyCell(board);
			board[emptyCell[0]][emptyCell[1]] = 1;
			food_remain--;
			c1++;
		}
		// food 15pts
		else if(c2<amountOfFood-amount25Pts -amount5Pts){
			var emptyCell = findRandomEmptyCell(board);
			board[emptyCell[0]][emptyCell[1]] = 2;
			food_remain--;
			c2++;
		}
		// food 25pts
		else if(c3<amount25Pts){
			var emptyCell = findRandomEmptyCell(board);
			board[emptyCell[0]][emptyCell[1]] = 3;
			food_remain--;
			c3++;
		}
	}
	
	// set location to pacman
	// pacman cannot start at the corners
	// pacman cannot start at the center of the board
	var i = Math.floor(Math.random() * (boardlength-1) + 1);
	var j = Math.floor(Math.random() * (boardlength-1) + 1);
	while(
		!(i == 0 && j == 0) &&
		!(i == 0 && j == boardlength-1) &&
		!(i == boardlength-1 && j == 0) &&
		!(i == boardlength-1 && j == boardlength-1) &&
		!(i == centerBoard && j == centerBoard) &&
		board[i][j] != 0
		) 
	{
		i = Math.floor(Math.random() * (boardlength-1) + 1);
		j = Math.floor(Math.random() * (boardlength-1) + 1);
	}	
	shape.i = i;
	shape.j = j;
	board[i][j] = 4;
	pacman_remain--;


	// create special point
	// define special point at the center of the board
	// to find the center of board, parse int of the half of board length of row
	specialPoint.i = centerBoard;
	specialPoint.j = specialPoint.i;
	specialPoint.img = new Image();
	specialPoint.img.src = "./images/specialPoint.jpg"
	specialPointBoard[specialPoint.i][specialPoint.j] = 7;

	// create chillPill point
	// random point on board
	var emptyCell = findRandomEmptyCell(board);
	chillPill.i = emptyCell[0];
	chillPill.j = emptyCell[1];
	chillPill.img = new Image();
	chillPill.img.src = "./images/chill_pill.jpg"
	board[emptyCell[0]][emptyCell[1]] = 8;

	// create slowPill point
	// random point on board
	var emptyCell = findRandomEmptyCell(board);
	slowPill.i = emptyCell[0];
	slowPill.j = emptyCell[1];
	slowPill.img = new Image();
	slowPill.img.src = "./images/slow_ghost.png"
	board[emptyCell[0]][emptyCell[1]] = 9;


	keysDown = {};

	/* Disable scrolling page with arrows */ 
	addEventListener(
		"keydown",
		function(e) {
		if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
			e.preventDefault();
		}
		},
	 	false
	);
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	
}

function initIntervals(){
	interval = setInterval(UpdatePosition, 150);
	interval_specialPoint = setInterval(UpdateSpecialPoint, 200);
	interval_ghosts = setInterval(UpdateGhosts, 200);
}
function finishIntervals(){
	clearInterval(interval);
	clearInterval(interval_specialPoint);
	clearInterval(interval_ghosts);
}
function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * (boardlength-1) + 1);
	var j = Math.floor(Math.random() * (boardlength-1) + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * (boardlength-1) + 1);
		j = Math.floor(Math.random() * (boardlength-1) + 1);
	}
	return [i, j];
}
function GetKeyPressed() {
	// up
	if (keysDown[upButton]) {
		return 1;
	}
	// down
	if (keysDown[downButton]) {
		return 2;
	}
	// left
	if (keysDown[leftButton]) {
		return 3;
	}
	// right
	if (keysDown[rightButton]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.innerHTML = score;
	lblTime.innerHTML = time_elapsed;
	var counterForGhostToDraw = 0
	for (var i = 0; i < boardlength; i++) {
		for (var j = 0; j < boardlength; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			// pacman
			if (board[i][j] == 4) {
				context.beginPath();
				context.arc(center.x, center.y, 30, startAngle, finishAngle,flag_clockwise); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + eye_x, center.y + eye_y , 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			// food (5 points)
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 12, 0, 2 * Math.PI); // circle
				context.fillStyle = "#bdd6e0"; //color
				context.fill();

				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = color_5Pts; //color
				context.fill();	
			// food (15 points)
			}  else if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "#bdd6e0"; //color
				context.fill();

				context.beginPath();
				context.arc(center.x, center.y, 13, 0, 2 * Math.PI); // circle
				context.fillStyle = color_15Pts; //color
				context.fill();	
			// food (25 points)	
			} else if (board[i][j] == 3) {
				context.beginPath();
				context.arc(center.x, center.y, 18, 0, 2 * Math.PI); // circle
				context.fillStyle = "#bdd6e0"; //color
				context.fill();

				context.beginPath();
				context.arc(center.x, center.y, 16, 0, 2 * Math.PI); // circle
				context.fillStyle = color_25Pts; //color
				context.fill();	
			} 
			else if (board[i][j] == 8) {
				// draw image of chillPill
				context.drawImage(chillPill.img, i*heightOfIndex, j*widthOfIndex, 55, 55 * chillPill.img.height / chillPill.img.width)
			}
			else if (board[i][j] == 9) {
				// draw image of slowPill
				context.drawImage(slowPill.img, i*heightOfIndex, j*widthOfIndex, 60, 60 * slowPill.img.height / slowPill.img.width)
			}
			// obstacles
			else if (board[i][j] == 5) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "rgb(25, 86, 165)"; //color
				context.fill();
			}
			// food (special points)
			if(specialPointBoard[i][j] == 7){
				// draw image of special point
				context.drawImage(specialPoint.img, i*heightOfIndex, j*widthOfIndex, 60, 60 * specialPoint.img.height / specialPoint.img.width)
			}
			// ghosts
			if (ghostBoard[i][j] == 6) {
				// draw image of ghost
				context.drawImage(ghosts[counterForGhostToDraw].img, i*heightOfIndex, j*widthOfIndex, 65, 65 * ghosts[counterForGhostToDraw].img.height / ghosts[counterForGhostToDraw].img.width)
				counterForGhostToDraw++;
			}
		}
	}
}

function UpdateGhosts() {
	// check for every ghost which direction is the best for her
	// using manhattan distance
	// get all ghosts indexes
	for(var k=0; k < ghostAmount; k++){
		var ghost_row = ghosts[k].i;
		var ghost_column = ghosts[k].j;
		var pac_row = shape.i;
		var pac_column = shape.j;

		// define different directions for each ghost
		var up = new Object();
		var down = new Object();
		var left = new Object();
		var right = new Object();
		var dirs = new Array();
		var directionForbidden = new Array();
		var arrayIfStuck = new Array();
		var dirIfStuck = new Object();

		for(var t=0; t<ghosts[k].lastDistances.length; t++){
			for(var a=0; a<ghosts[k].lastDistances.length; a++){
				if(ghosts[k].lastDistances[t].i ==
					ghosts[k].lastDistances[a].i &&
	 
					ghosts[k].lastDistances[t].i ==
					ghosts[k].lastDistances[a].i 
				)
				{
					directionForbidden = ghosts[k].lastDistances;
				}
			}
		}

		// up
		if (
			ghost_column > 0 &&
			board[ghost_row][ghost_column - 1] != 5 &&
			ghostBoard[ghost_row][ghost_column - 1] != 6
			){
				dirIfStuck.i = ghost_row;
				dirIfStuck.j = ghost_column - 1;
				arrayIfStuck.push(dirIfStuck);
				var flag_of_problem_dir=false;
				// if ghost is not stuck
				for(var dir=0; dir<directionForbidden.length; dir++){
					if(
						directionForbidden[dir].i == ghost_row &&
						directionForbidden[dir].j == ghost_column - 1
					)
					{
						// up is a problem because of stuck issue
						flag_of_problem_dir = true;
						break;
					}
				}
				if(!flag_of_problem_dir)
				{
					up.i = ghost_row;
					up.j = ghost_column - 1;
					var ghostGoUpDist = Math.abs((ghost_column-1)-pac_column) + Math.abs((ghost_row)-pac_row);
					up.dist = ghostGoUpDist;
					dirs.push(up);
					// if we need to update list
					if(ghosts[k].lastDistances.length == 7){
						// remove oldest
						ghosts[k].lastDistances.shift();
					}
					// whichDirection.push("up");
				}
			
		}
		// down
		if (
			ghost_column < (boardlength-1) && 
			board[ghost_row][ghost_column + 1] != 5 &&
			ghostBoard[ghost_row][ghost_column + 1] != 6
			){
				dirIfStuck.i = ghost_row;
				dirIfStuck.j = ghost_column + 1;
				arrayIfStuck.push(dirIfStuck);
				var flag_of_problem_dir=false;
				// if ghost is not stuck
			for(var dir=0; dir<directionForbidden.length; dir++){
				if(
					directionForbidden[dir].i == ghost_row &&
					directionForbidden[dir].j == ghost_column + 1
				)
				{
					// up is a problem because of stuck issue
					flag_of_problem_dir = true;
					break;
				}
			}
			if(!flag_of_problem_dir)
			{
				down.i = ghost_row;
				down.j = ghost_column + 1;
				var ghostGoDownDist = Math.abs((ghost_column+1)-pac_column) + Math.abs((ghost_row)-pac_row);
				down.dist = ghostGoDownDist;
				dirs.push(down);
				// if we need to update list
				if(ghosts[k].lastDistances.length == 7){
					// remove oldest
					ghosts[k].lastDistances.shift();
				}
				// whichDirection.push("down");
			}	
		}
		// left
		if (
			ghost_row > 0 && 
			board[ghost_row - 1][ghost_column] != 5 &&
			ghostBoard[ghost_row -1][ghost_column] != 6
			) {
				dirIfStuck.i = ghost_row - 1;
				dirIfStuck.j = ghost_column;
				arrayIfStuck.push(dirIfStuck);
				var flag_of_problem_dir=false;
				// if ghost is not stuck
			for(var dir=0; dir<directionForbidden.length; dir++){
				if(
					directionForbidden[dir].i == ghost_row - 1 &&
					directionForbidden[dir].j == ghost_column 
				)
				{
					// up is a problem because of stuck issue
					flag_of_problem_dir = true;
					break;
				}
			}
			if(!flag_of_problem_dir)
			{
				left.i = ghost_row - 1;
				left.j = ghost_column;
				var ghostGoLeftDist = Math.abs((ghost_column)-pac_column) + Math.abs((ghost_row-1)-pac_row);
				left.dist = ghostGoLeftDist;
				dirs.push(left);
				// if we need to update list
				if(ghosts[k].lastDistances.length == 7){
					// remove oldest
					ghosts[k].lastDistances.shift();
				}
				// whichDirection.push("left");
			}
			
		}
		// right
		if (
			ghost_row < (boardlength-1) && 
			board[ghost_row + 1][ghost_column] != 5 &&
			ghostBoard[ghost_row + 1][ghost_column] != 6
			) {
				dirIfStuck.i = ghost_row + 1;
				dirIfStuck.j = ghost_column;
				arrayIfStuck.push(dirIfStuck);
				var flag_of_problem_dir=false;
				// if ghost is not stuck
			for(var dir=0; dir<directionForbidden.length; dir++){
				if(
					directionForbidden[dir].i == ghost_row + 1 &&
					directionForbidden[dir].j == ghost_column 
				)
				{
					// up is a problem because of stuck issue
					flag_of_problem_dir = true;
					break;
				}
			}
			if(!flag_of_problem_dir)
			{
				right.i = ghost_row + 1;
				right.j = ghost_column;
				var ghostGoRightDist = Math.abs((ghost_column)-pac_column) + Math.abs((ghost_row+1)-pac_row);
				right.dist = ghostGoRightDist;
				dirs.push(right);
				// if we need to update list
				if(ghosts[k].lastDistances.length == 7){
					// remove oldest
					ghosts[k].lastDistances.shift();
				}
				// whichDirection.push("right");
			}
			
		}
		if(dirs.length!=0){
			var min = dirs[0].dist;
			var minIndex = 0;
			// loop to find a way with minimum distance from ghost k, to pacman
			for (var t = 1; t < dirs.length; t++) {
				if (dirs[t].dist < min) {
					minIndex = t;
					min = dirs[t].dist;
				}
			}
			ghosts[k].lastDistances.push(dirs[minIndex]);
			// draw in another place
			ghostBoard[ghosts[k].i][ghosts[k].j] = 0;
			// update specific ghost on the change of place
			ghosts[k].i = dirs[minIndex].i;
			ghosts[k].j = dirs[minIndex].j;
			// draw in here
			ghostBoard[ghosts[k].i][ghosts[k].j] = 6;
		}
		else{
			// if stuck with no solution
			// draw in another place
			ghostBoard[ghosts[k].i][ghosts[k].j] = 0;
			// update specific ghost on the change of place
			var randomIndex = Math.floor(Math.random() * (arrayIfStuck.length))
			ghosts[k].i = arrayIfStuck[randomIndex].i;
			ghosts[k].j = arrayIfStuck[randomIndex].j;
			// draw in here
			ghostBoard[ghosts[k].i][ghosts[k].j] = 6;
		}

		// At the end of ghost move, check if it ate pacman
		// only check if it ate pacman, if there is no use in chillPill
		if(ghostsCanAttack){
			checkIfPacmanJustBeenAte();
		}	
	}
}

function UpdateSpecialPoint(){
	// special point - choose random combination of i,j
	var randDirArr = new Array();
	var special_row = specialPoint.i;
	var special_column = specialPoint.j;
	var up = new Object();
	var down = new Object();
	var left = new Object();
	var right = new Object();
	// up
	if (special_column > 0 && board[special_row][special_column - 1] != 5) {
		up.i = special_row;
		up.j = special_column - 1;
		randDirArr.push(up);
	}
	// down
	if (special_column < (boardlength-1) && board[special_row][special_column + 1] != 5) {
		down.i = special_row;
		down.j = special_column + 1;
		randDirArr.push(down);
	}
	// left
	if (special_row > 0 && board[special_row - 1][special_column] != 5) {
		left.i = special_row - 1;
		left.j = special_column;
		randDirArr.push(left);
	}
	// right
	if (special_row < (boardlength-1) && board[special_row + 1][special_column] != 5) {
		right.i = special_row + 1;
		right.j = special_column;
		randDirArr.push(right);
	}
	var randDir = Math.floor(Math.random() * (randDirArr.length));
	// switch places of special point randomly
	specialPointBoard[specialPoint.i][specialPoint.j] = 0;
	specialPoint.i = (randDirArr[randDir]).i;
	specialPoint.j = (randDirArr[randDir]).j;
	specialPointBoard[specialPoint.i][specialPoint.j] = 7;

	// points for eating special food
	// can only eat once in a game
	if(specialPointBoard[shape.i][shape.j] == 7){
		score+=50;
		// finish it
		window.clearInterval(interval_specialPoint);
		specialPointBoard[shape.i][shape.j] = 0;		
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	// move pacman

	// up
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 5) {
			shape.j--;
			// for different faces direction
			startAngle=1.35 * Math.PI;
			finishAngle=1.65 * Math.PI;
			flag_clockwise = true;
			eye_x = 15;
			eye_y = -2;
		}
	}
	// down
	if (x == 2) {
		if (shape.j < (boardlength-1) && board[shape.i][shape.j + 1] != 5) {
			shape.j++;
			// for different faces direction
			startAngle=0.65 * Math.PI;
			finishAngle=0.35 * Math.PI;
			flag_clockwise = false;
			eye_x = 15;
			eye_y = -2;
		}
	}
	// left
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 5) {
			shape.i--;
			// for different faces direction
			startAngle=0.85 * Math.PI;
			finishAngle=1.15 * Math.PI;
			flag_clockwise = true;
			eye_x = 5 ;
			eye_y = -15;	
		}
	}
	// right
	if (x == 4) {
		if (shape.i < (boardlength-1) && board[shape.i + 1][shape.j] != 5) {
			shape.i++;
			// for different faces direction
			startAngle=0.15 * Math.PI;
			finishAngle=1.85 * Math.PI;
			flag_clockwise = false;
			eye_x = 5 ;
			eye_y = -15;
		}
	}
	// pacman ate slowPill
	if(board[shape.i][shape.j] == 9){
		activateSlowPill();
	}
	// pacman ate chillPill
	if(board[shape.i][shape.j] == 8){
		activateChillPill();
	}
	// points for eating 5 points food
	if (board[shape.i][shape.j] == 1) {
		score+=5;
		amountOfBallsLeft--;
	}
	// points for eating 15 points food
	if (board[shape.i][shape.j] == 2) {
		score+=15;
		amountOfBallsLeft--;
	}
	// points for eating 25 points food
	if (board[shape.i][shape.j] == 3) {
		score+=25;
		amountOfBallsLeft--;
	}
	// points for eating special food
	// can only eat once in a game
	if(specialPointBoard[shape.i][shape.j] == 7){
		score+=50;
		// finish it
		window.clearInterval(interval_specialPoint);
		specialPointBoard[shape.i][shape.j] = 0;		
	}
	// define next location of pacman
	board[shape.i][shape.j] = 4;

	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	// turn pacman into green if it is very good
	// if (score >= 20 && time_elapsed <= 10) {
	// 	pac_color = "green";
	// }

	// end game because of time limit
	// or end of balls of points
	if (
		time_elapsed >= timeOfGame ||
		amountOfBallsLeft == 0
	){
		if (score < 100){
			window.alert("You are better than "+score+" points!");
		}
		else{
			window.alert("Winner!!!");
		}
		window.clearInterval(interval);
		window.clearInterval(interval_ghosts);
		window.clearInterval(interval_specialPoint);
		// stops sound when finish game
		checkboxsound = document.getElementById('accept');
		checkboxsound.checked = false;
		controlSound();
	}
	else{
		// after pacman moved, check if he run into ghosts
		// only check if ghost ate pacman, if there is no use in chillPill
		if(ghostsCanAttack){
			checkIfPacmanJustBeenAte();
		}	
		Draw();
	}
	
	
	
}

function checkIfPacmanJustBeenAte(){
	// reset ghosts when pacman get eaten
	for(var m=0; m<ghostAmount; m++){
		if (
			ghosts[m].i == shape.i &&
			ghosts[m].j == shape.j
		){
			flagContinueToResetPacman = true;
			// stop checking for catching pacman
			// if it was caught
			break;
		}
	}
	if(flagContinueToResetPacman){
		// reset ghosts
		for(var m=0; m<ghostAmount; m++){
			
			ghostBoard[ghosts[m].i][ghosts[m].j] = 0;
			ghosts[m].i=arrOfPosToResetGhosts[m].i;
			ghosts[m].j=arrOfPosToResetGhosts[m].j;
			ghostBoard[ghosts[m].i][ghosts[m].j] = 6;
		}

		// reset pacman and other stuff, if ghosts run into pacman
		board[shape.i][shape.j] = 0;
		shape.i = Math.floor(Math.random() * 9 + 1);
		shape.j = Math.floor(Math.random() * 9 + 1);

		// update new pacman
		var emptyCell = findRandomEmptyCell(board);
		shape.i = emptyCell[0];
		shape.j = emptyCell[1];
		board[shape.i][shape.j] = 2;

		// low score for being eaten
		score -= 10;
		// create string according to id of image of life.
		var stringOfLifeCalculated = "life"+amountLifeLeft;
		document.getElementById(stringOfLifeCalculated).style.display="none"; 
		amountLifeLeft--;
		if(amountLifeLeft == 0){
			window.clearInterval(interval);
			window.clearInterval(interval_ghosts);
			window.clearInterval(interval_specialPoint);
			window.alert("Loser!");
			checkboxsound = document.getElementById('accept');
			checkboxsound.checked = false;
			controlSound();
		}
		// not allowing negative amount of points
		if (score < 0){
			score = 0 ;
		}
		flagContinueToResetPacman = false;
	}	
}

function newGame(){
	window.clearInterval(interval);
	window.clearInterval(interval_ghosts);
	window.clearInterval(interval_specialPoint);
	Start();
	fillHearts();
	initIntervals();
	playSound.currentTime = 0;
	document.getElementById('accept').checked = true;
	controlSound();

}

var imgOfGhosts = new Array();

function activateChillPill(){
	// if it turn off now
	if(ghostsCanAttack){
		ghostsCanAttack = false;
		// save each ghost image to turn back later
		for(var m=0; m<ghostAmount; m++){
			imgOfGhosts.push(ghosts[m].img);
			ghosts[m].img = new Image();
			ghosts[m].img.src = "./images/transparent_ghost.jpg";
		}
		setTimeout(function(){
			activateChillPill();
		  }, 8000);
	}
	// if it turn off now - stop chillPill
	else{
		ghostsCanAttack = true;
		for(var m=0; m<ghostAmount; m++){
			// bring images back to their ghosts
			ghosts[m].img = imgOfGhosts[m];
		}
	}
}

function activateSlowPill(){
	// if it turn off now
	if(!ghostsSlowDown){
		ghostsSlowDown = true;
		// slow down intervals of ghosts
		clearInterval(interval_ghosts);
		interval_ghosts = setInterval(UpdateGhosts, 1000);

		setTimeout(function(){
			activateSlowPill();
		  }, 5000);
	}
	// if it turn off now - stop slowPill
	else{
		ghostsSlowDown = false;
		clearInterval(interval_ghosts);
		interval_ghosts = setInterval(UpdateGhosts, 300);
	}
}

function fillHearts(){
	for(var i=1; i<6; i++){
		var stringOfLifeCalculated = "life"+i;
		document.getElementById(stringOfLifeCalculated).style.display="block"; 
	}
}
////GAME/////

function showChosenSettings(){
		//chosen key
		document.getElementById("showup").value = showUp;
		document.getElementById("showdown").value = showDown;
		document.getElementById("showright").value = showRight;
		document.getElementById("showleft").value = showLeft;
	
		//chosen food amount
		document.getElementById("showballs").innerHTML = foodAmount;
	
		//chosen colors
		document.getElementById("show5point").style.backgroundColor = fivePoints;
		document.getElementById("show15point").style.backgroundColor = fifteenPoints;
		document.getElementById("show25point").style.backgroundColor = twentyfivePoints;
	
		//chosen duration
		document.getElementById("showtime").innerHTML = gameDuration;
	
		//chosen monsters
		document.getElementById("showmonsters").innerHTML = monsterQuantity;

}

function controlSound(){
	checkboxsound = document.getElementById('accept')
	if (checkboxsound.checked){
		playSound.play();
		document.getElementById('on').style.display = 'block'
		document.getElementById('off').style.display = 'none'
	}
	else{
		playSound.pause();
		document.getElementById('on').style.display = 'none'
		document.getElementById('off').style.display = 'block'
	}

}




