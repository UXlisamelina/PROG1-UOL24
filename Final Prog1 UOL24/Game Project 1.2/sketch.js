//Game Project Final
//The Goal of the Game Project
//	-Collect 5 or more coins and get to the flag to win
//	-Points are lost when contact is made with the enemy
//	-Lives are lost when character falls into the Canyon
//	-Game over if all lives are lost
//Game variables from UOL
var gameChar_x;
var gameChar_y;
var floorPos_y;

var isLeft;
var isRight;
var isPlummeting;
var isFalling;

var trees_x;
var treePos_y;
var clouds;
var mountains;

var collectables;
var canyons;

var game_score;
var flagpole;
var lives;
var platforms;
var enemies;

//Variables assigned by Lisa T.
var sun;
var lightPoleX;
var lightPoleY;
var cameraPosX;
var showLevelCompleteText = false;

var jumpSound;
var winSound;
var coinSound;
var background_music;
var dieSound;
var bgMusicVolume;


//Function to preload sounds from the assets folder
function preload() {
    jumpSound = loadSound('assets/Jump_sound.mp3');
    winSound = loadSound('assets/Win_sound.mp3'); 
	coinSound = loadSound('assets/Coin_sound.mp3');
    gameOverSound = loadSound('assets/game over_sound.mp3');	
	background_music = loadSound('assets/background_music.mp3');
    dieSound = loadSound('assets/die_sound.mp3'); 
}


// Setup function for the game environment
function setup() {
    createCanvas(1024, 576);
	
	startGame();
}


function startGame() {
//Position of the Ground UOL
    floorPos_y = height * 3 / 4;
//Character lives initialized to 3
    lives = 3;
//Position of the game character UOL
    gameChar_x = width / 2;
    gameChar_y = floorPos_y;
	
    isLeft = false;
    isRight = false;
    isPlummeting = false;
    isFalling = false;
	
	cameraPosX = 0;
	
//Collectable Initialized by Lisa M.	
	collectables = [
        { x_pos: 1250, y_pos: 275, size: 45, isFound: false },
        { x_pos: -450, y_pos: 275, size: 45, isFound: false },
        { x_pos: 140, y_pos: 275, size: 45, isFound: false },
        { x_pos: 710, y_pos: 275, size: 45, isFound: false },
        { x_pos: 430, y_pos: 410, size: 45, isFound: false },
        { x_pos: 980, y_pos: 410, size: 45, isFound: false },
        { x_pos: -170, y_pos: 410, size: 45, isFound: false }
    ];
	
//Canyons Initialized by Lisa M.
	canyons = [
        { x_pos: 200, width: 200 },
        { x_pos: 700, width: 100 },
        { x_pos: 900, width: 50 },
        { x_pos: 10, width: 100 },
        { x_pos: 1200, width: 100 },
        { x_pos: -400, width: 150 }
    ];
	
//Sun initialized by Lisa M.	
	sun = { x: 900, y: 70, size: 120 };
	
// Tree positions initialized by Lisa M.
	trees_x = [-2200, -1930, -1660, -1390, -1120, -850, -580, -300, 10, 300, 580, 850, 1120, 1390, 1660, 1930, 2200];
    
	treePos_y = floorPos_y;
	
//Light pole initialized by Lisa M.	
	lightPoleX = trees_x;
    lightPoleY = treePos_y;
	
//Clouds initialized by Lisa M.	
	clouds = [
        { x: -200, y: 70 },
        { x: -600, y: 90 },
        { x: -1010, y: 40 },
        { x: -1340, y: 100 },
        { x: -1670, y: 25 },
        { x: -2000, y: 45 },
        { x: 100, y: 70 },
        { x: 400, y: 40 },
        { x: 700, y: 90 },
        { x: 1200, y: 30 },
        { x: 1600, y: 100 },
        { x: 2200, y: 45 }
    ];

//Mountains initialized by Lisa M.
	mountains = [];
    for (let i = -2000; i <= 2000; i += 100) {
        mountains.push({ x_pos: i, y_pos: 300 });
    }

//Creating the platforms coded by Lisa M.
	platforms = [];
    platforms.push(createPlatforms(600, floorPos_y - 100, 100, 1));
    platforms.push(createPlatforms(800, floorPos_y - 140, 100, -1)); 
    platforms.push(createPlatforms(950, floorPos_y - 200, 100, 1)); 
    platforms.push(createPlatforms(300, floorPos_y - 150, 100, -1)); 
    platforms.push(createPlatforms(200, floorPos_y - 240, 100, 1));  
    platforms.push(createPlatforms(30, floorPos_y - 300, 100, -1)); 
	
//Creating enemies coded by Lisa M.
	enemies = [];
    enemies.push(new Enemy(100, floorPos_y - 3, 100));
    enemies.push(new Enemy(600, floorPos_y - 3, 100));
    enemies.push(new Enemy(1000, floorPos_y - 3, 100));
	
//Game Score initialized from UOL lecture	
	game_score = 0;
	
    gameChar_world_x = gameChar_x - cameraPosX;
	
    flagpole = { isReached: false, x_pos: 1500 };
	
//Music setup coded by Lisa T.
    background_music.loop();
    bgMusicVolume = 0.1;
    background_music.setVolume(bgMusicVolume);
}
    

