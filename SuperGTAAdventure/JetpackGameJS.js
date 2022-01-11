var userCharacter, characterDecision, chosenCharacter, startArea, chosenCharacterFlying, generatedObstaclesTop, generatedObstaclesBottom, userScore, userHighScore, displayHighScore, backgroundMusicJetpack, deathNoise, jetpackNoise, winAudio, userLevel;
generatedObstaclesTop = [];
generatedObstaclesBottom = [];
userHighScore = 0;
userLevel = 1;

//The following function allows the user to choose their own 'skin' for the game.
//It is done by taking the value of the textbox on the home page, then associating that number with a certain character. If the input is invalid, the user can not start the game.
function choseCharacter(){
  document.getElementById("start").disabled = false;
  characterDecision = document.getElementById("characterdecision").value;
  if (characterDecision == 1) {
    chosenCharacter = "Images/Character1T.png";
    chosenCharacterFlying = "Images/Character1TFlying.png";
    document.getElementById("characterchosen").innerHTML = "Your character is Trevor from GTA";
  }
  else if (characterDecision == 2) {
    chosenCharacter = "Images/Character1M.png";
    chosenCharacterFlying = "Images/Character1MFlying.png";
        document.getElementById("characterchosen").innerHTML = "Your character is Micheal from GTA";
  }
  else if (characterDecision == 3) {
    chosenCharacter = "Images/Character1F.png";
    chosenCharacterFlying = "Images/Character1FFlying.png";
    document.getElementById("characterchosen").innerHTML = "Your character is Franklin from GTA";
  }
  else if (characterDecision == 4) {
    chosenCharacter = "Images/Character1Noob.png";
    chosenCharacterFlying = "Images/Character1NoobFlying.png";
    document.getElementById("characterchosen").innerHTML = "Your character is the Noob Skin from Fortnite";
  }
  else if (characterDecision == 5) {
    chosenCharacter = "Images/Character1Banana.png";
    chosenCharacterFlying = "Images/Character1BananaFlying.png";
    document.getElementById("characterchosen").innerHTML = "Your character is the Banana Skin from Fortnite";
  }
  else{
    document.getElementById("characterchosen").innerHTML = "You have not entered a valid character. Please enter either 1, 2, 3, 4, or 5";
    document.getElementById("start").disabled = true;
  }
}
//This function simply starts the game. It creates the game area, as well as the sounds and the components used in the game.
function startJetpackGame() {
  startArea = document.getElementById("startarea");
  document.body.removeChild(startArea);
  backgroundMusicJetpack = new sound("Music/BackgroundMusicJetpack.mp3");
  deathNoise = new sound("Music/DeathNoise.mp3");
  jetpackNoise = new sound("Music/JetpackNoise.mp3");
  winAudio = new sound("Music/WinAudio.mp3");
  userCharacter = new component(20, 30, chosenCharacter, 10, 150, "image");
  userScore = new component("30px", "Consolas", "black", 28, 40, "text");
  //the new sound and new component where learned from ww3schools at: https://www.w3schools.com/graphics/game_components.asp.
  //it works by creating different sounds by calling the sound constructor function, and by creating different components by calling the component constructor function.
  //I edited the component function from the original to allow for an image to show up on the component, and allow the user to change that image through the usage of the variable chosenCharacter and chosenCharacterFlying.
  displayHighScore = document.createElement("p");
  displayHighScore.id = "HighScore";
  document.body.appendChild(displayHighScore);
  document.getElementById("HighScore").innerHTML = "Your high score is " + userHighScore + ". You are currently on level " + userLevel;
  gameArea.start();
  document.getElementById("start").disabled = true;
}

