// @author Rhys Howell + Ze'ev Lailair + Stu Harvey
// Happy Birthday Paul.
// No engines. Just code. HTML5 Canvas.

var canvas;
var ctx;

// Game is based on these. ()
var width = 800;
var height = 600;
var canvasWidth = 800;
var canvasHeight = 600;

var currentLevel = 0;

// The fps is actually 1000/ VVVV
var fps = 15;

// For currently moving
var RIGHT = 1;
var LEFT = 0;

//Your character!
var puppums = new Puppums();

var sideScrollX = 0;
var sideScrollY = 0;

// the attributes of each level
var mapData;
var platforms = [];
var walls = [];
var lava = [];
// collisions are performed in Collisions.js

//half the time returns the val as negative
function getNegative (toNegate) {
    if(Math.random() * 100 > 50)
        return - toNegate;
    else
        return toNegate;
}


function init() {
    canvas = document.getElementById('game_canvas');
    ctx = canvas.getContext('2d');

    ctx.canvas.width  = canvasWidth;
    ctx.canvas.height = canvasHeight;

    // local storage highscore
    if (localStorage.getItem("puppumsHighScorPLZDONTCHEATOMG")) {
        // there was a highscore! cool...
        highScore = localStorage.getItem("puppumsHighScorPLZDONTCHEATOMG");
        savedHighScore = localStorage.getItem("puppumsHighScorPLZDONTCHEATOMG");
    }

    // console.log("Canvas created, dimensions: " + width + "x" + height + " running at fps: " + (1000/fps));

    loadImages();
}

var startGame = function (mapID) {
    currentLevel = mapID;

    lastTime = Date.now();

    resetGame();

    MSGs.push(new msg(true, "Use arrow keys to control! Space to Jump!", width/2 - 100, height - puppums.height,1, "black"));

    // setTimeout(function() {
    //     MSGs[1] = new msg(true, "WATCH OUT!!!!", width - width/5, floorSize + puppums.width/2,1, "black");
    //     MSGs[2] = new msg(true, "WATCH OUT!!!!", width/10, floorSize + puppums.width/2,1, "black");
    // }, 2000);

    //start the game loop
    setInterval(function () { gameLoop() }, fps);
}

function loadImages() {

}

function resetGame() {
    puppums = new Puppums();

    // particles
    parts = [];
    for(i = 0; i < numberOfParts; i++) {
        parts[i] = new part(false, 0,0,0,0, 0);
    }

    var newGameSizes = {
        width: width,
        height: height
    }
    // right now auto loads a map (1)
    mapData = loadMap(currentLevel, walls, platforms, lava, newGameSizes);
    width = newGameSizes.width;
    height = newGameSizes.height;
}

function gameLoop() {
    var currentTime = Date.now();

    var deltaTime = (currentTime - lastTime)/1000;

    if(deltaTime < 0.2) { //dont allow when they come out and into tab for one iteration (or when hella slow)
        update(deltaTime);
    }

    render();

    lastTime = currentTime;
}

// The canvas drawing method
function render() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();

    //translate for the side scrolling XXXXX
    if(width != canvasWidth) {
        //check if player is near either side
        if(puppums.x <= canvasWidth/2) {
            sideScrollX = 0;
        }
        else if(puppums.x >= width - canvasWidth/2) {
            sideScrollX = width - canvasWidth;
        }
        else {
            sideScrollX = puppums.x - canvasWidth/2;
        }

        ctx.translate(-sideScrollX,0);
    }
    //translate for the side scrolling YYYYY
    if(height != canvasHeight) {
        //check if player is near either side
        if(puppums.y <= canvasHeight/2) {
            sideScrollY = 0;
        }
        else if(puppums.y >= height - canvasHeight/2) {
            sideScrollY = height - canvasHeight;
        }
        else {
            sideScrollY = puppums.y - canvasHeight/2;
        }
        ctx.translate(0,-sideScrollY);
    }

    drawMSGs(ctx);
    drawPuppums(puppums);
    drawParts(ctx);

    drawAllLava();
    drawPlatforms();
    drawWalls();

    ctx.restore();

    //console.log("DogX: " + puppums.xPos + "  -  " + puppums.yPos);

    // ctx.fillStyle = "rgb(0,0,0)";
    // ctx.fillRect(0, (height-floorSize), width, 4);
    // ctx.fillRect(0, (height-floorSize) + 8, width, 2);
    // ctx.fillRect(0, (height-floorSize) + 14, width, 1);

    // ctx.font="30px Oswald";
    // ctx.fillText("LEVEL: " + currentLevel, 2, 30);
}