// Drawing function for the game environment coded by Lisa M.
function draw() {
// Sky background color
	background(50, 197, 255);
		
// Draw floor green color
    noStroke();
    fill(15, 172, 59); 
    rect(0, floorPos_y, width, height - floorPos_y);
	
// Draw "Level complete" text when flagpole is reached coded by Lisa M.
if (flagpole.isReached && !showLevelCompleteText) {
    // Set a 2-second delay using setTimeout
    setTimeout(function() {
        // After 2 seconds, set showLevelCompleteText to true
        showLevelCompleteText = true;
    }, 500);
}

// Check if showLevelCompleteText is true and then display confirmation coded by Lisa M.
if (showLevelCompleteText) {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Level complete, You Win!", width / 2, height / 2);
    // Stop further game logic if the text is displayed
    return;
}
	
// Draw "Game over" text when lives are less than 1
// Check if lives are less than 1
    if (lives < 1) {
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Game over", width / 2, height / 2);
        noLoop(); // Stop further game logic
        // Play game over sound
        playGameOverSound();
        return;		
    }
	
// Camera scrolling from UOL
    cameraPosX = gameChar_x - width / 2;
    push();
    translate(-cameraPosX, 0);
	
// Mountains coded by Lisa M.
    drawMountains ();

// Light pole, coded by Lisa M.
    drawLightPole ();

// Pine Tree, coded by Lisa M.
   	drawTrees ();
  
// Clouds coded by Lisa M.
   	drawClouds ();
       
// Collectable token, coded by Lisa M.
   	drawCollectable (collectables);
		
//Multiple Platforms
	for(var i = 0; i < platforms.length; i++) {
		platforms[i].draw();
	}
	
//Create multiple collectables
    	for(var i = 0; i < collectables.length; i++) {
            if (!collectables[i].isFound)
                {
                    drawCollectable(collectables[i]);
                    checkCollectable(collectables[i]);
                }
        }
    
// Check if the collectable is within a certain distance of the character, coded by Lisa M.
   	checkCollectable (collectables);
   
// Canyon, coded by Lisa M.
   	drawCanyon (canyons);  
		
//Create multiple canyons   
    	for(var i = 0; i < canyons.length; i++) {
            drawCanyon (canyons[i]);
            checkCanyon (canyons[i]);
        }
       
// Check collision with the canyon and make the character fall coded by Lisa M.
   	checkCanyon (canyons);
		
//Sun, coded by Lisa M.
   	drawSun();
		
//draw Flag
	renderFlagpole();

//Check if the game character has reached the flagpole
		if (flagpole.isReached == false) {
			checkFlagpole();
	   	}
	
// Check enemy contact coded by Lisa M.
	for (var i = 0; i < enemies.length; i++) {
    enemies[i].draw();
    var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);

    if (isContact) {
        // Respawn the character if lives are greater than 0
        if (lives > 0) {
            startGame(); 
            playDieSound(); 
            break;
        	}
    	}
	}
	
	gameChar_world_x = gameChar_x;  
  
//the game character was based on the lectures, then customized with the addition of the arms, the eyes and the hat, coded by Lisa M.	
	drawGameChar();	
		