//The following function was also learned at https://www.w3schools.com/graphics/game_canvas.asp.
//The function creates a canvas that acts as a game area.
var gameArea = {
    canvas : document.createElement("canvas"),
    //This function creates a canvas element and inserts it in the body element
    start : function() {
        this.canvas.width = 600;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        //inserted before the first childNode
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    //Below is the function which clears different components on the canvas
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    //This function calls the clear function above to remove the intervals from the canvas
    stop : function() {
    clearInterval(this.interval);
  }
}
//This is the component function already mentioned above, learned from ww3w3schools
function component(width, height, color, x, y, type) {
    this.type = type;
    // allows image to be placed on component
    if (type == "image") {
       this.image = new Image();
       this.image.src = color;
   }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    //learned from ww3schools; draws on the canvas
    this.update = function() {
        context = gameArea.context;
        if (this.type == "text") {
            context.font = this.width + " " + this.height;
            context.fillStyle = color;
            context.fillText(this.text, this.x, this.y);
        }
        else if (type == "image") {
            context.drawImage(this.image,
            this.x,
            this.y,
            this.width, this.height);
          }
          else {
            context.fillStyle = color;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    // Again ww3schools, function is used to change the position of the game piece.
    this.newPosition = function() {
      this.gravitySpeed += this.gravity;
      this.y += this.speedY + this.gravitySpeed;
      //if the game piece hits the top or the bottom of the game area, the below function is called.
      this.hitTopOrBottom();
    }
    this.hitTopOrBottom = function() {
        var bottom = gameArea.canvas.height - this.height;
        var top = 0;
        //below is learned from w3schools
        if (this.y > bottom) {
            restartGame();
            deathNoise.play();
          }
          //below is added by ourselves to the game
          else if (this.y < top ) {
            restartGame();
            deathNoise.play();
        }
    }
    //Learned from w3schools
    //The below funciton is checking to see if their are any collision. If there are, the game is over.
    this.crashWith = function crash(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}
//Inspired by w3schools but changed
//The following function updates the game area based on the frameNo
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < generatedObstaclesTop.length; i += 1) {
        if (userCharacter.crashWith(generatedObstaclesTop[i]) || userCharacter.crashWith(generatedObstaclesBottom[i]) || this.y > (gameArea.canvas.height - this.height) || this.y < 0) {
          if (gameArea.frameNo == 1054){
            alert("yay");
            restartGame();
            gameArea.frameNo = 154
          }
          else{
          stop();
          restartGame();
          deathNoise.play();
          return;
        }
        }
    }
    for (i = 0; i < generatedObstaclesBottom.length; i += 1) {
        if (userCharacter.crashWith(generatedObstaclesTop[i]) || userCharacter.crashWith(generatedObstaclesBottom[i]) || this.y > (gameArea.canvas.height - this.height) || this.y < 0) {
          stop();
          restartGame();
          deathNoise.play();
          return;
        }
    }
    gameArea.clear();
    gameArea.frameNo += 1;
    if (gameArea.frameNo == 1 || everyinterval(75)) {
      var building;
      var floornumber = Math.round(Math.random()*3);
      if(floornumber == 1){
        building = "Images/Building1.png";
      }
      else if(floornumber == 2){
        building = "Images/Building2.png";
      }
      else{
        building = "Images/Building2.png";
      }
      var air;
        x = gameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        if (height < 75){
          air = "Images/Plane.png";
        }
        else if(height < 125){
          air = "Images/Blimp.png";
        }
        else {
          air = "Images/Helicopter.png";
        }

        minGap = 75;
        maxGap = 100;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        generatedObstaclesTop.push(new component(100, height, air, x, 0, "image"));
        generatedObstaclesBottom.push(new component(100, x - height - gap, building, x, height + gap + 30, "image"));
    }
    if (userLevel == 1){
      levelOne();
    }
    else if (userLevel == 2) {
      levelTwo();
    }
    else if (userLevel == 3) {
      levelThree();
    }
    else if (userLevel == 4) {
      levelFour();
    }
    else if (userLevel == 5) {
      levelFive();
    }
    userScore.text="SCORE: " + gameArea.frameNo;
    if (gameArea.frameNo > userHighScore){
      userHighScore = gameArea.frameNo;
      document.getElementById("HighScore").innerHTML = "Your high score is " + userHighScore + ". You are currently on level " + userLevel;;
    }
    userScore.update();
    userCharacter.newPosition();
    userCharacter.update();
}

function everyinterval(n) {
    if ((gameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
function accelerate(n) {
  userCharacter.gravity = n;
}
function moveGamePiece(event) {
    backgroundMusicJetpack.play();
    jetpackNoise.play();
  var keyPressed = event.keyCode;
 if (keyPressed == "32") {
   event.preventDefault();
   userCharacter.speedY = -3;
      accelerate(-0.4);
   userCharacter.image.src = chosenCharacterFlying;
 }
 else if (keyPressed == "8") {
   alert("You gave up on level " + userLevel);
   userLevel++;
   gameArea.frameNo = 0;
   userHighScore = 0;
   updateGameArea();
   restartGame();
   deathNoise.play();
 }
 else {
   userCharacter.speedY = 3;
    accelerate(0.4);
 }
}
function resetMovement(){
  jetpackNoise.stop();
  userCharacter.image.src = chosenCharacter
  userCharacter.speedX = 0;
  userCharacter.speedY = 0;
  accelerate(0.2);
}

function restartGame() {
  if (gameArea.frameNo > userHighScore) {
    userHighScore = gameArea.frameNo;
  }
  generatedObstaclesTop = [];
  generatedObstaclesBottom = [];
  gameArea.frameNo = 0;
  userCharacter = new component(20, 30, chosenCharacter, 10, 150, "image");
}
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}
function levelOne(){
  for (i = 0; i < generatedObstaclesTop.length; i++) {
      generatedObstaclesTop[i].x += -3;
      generatedObstaclesTop[i].update(
      );
      if (gameArea.frameNo % 50 == 0){
        generatedObstaclesTop[i].y = generatedObstaclesTop[i].y + 5;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo % 25 == 0){
        generatedObstaclesTop[i].y = generatedObstaclesTop[i].y -5;
        generatedObstaclesTop[i].update();
      }
      if(gameArea.frameNo > 100 && gameArea.frameNo < 200){
        generatedObstaclesTop[i].x += -2;
        generatedObstaclesTop[i].update();
        this.crashWith = function(otherobj){

        }
      }
      else if(gameArea.frameNo > 200 && gameArea.frameNo < 500) {
        generatedObstaclesTop[i].x += -1;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 500 && gameArea.frameNo < 700) {
        generatedObstaclesTop[i].x += -2;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 700 && gameArea.frameNo < 850) {
        generatedObstaclesTop[i].x += -0.1;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 850 && gameArea.frameNo < 1000) {
        generatedObstaclesTop[i].x += -5;
        generatedObstaclesTop[i].update();
      }
  }
  for (i = 0; i < generatedObstaclesBottom.length; i++) {
      generatedObstaclesBottom[i].x += -3;
      generatedObstaclesBottom[i].update(
      );
      if(gameArea.frameNo > 100 && gameArea.frameNo < 200){
        generatedObstaclesBottom[i].x += -2;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 200 && gameArea.frameNo < 500) {
        generatedObstaclesBottom[i].x += -1;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 500 && gameArea.frameNo < 700) {
        generatedObstaclesBottom[i].x += -2;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 700 && gameArea.frameNo < 850) {
        generatedObstaclesBottom[i].x += -0.1;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 850 && gameArea.frameNo < 1000) {
        generatedObstaclesBottom[i].x += -5;
        generatedObstaclesBottom[i].update();
      }
  }
  if(gameArea.frameNo > 1000) {
    userLevel = 2;
    gameArea.frameNo = 0;
    userHighScore = 0;
    updateGameArea();
    winAudio.play()
    restartGame();
  }
}
function levelTwo(){
  document.getElementById("HighScore").innerHTML = "Your high score is " + userHighScore + ". You are currently on level " + userLevel;
  for (i = 0; i < generatedObstaclesTop.length; i++) {
      generatedObstaclesTop[i].x += -3;
      generatedObstaclesTop[i].update(
      );
      if (gameArea.frameNo % 50 == 0){
        generatedObstaclesTop[i].y = generatedObstaclesTop[i].y + 10;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo % 25 == 0){
        generatedObstaclesTop[i].y = generatedObstaclesTop[i].y -10;
        generatedObstaclesTop[i].update();
      }
      if(gameArea.frameNo > 0 && gameArea.frameNo < 100){
        generatedObstaclesTop[i].x += -2;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 100 && gameArea.frameNo < 200){
        generatedObstaclesTop[i].x += -1;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 200 && gameArea.frameNo < 500) {
        generatedObstaclesTop[i].x += -2;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 500 && gameArea.frameNo < 550) {
        generatedObstaclesTop[i].x += -0.1;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 550 && gameArea.frameNo < 570) {
        generatedObstaclesTop[i].x += -10;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 600 && gameArea.frameNo < 850) {
        generatedObstaclesTop[i].x += -1;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 850 && gameArea.frameNo < 900) {
        generatedObstaclesTop[i].x += 0;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 900 && gameArea.frameNo < 920) {
        generatedObstaclesTop[i].x += -15;
        generatedObstaclesTop[i].update();
      }
  }
  for (i = 0; i < generatedObstaclesBottom.length; i++) {
      generatedObstaclesBottom[i].x += -3;
      generatedObstaclesBottom[i].update();
      if(gameArea.frameNo > 0 && gameArea.frameNo < 100){
        generatedObstaclesBottom[i].x += -2;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 100 && gameArea.frameNo < 200){
        generatedObstaclesBottom[i].x += -2;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 200 && gameArea.frameNo < 500) {
        generatedObstaclesBottom[i].x += -1;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 500 && gameArea.frameNo < 550) {
        generatedObstaclesBottom[i].x += -2;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 550 && gameArea.frameNo < 570) {
        generatedObstaclesBottom[i].x += -0.1;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 600 && gameArea.frameNo < 850) {
        generatedObstaclesBottom[i].x += -10;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 850 && gameArea.frameNo < 900) {
        generatedObstaclesBottom[i].x += -1;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 900 && gameArea.frameNo < 920) {
        generatedObstaclesBottom[i].x += 0;
        generatedObstaclesBottom[i].update();
      }
  }
  if(gameArea.frameNo > 1000) {
    userLevel = 3;
    gameArea.frameNo = 0;
    userHighScore = 0;
    updateGameArea();
    winAudio.play()
    restartGame();
  }
}
function levelThree(){
  document.getElementById("HighScore").innerHTML = "Your high score is " + userHighScore + ". You are currently on level " + userLevel;
  for (i = 0; i < generatedObstaclesTop.length; i++) {
      generatedObstaclesTop[i].x += -3;
      generatedObstaclesTop[i].update(
      );
      if (gameArea.frameNo % 50 == 0){
        generatedObstaclesTop[i].y = generatedObstaclesTop[i].y + 5;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo % 25 == 0){
        generatedObstaclesTop[i].y = generatedObstaclesTop[i].y -5;
        generatedObstaclesTop[i].update();
      }
      if(gameArea.frameNo > 100 && gameArea.frameNo < 200){
        generatedObstaclesTop[i].x += -2;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 200 && gameArea.frameNo < 500) {
        generatedObstaclesTop[i].x += -1;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 500 && gameArea.frameNo < 700) {
        generatedObstaclesTop[i].x += -2;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 700 && gameArea.frameNo < 850) {
        generatedObstaclesTop[i].x += -0.1;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 850 && gameArea.frameNo < 1000) {
        generatedObstaclesTop[i].x += -5;
        generatedObstaclesTop[i].update();
      }
  }
  for (i = 0; i < generatedObstaclesBottom.length; i++) {
      generatedObstaclesBottom[i].x += -3;
      generatedObstaclesBottom[i].update(
      );
      if(gameArea.frameNo > 100 && gameArea.frameNo < 200){
        generatedObstaclesBottom[i].x += -2;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 200 && gameArea.frameNo < 500) {
        generatedObstaclesBottom[i].x += -1;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 500 && gameArea.frameNo < 700) {
        generatedObstaclesBottom[i].x += -2;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 700 && gameArea.frameNo < 850) {
        generatedObstaclesBottom[i].x += -0.1;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 850 && gameArea.frameNo < 1000) {
        generatedObstaclesBottom[i].x += -5;
        generatedObstaclesBottom[i].update();
      }
  }
  if(gameArea.frameNo > 1000) {
    userLevel = 4;
    gameArea.frameNo = 0;
    userHighScore = 0;
    updateGameArea();
    winAudio.play()
    restartGame();
  }
}
function levelFour(){
  document.getElementById("HighScore").innerHTML = "Your high score is " + userHighScore + ". You are currently on level " + userLevel;
  for (i = 0; i < generatedObstaclesTop.length; i++) {
      generatedObstaclesTop[i].x += -3;
      generatedObstaclesTop[i].update(
      );
      if (gameArea.frameNo % 50 == 0){
        generatedObstaclesTop[i].y = generatedObstaclesTop[i].y + 5;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo % 25 == 0){
        generatedObstaclesTop[i].y = generatedObstaclesTop[i].y -5;
        generatedObstaclesTop[i].update();
      }
      if(gameArea.frameNo > 100 && gameArea.frameNo < 200){
        generatedObstaclesTop[i].x += -2;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 200 && gameArea.frameNo < 500) {
        generatedObstaclesTop[i].x += -1;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 500 && gameArea.frameNo < 700) {
        generatedObstaclesTop[i].x += -2;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 700 && gameArea.frameNo < 850) {
        generatedObstaclesTop[i].x += -0.1;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 850 && gameArea.frameNo < 1000) {
        generatedObstaclesTop[i].x += -5;
        generatedObstaclesTop[i].update();
      }
  }
  for (i = 0; i < generatedObstaclesBottom.length; i++) {
      generatedObstaclesBottom[i].x += -3;
      generatedObstaclesBottom[i].update(
      );
      if(gameArea.frameNo > 100 && gameArea.frameNo < 200){
        generatedObstaclesBottom[i].x += -2;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 200 && gameArea.frameNo < 500) {
        generatedObstaclesBottom[i].x += -1;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 500 && gameArea.frameNo < 700) {
        generatedObstaclesBottom[i].x += -2;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 700 && gameArea.frameNo < 850) {
        generatedObstaclesBottom[i].x += -0.1;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 850 && gameArea.frameNo < 1000) {
        generatedObstaclesBottom[i].x += -5;
        generatedObstaclesBottom[i].update();
      }
  }
  if(gameArea.frameNo > 1000) {
    userLevel = 5;
    gameArea.frameNo = 0;
    userHighScore = 0;
    updateGameArea();
    winAudio.play()
    restartGame();
  }
}
function levelFive(){
  document.getElementById("HighScore").innerHTML = "Your high score is " + userHighScore + ". You are currently on level " + userLevel;
  for (i = 0; i < generatedObstaclesTop.length; i++) {
      generatedObstaclesTop[i].x += -3;
      generatedObstaclesTop[i].update(
      );
      if (gameArea.frameNo % 50 == 0){
        generatedObstaclesTop[i].y = generatedObstaclesTop[i].y + 5;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo % 25 == 0){
        generatedObstaclesTop[i].y = generatedObstaclesTop[i].y -5;
        generatedObstaclesTop[i].update();
      }
      if(gameArea.frameNo > 100 && gameArea.frameNo < 200){
        generatedObstaclesTop[i].x += -2;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 200 && gameArea.frameNo < 500) {
        generatedObstaclesTop[i].x += -1;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 500 && gameArea.frameNo < 700) {
        generatedObstaclesTop[i].x += -2;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 700 && gameArea.frameNo < 850) {
        generatedObstaclesTop[i].x += -0.1;
        generatedObstaclesTop[i].update();
      }
      else if(gameArea.frameNo > 850 && gameArea.frameNo < 1000) {
        generatedObstaclesTop[i].x += -5;
        generatedObstaclesTop[i].update();
      }
  }
  for (i = 0; i < generatedObstaclesBottom.length; i++) {
      generatedObstaclesBottom[i].x += -3;
      generatedObstaclesBottom[i].update(
      );
      if(gameArea.frameNo > 100 && gameArea.frameNo < 200){
        generatedObstaclesBottom[i].x += -2;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 200 && gameArea.frameNo < 500) {
        generatedObstaclesBottom[i].x += -1;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 500 && gameArea.frameNo < 700) {
        generatedObstaclesBottom[i].x += -2;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 700 && gameArea.frameNo < 850) {
        generatedObstaclesBottom[i].x += -0.1;
        generatedObstaclesBottom[i].update();
      }
      else if(gameArea.frameNo > 850 && gameArea.frameNo < 1000) {
        generatedObstaclesBottom[i].x += -5;
        generatedObstaclesBottom[i].update();
      }
  }
  if(gameArea.frameNo > 1000) {
    userLevel = 2;
    gameArea.frameNo = 0;
    userHighScore = 0;
    updateGameArea();
    winAudio.play()
    restartGame();
  }
}