//call all game updates
function update(delta) {
    checkCollisions(delta);


    updatePuppumsPos(delta);

    updateMSGs(delta);
    updateParts(delta);
    
    updatePlatforms(delta);
}

function checkCollisions(delta) {
    // VV both in Collisions.js
    checkCollisionObjectWall(puppums, delta);
    checkCollisionObjectPlatform(puppums, delta);
}

var updatePlatforms = function(delta) {
    if(platforms != undefined) {
        for(var i = 0; i < platforms.length; i++) {
            updatePlatform(delta, platforms[i]);
        }
    }
}

drawPlatforms = function() {
    if(platforms != undefined) {
        for(var i = 0; i < platforms.length; i++) {
            drawPlatform(ctx, platforms[i]);
        }
    }
}

drawWalls = function() {
    if(walls != undefined) {
        for(var i = 0; i < walls.length; i++) {
            drawWall(ctx, walls[i]);
        }
    }
}

drawAllLava = function() {
    if(lava != undefined) {
        for(var i = 0; i < lava.length; i++) {
           drawLava(ctx, lava[i], sideScrollX, sideScrollY);
        }
    }
}


//kill the dog and call the game reset
function killPup() {
    keepUpdating = false;

    if(savedHighScore < highScore) {
        localStorage.setItem("puppumsHighScorPLZDONTCHEATOMG", highScore);
    }

    setTimeout( function() {
        //particles for doggy death
        var numberOfPartsToAdd = 50;
        for(k = 0; k < numberOfParts; k++) {
            if(parts[k].alive == false) {
                numberOfPartsToAdd--;
                if(numberOfPartsToAdd == 0)
                    break;
                parts[k] = new part(true,
                    puppums.xPos + puppums.width/2 + Math.random()*getNegative(puppums.width/2),puppums.yPos - puppums.width/2 + Math.random()*getNegative(puppums.width/2),
                    getNegative(Math.random()*maxPartSpeed),
                    -(Math.random()*maxPartSpeed + minPartSpeed),
                    "black");
                parts[k].rotation = Math.random()*359.0;
                parts[k].rotationVelo = getNegative(Math.random()*359.0);

                //console.log("New particle added xv: "+parts[k].xdir + " yv: "+parts[k].ydir);
            }
        }

        puppums.xPos = -width;

        //start a new game
        setTimeout(function(){resetGame();},2000);
    }, 500);
}

window.addEventListener('keydown', this.keyPressed , false);

function keyPressed(e) {
    //document.getElementById("p1").innerHTML = "New text!";
    var key = e.keyCode;
    e.preventDefault();

    if(key == 37 || key == 65) { //left key
        puppums.left = true;
        puppums.facing = LEFT;
        puppums.right = false;
    }
    if(key == 39 || key == 68) { //right key
        puppums.right = true;
        puppums.facing = RIGHT;
        puppums.left = false;
    }
    if (key == 38 || key == 32) { // up or space
        puppums.space = true;
    }
}

window.addEventListener('keyup', this.keyReleased , false);

function keyReleased(e) {
    var upKey = e.keyCode;
    e.preventDefault();

    if(upKey == 37 || upKey == 65) { //left key
        puppums.left = false;
    }
    if(upKey == 39 || upKey == 68) { //right key
        puppums.right = false;
    }

    if(upKey == 32 || upKey == 38) { // up or space
        puppums.space = false;
        //space
    }
}

// touch screen
// they can't move, but they can jump!!!
window.addEventListener('touchstart', this.touchStart, false);

function touchStart() {
    if (puppums.jump == false) {
        puppums.space = true;
        puppums.jump = true;
        puppums.yDir = jumpSpeed;
    }
}

window.addEventListener('touchend', this.touchEnd, false);

function touchEnd() {
    puppums.space = false;
}