//INTERACTION CODE - Conditional statements to move the game character
	if(isLeft == true) {
    gameChar_x -= 5;
	}

	if(isRight == true) {
    gameChar_x += 5;
	}

	if(gameChar_y < floorPos_y) {
    	var isContact = false;
    	for(var i = 0; i < platforms.length; i++) {
        if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true) {
            isContact = true;
            break;
        }
    }
		
    if(isContact == false) {
        gameChar_y += 2;
        isFalling = true;
    }
    else {
        isFalling = false;
    }
	} 
	else {
    isFalling = false;
	}
	
   		pop();
	
//Add a score counter 
	fill(0);
	noStroke();
	text ("Score: " + game_score, 20,30);
	text("Lives: " + lives, 20, 60);
	
	
// Game Control Instructions	
	fill(0);
	noStroke();
	textSize(20);
    text ("Game Control", width/2 - 40, floorPos_y + 50);
	textSize(15);
	text ("W = Jump", width/2 - 23, floorPos_y + 80);
	text ("D = Move Right", width/2 - 20, floorPos_y + 100);
	text ("A = Move Left", width/2 - 20, floorPos_y + 120);
}

    // Check if the game character has reached the flagpole
    if (flagpole.isReached == false) {
        checkFlagpole();
    } else {

   }
//End of draw function


//Detailed instructions for all drawings
// Draw clouds
function drawClouds() {
    for (var i = 0; i < clouds.length; i++) {
        drawSingleCloud(clouds[i].x, clouds[i].y);
    }
}

// Draw single cloud
function drawSingleCloud(x, y) {
    var cloudSize = 80;
    fill(255);
    ellipse(x + 25, y + 25, cloudSize, cloudSize * 0.625);
    ellipse(x + 50, y + 10, cloudSize, cloudSize * 0.625);
    ellipse(x + 60, y + 50, cloudSize, cloudSize * 0.625);
    ellipse(x + 140, y + 25, cloudSize, cloudSize * 0.625);
    ellipse(x + 105, y + 10, cloudSize, cloudSize * 0.625);
    ellipse(x + 100, y + 50, cloudSize, cloudSize * 0.625);
}

// Draw mountains
function drawMountains() {
    for (var i = 0; i < mountains.length; i++) {
        drawSingleMountain(mountains[i].x_pos, mountains[i].y_pos);
    }
}

// Draw single mountain
function drawSingleMountain(x, y) {
    fill(112, 128, 144);
    triangle(x + 300, y + 132, x + 405, y - 10, x + 510, y + 132);
    triangle(x + 200, y + 132, x + 305, y + 50, x + 410, y + 132);
}

// Draw trees
function drawTrees() {
    for (var i = 0; i < trees_x.length; i++) {
        drawSingleTree(trees_x[i], treePos_y);
    }
}

// Draw single tree
function drawSingleTree(x, y) {
    fill(138, 87, 51);
    rect(x + 110, y - 95, 45, 97);
    fill(46, 139, 87);
    triangle(x + 45, y - 95, x + 130, y - 170, x + 215, y - 95);
    fill(55, 178, 109);
    triangle(x + 60, y - 125, x + 130, y - 215, x + 200, y - 125);
    drawTreeDecorations(x, y);
}

// Draw tree decorations
function drawTreeDecorations(x, y) {
    fill(85, 107, 47);
    ellipse(x + 130, y - 195, 10, 20);
    ellipse(x + 100, y - 145, 10, 20);
    ellipse(x + 160, y - 145, 10, 20);
    ellipse(x + 130, y - 110, 10, 20);
}

// Draw light poles
function drawLightPole() {
    for (var i = 0; i < lightPoleX.length; i++) {
        drawSingleLightPole(lightPoleX[i], lightPoleY);
    }
}

// Draw single light pole
function drawSingleLightPole(x, y) {
    fill(50);
    rect(x, y - 100, 20, 100);
    fill(255, 239, 208);
    ellipse(x + 10, y - 130, 70, 70);
    fill(255, 255, 0);
    ellipse(x + 10, y - 115, 30, 40);
}

// Draw collectables
function drawCollectable(t_collectable) {
    if (!t_collectable.isFound) {
        var collectableSize = t_collectable.size;
        fill(218, 165, 32);
        ellipse(t_collectable.x_pos, t_collectable.y_pos, collectableSize, collectableSize);
        fill(255, 215, 0);
        ellipse(t_collectable.x_pos, t_collectable.y_pos, collectableSize * 0.75, collectableSize * 0.75);
        fill(255, 0, 0);
        ellipse(t_collectable.x_pos, t_collectable.y_pos, collectableSize * 0.4, collectableSize * 0.4);
    }
}

