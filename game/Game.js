// @author Rhys Howell + Ze'ev Lailair + Stu Harvey
// Happy Birthday Paul.
// No engines. Just code. HTML5 Canvas.

var canvas;
var ctx;

// Game is based on these. ()
var width = 800;
var height = 600;

// The fps is actually 1000/ VVVV
var fps = 15;

// For currently moving
var RIGHT = 1;
var LEFT = 0;

//Your character!
var puppums = new Puppums();

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

    gameWidth = window.innerWidth;
    gameHeight = window.innerHeight;

    ctx.canvas.width  = width;
    ctx.canvas.height = height;

    // local storage highscore
    if (localStorage.getItem("puppumsHighScorPLZDONTCHEATOMG")) {
        // there was a highscore! cool...
        highScore = localStorage.getItem("puppumsHighScorPLZDONTCHEATOMG");
        savedHighScore = localStorage.getItem("puppumsHighScorPLZDONTCHEATOMG");
    }

    // console.log("Canvas created, dimensions: " + width + "x" + height + " running at fps: " + (1000/fps));

    lastTime = Date.now();

    loadImages();

    // particles
    parts = [];
    for(i = 0; i < numberOfParts; i++) {
        parts[i] = new part(false, 0,0,0,0, 0);
    }

    resetGame();

    MSGs.push(new msg(true, "Use arrow keys to control! Space to Jump!", width/2 - 100, height - puppums.height,1, "black"));

    // setTimeout(function() {
    //     MSGs[1] = new msg(true, "WATCH OUT!!!!", gameWidth - gameWidth/5, floorSize + puppums.width/2,1, "black");
    //     MSGs[2] = new msg(true, "WATCH OUT!!!!", gameWidth/10, floorSize + puppums.width/2,1, "black");
    // }, 2000);

    //start the game loop
    setInterval(function () { gameLoop() }, fps);
}

function loadImages() {

}

function resetGame() {
    puppums = new Puppums();
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
    ctx.clearRect(0, 0, gameWidth, gameHeight);

    drawMSGs(ctx);
    drawPuppums(puppums);
    drawParts(ctx);
    //console.log("DogX: " + puppums.xPos + "  -  " + puppums.yPos);

    // ctx.fillStyle = "rgb(0,0,0)";
    // ctx.fillRect(0, (gameHeight-floorSize), gameWidth, 4);
    // ctx.fillRect(0, (gameHeight-floorSize) + 8, gameWidth, 2);
    // ctx.fillRect(0, (gameHeight-floorSize) + 14, gameWidth, 1);

    // ctx.font="30px Oswald";
    // ctx.fillText("LEVEL: " + currentLevel, 2, 30);
}

//call all game updates
function update(delta) {
    checkCollisions();

    updatePuppumsPos(delta);

    updateMSGs(delta);
    updateParts(delta);
}

function checkCollisions() {
    
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

        puppums.xPos = -gameWidth;

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
