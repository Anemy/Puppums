/* This contains the Puppums class */

const LEFT = 0;
const RIGHT = 1;

const jumpSpeed = 300;
const playerSpeed = 80;
const playerFallSpeed = 800;

// Puppum's images
var dogRm = [];
var dogLm = [];
var dogR;
var dogL;

// Loading images
dogRm[0] = new Image();
dogRm[0].src = (("game/pics/DogRm0.png"));
dogRm[1] = new Image();
dogRm[1].src = (("game/pics/DogRm1.png"));
dogLm[0] = new Image();
dogLm[0].src = (("game/pics/DogLm0.png"));
dogLm[1] = new Image();
dogLm[1].src = (("game/pics/DogLm1.png"));
dogR = new Image();
dogR.src = (("game/pics/DogR.png"));
dogL = new Image();
dogL.src = (("game/pics/DogL.png"));

//popXPos , popYPos , popXDir , popYDir , popFacing(0 or 1) , runCount
var Puppums = function () {
    this.x = 0;
    this.y = 0;

    this.xDir = 0;
    this.yDir = 0;

    this.facing = RIGHT; //1 right 0 left
    this.left = false;
    this.right = false;

    this.runCount = 0;

    this.jump = false;
    this.space = false;

    // square dimensions
    this.width = 30;
    this.height = 30;

    // not sure if I want to do it this way or not lol
    this.draw = function() {

    }
};

// Move into Puppums?
function updatePuppumsPos(delta) {
    puppums.yDir = puppums.yDir - playerFallSpeed * delta;

    puppums.runCount += delta;
    if (puppums.runCount >= 14) {
        puppums.runCount = 0;
    }

    if (puppums.left == true) {
        puppums.xDir = -playerSpeed;
    }
    else if (puppums.right == true) {
        puppums.xDir = playerSpeed;
    }
    else {
        puppums.xDir = 0;
    }

    // edge of map x
    if (puppums.x + (puppums.xDir * delta) >= width - puppums.width) {
        puppums.x = width - puppums.width - 1;
        if (puppums.xDir > 0.01)
            puppums.xDir = 0;
    }
    if (puppums.x + (puppums.xDir * delta) <= 0) {
        puppums.x = 1;
        if (puppums.xDir < -0.01)
            puppums.xDir = 0;
    }

    // bottom y collision
    if (puppums.y + (puppums.yDir * delta) < height - puppums.height) {
        if(puppums.space) {
            puppums.jump = true;
            puppums.y = height - puppums.width;
            puppums.yDir = jumpSpeed;
        }
        else {
            // stop player from falling
            puppums.yDir = 0;
            puppums.y = height - puppums.width;
            puppums.jump = false;
        }
    }

    puppums.x = puppums.x + (puppums.xDir * delta);
    puppums.y = puppums.y + (puppums.yDir * delta);
}

// Move into Puppums?
function drawPuppums(puppums) {
    var dogImage;
    if (puppums.left && puppums.yDir == 0) {
        if (puppums.runCount <= 7) {
            dogImage = dogLm[0];
        }
        if (puppums.runCount > 7) {
            dogImage = dogLm[1];
        }
    }
    else if (puppums.right && puppums.yDir == 0) {
        if (puppums.runCount <= 7) {
            dogImage = dogRm[0];
        }
        if (puppums.runCount > 7) {
            dogImage = dogRm[1];
        }
    }
    else {
        if (puppums.facing == LEFT)
            dogImage = dogL;
        else if (puppums.facing == RIGHT)
            dogImage = dogR;

    }
    //console.log("Yo the dog: " + puppums.width +" scaled to: "+ puppums.width*scale + " Attempted subtract: " + ((puppums.width*scale) - puppums.width));
    //console.log("PLZ " + (gameHeight - puppums.yPos - ((puppums.width*scale) - puppums.width)));
    // if(yScale < scale)
    //     ctx.drawImage(dogImage, puppums.xPos * scale, gameHeight * (puppums.yPos/originalHeight) - ((puppums.width*scale) - puppums.width) , puppums.width * scale, puppums.width * scale);
    // else
       ctx.drawImage(dogImage, puppums.x, gameHeight - puppums.y, puppums.width, puppums.width);
}