// Check collectables
function checkCollectable(t_collectable) {
    if (dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < t_collectable.size) {
        t_collectable.isFound = true;
        game_score += 1;
        coinSound.play();
    }
}

// Draw canyons
function drawCanyon(canyon) {
    fill(73, 94, 87);
    rect(canyon.x_pos, floorPos_y, canyon.width, height - floorPos_y);
}

// Draw sun
function drawSun() {
    fill(255, 223, 34);
    ellipse(sun.x, sun.y, sun.size);
}

// Render flagpole
function renderFlagpole() {
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    noStroke();
    if (flagpole.isReached) {
        rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
    } else {
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
    }
    pop();
}

// Check if the game character has reached the flagpole
function checkFlagpole() {
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if (d < 15 && !flagpole.isReached && game_score >= 5) {
        flagpole.isReached = true;
        playWinSound();
        if (!flagpole.isReachedBefore) {
            game_score += 10;
            flagpole.isReachedBefore = true;
        }
        background_music.pause();
    }
}

function drawGameChar() {
 	if(isLeft && isFalling) {
//character jumping-left 
//character head      
		fill(199, 183, 163);
   		ellipse(gameChar_x - 5, gameChar_y - 60, 35);
//character eye   
   		fill(0);
		ellipse(gameChar_x - 12, gameChar_y - 64, 5); 
//character body    
   		fill(255, 0, 0);
   		rect(gameChar_x - 18, gameChar_y - 45, 26, 30);
//character legs   
   		fill(0),
   		rect(gameChar_x - 25, gameChar_y - 15, 10, 10);
   		rect(gameChar_x - 2, gameChar_y - 15, 10, 10);
//character arms    
   		rect(gameChar_x - 25, gameChar_y - 40, 10, 5);
   		rect(gameChar_x - 2, gameChar_y - 40, 10, 5);
//character hat 
   		rect(gameChar_x - 20, gameChar_y -80, 30, 5);
   		ellipse(gameChar_x - 5, gameChar_y - 85, 25, 20);   
  	}
    else if(isRight && isFalling) {
//character jumping-right 
//character head  
   		fill(199, 183, 163);
   		ellipse(gameChar_x + 5, gameChar_y - 60, 35);
//character eye     
   		fill(0);
   		ellipse(gameChar_x + 13, gameChar_y - 64, 5); 
//character body      
   		fill(255, 0, 0);
   		rect(gameChar_x - 8, gameChar_y - 45, 26, 30);
//character legs    
   		fill(0);
   		rect(gameChar_x - 8, gameChar_y - 15, 10, 10);
  		rect(gameChar_x + 15, gameChar_y - 15, 10, 10);
//character arms   
   		rect(gameChar_x + 18, gameChar_y - 40, 10, 5);
   		rect(gameChar_x - 7, gameChar_y - 40, 10, 5);
//character hat         
   		rect(gameChar_x - 10, gameChar_y - 80, 30, 5);
   		ellipse(gameChar_x + 5, gameChar_y - 85, 25, 20);
    }
  	else if(isLeft) {
//Character walking left   
//character head    
   		fill(199, 183, 163);
   		ellipse(gameChar_x - 5, gameChar_y - 50, 35);
//character eye    
    	fill(0);
    	ellipse(gameChar_x - 12, gameChar_y - 54, 5);    
//character body   
    	fill(255, 0, 0);
		rect(gameChar_x - 18, gameChar_y - 35, 26, 30);
//character legs    
    	fill(0);
    	rect(gameChar_x - 25, gameChar_y - 5, 10, 10);
    	rect(gameChar_x - 2, gameChar_y - 5, 10, 10);
//character arms     
    	rect(gameChar_x-25, gameChar_y-30, 10, 5);
    	rect(gameChar_x-2, gameChar_y-30, 10,5);
//character hat       
    	rect(gameChar_x - 20, gameChar_y -70, 30, 5);
		ellipse(gameChar_x - 5, gameChar_y - 75, 25, 20);    
    }
    else if(isRight) {
//Character walking right
//character head
   		fill(199, 183, 163);
   		ellipse(gameChar_x + 5, gameChar_y - 50, 35);
//character eye   
   		fill(0);
   		ellipse(gameChar_x + 13, gameChar_y - 54, 5);
//character body    
   		fill(255, 0, 0);
   		rect(gameChar_x - 8, gameChar_y - 35, 26, 30);
//character legs   
   		fill(0);
   		rect(gameChar_x - 8, gameChar_y - 5, 10, 10);
   		rect(gameChar_x + 15, gameChar_y - 5, 10, 10);
//character arms     
   		rect(gameChar_x + 18, gameChar_y - 30, 10, 5);
   		rect(gameChar_x - 7, gameChar_y - 30, 10, 5);
//character hat       
   		rect(gameChar_x - 10, gameChar_y - 70, 30, 5);
   		ellipse(gameChar_x + 5, gameChar_y - 75, 25, 20);
    }
  	else if(isFalling || isPlummeting) {
//Character jumping & facing forward
//character head
   		fill(199, 183, 163);
   		ellipse(gameChar_x, gameChar_y - 60, 35);
//character eyes    
   		fill(0);
   		ellipse(gameChar_x - 7, gameChar_y - 64, 5);
   		ellipse(gameChar_x + 8, gameChar_y - 64, 5);
//character body     
   		fill(255, 0, 0);
   		rect(gameChar_x - 13, gameChar_y - 45, 26, 30);
//character legs   
   		fill(0);
   		rect(gameChar_x - 15, gameChar_y - 15, 10, 10);
   		rect(gameChar_x + 5, gameChar_y - 15, 10, 10);
//character arms   
   		rect(gameChar_x + 13, gameChar_y - 40, 10, 5);
   		rect(gameChar_x - 22, gameChar_y - 40, 10, 5);
//character hat        
   		rect(gameChar_x - 15, gameChar_y - 80, 30, 5);
   		ellipse(gameChar_x, gameChar_y - 85, 25, 20);
    }
   	else {
//Character standing front facing
//character head
   		fill(199, 183, 163);
		ellipse(gameChar_x, gameChar_y - 50, 35);
//character eyes    
   		fill(0);
   		ellipse(gameChar_x - 7,gameChar_y - 54, 5);
   		ellipse(gameChar_x + 8,gameChar_y - 54, 5);
//character body  
   		fill(255, 0, 0);
   		rect(gameChar_x - 13, gameChar_y - 35, 26, 30);
//character legs    
   		fill(0);
		rect(gameChar_x - 15, gameChar_y - 5, 10, 10);
   		rect(gameChar_x + 5, gameChar_y -5, 10, 10);
//character arms    
   		rect(gameChar_x + 13, gameChar_y - 30, 10, 5);
   		rect(gameChar_x - 22, gameChar_y - 30, 10, 5);
 //character hat  
   		rect(gameChar_x - 15, gameChar_y - 70, 30, 5);
   		ellipse(gameChar_x, gameChar_y - 75, 25, 20);
	}
}

function checkPlayerDie() {
    if (lives > 1) {
        // Decrement lives if more than 1
        lives--;
        // Reset character position
        gameChar_x = width / 2;
        gameChar_y = floorPos_y;
        // Reset plummeting status
        isPlummeting = false;
    } else {
        // Set lives to 0
        lives = 0;
    }
}

// Check collision with the canyon and make the character fall coded by Lisa M.
function checkCanyon(canyon) {
    // Check if the character is above the canyon
    if (gameChar_x > canyon.x_pos + 20 && gameChar_x < canyon.x_pos + canyon.width - 20) {
        // Apply falling action if below the canyon top and above the floor
        if (gameChar_y >= floorPos_y && gameChar_y <= floorPos_y + 10) {
            // Apply falling action if the character is above the floor
            isPlummeting = true;
            // Stop left movement
            isLeft = false;
            // Stop right movement
            isRight = false;
            playDieSound(); // Play the die sound
        }
    }

    // Check if the character has fallen below the floor
    if (gameChar_y > height) {
        // Deduct a life when falling below the floor
        checkPlayerDie();
    }

    // Apply falling action if isPlummeting is true
    if (isPlummeting) {
        // Falling Speed
        gameChar_y += 1;
    }
}

//Building the platform based on UOL lesson and adapted for this game by Lisa M
function createPlatforms(x, y, length, speed) {
    var p = {
        x: x,
        y: y,
        length: length,
        speed: speed,
        draw: function() {
            fill(218, 165, 32);
            rect(this.x, this.y, this.length, 20);
            // Update platform position based on speed
            this.x += this.speed;
            // Reverse direction when reaching canvas boundaries
            if (this.x > width || this.x < 0) {
                this.speed *= -1;
            }
        },
        checkContact:function(gc_x, gc_y) {
            // Check if the character is above the platform
            if (gc_x > this.x && gc_x < this.x + this.length) {
                var d = this.y - gc_y;
                // Check if the character is within a certain vertical range above the platform
                if (d >= 0 && d < 5) {
                    return true;
                }           
            }
            return false;
        }
    }
    return p;
}

//Creating enemies based on UOL lesson and adapted for this game by Lisa M.
function Enemy(x, y, range) {
	this.x = x;
	this.y = y;
	this.range = range;
	
	this.currentX = x;
	this.inc = 1;
	
	this.update = function () {
		this.currentX += this.inc;
		if(this.currentX >= this.x + this.range) {
			this.inc = -1;
		}
		else if(this.currentX < this.x) {
			this.inc =1;
		}
	}
	this.draw = function() {
		this.update();

		//Enemy coded by Lisa T
//enemy head
		fill(0, 204, 0);
		ellipse(this.currentX, this.y - 50, 35);
//enemy eyes    
   		fill(255,0,0);
   		ellipse(this.currentX - 7,this.y - 54, 5);
   		ellipse(this.currentX + 8,this.y - 54, 5);
//enemy body  
   		fill(0, 51, 0);
   		rect(this.currentX - 13, this.y - 35, 26, 30);
//enemy legs    
   		fill(153, 255, 153);
		rect(this.currentX - 15, this.y - 5, 10, 10);
   		rect(this.currentX + 5, this.y -5, 10, 10);
//enemy arms 
		rect(this.currentX + 13, this.y - 30, 10, 5);
   		rect(this.currentX - 22, this.y - 30, 10, 5);
 
	}
		this.checkContact = function(gc_x, gc_y) {
		var d = dist(gc_x, gc_y, this.currentX, this.y)
		
		if(d < 5) {
			return true;
		}
		return false;
	}
}



//All additional functions to make the game work as is intended.
function keyPressed() {
// Control the animation of the character when keys are pressed
// Use the console to confirm functionality
    console.log("keyPressed: " + key);
    console.log("keyPressed: " + keyCode);

    if (keyCode == 65 && !isPlummeting) {
        console.log("left arrow");
        isLeft = true;
    } else if (keyCode == 68 && !isPlummeting) {
        console.log("right arrow");
        isRight = true;
    } else if (keyCode == 87) {
    console.log("jumping");
    if (!isFalling || onPlatform()) {
        gameChar_y -= 190;
        jumpSound.play(); // Play the jump sound
    }
}
 	else if (keyCode === 32 && (lives < 1 || flagpole.isReached)) {
// Restart the game when spacebar is pressed
        restartGame();
    }
}

function onPlatform() {

    for (var i = 0; i < platforms.length; i++) {
        if (platforms[i].checkContact(gameChar_x, gameChar_y)) {
            return true;
        }
    }
    return false;
}

function keyReleased() {
// If statements that control the animation of the character when keys are released
    console.log("keyReleased: " + key);
    console.log("keyReleased: " + keyCode);

    if (keyCode == 65) {
        console.log("left arrow");
        isLeft = false;
    } else if (keyCode == 68) {
        console.log("right arrow");
        isRight = false;
    }
}


// Function to play the win sound
function playWinSound() {
    if (winSound.isLoaded() && !winSound.isPlaying()) {
        winSound.play();
    }
}

// Function to play the game over sound
function playGameOverSound() {
    if (gameOverSound.isLoaded() && !gameOverSound.isPlaying()) {
        gameOverSound.play();
		 // Stop the background music when the game is over
         background_music.pause();
    }
}

// Function to play the die sound
function playDieSound() {
    if (dieSound.isLoaded() && !dieSound.isPlaying()) {
        dieSound.play();
    }
}