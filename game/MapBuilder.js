/* 

This class contains the map building methods
(level is passed in and it changes the platforms/walls accordingly)

*/

/* 
***************
HOW TO ADD A MAP::

ADD your map name to the array below (similair index)
ADD your map to the switch in loadmap
** Be sure to give a width/height and an end point

profit!

*/

var mapNames = [ 
	'What is Jumping?', // 0 
	'Unnamed', // 1 
];


/*gen methods:

----generate rooms, structures, etc.
genStaircase(platforms, xTop, yTop, facing(-1 or 1), # of steps)
genSniperPost(walls, platforms, xLeft, yTop, facing(-1 or 1), size(best at 80 to 150))
genRoom(walls, platforms, x1, y1, x2, y2, doorLeft(boolean), doorRight(boolean))

----basic objects
genPlatform(platforms, x, y, width, height, horizontal moving(boolean), vertical moving(boolean), solid(boolean))
genWall(walls, x, y, width, height)

----useful methods
genMirror(platforms, walls, lava)

*/

genStaircase = function (platforms,x,y,horz,steps){
	for(var i = 0; i < steps; i++){
		platforms.push(new Platform(x+i*horz*10,y+i*10,20,10,false,false,true,true));
	}
}

genSniperPost = function (walls,platforms,x,y,facing,size){
	//genPlatform(platforms,x+10,y,size-10,10,false,false,true);
	if(facing == 1){


		genPlatform(platforms,x+size/4*3,y+size,size/4,10,false,false,true);
		genWall(walls,platforms,x+size,y,10,size-25);
		genWall(walls,platforms,x+size,y+size-15,10,25);
		genWall(walls,platforms,x,y,10,size+10);
		genPlatform(platforms,x+size-20,y+size-40,20,10);
		genPlatform(platforms,x+size/2,y,size/2,10,false,false,true);
		genPlatform(platforms,x,y,size/2,10);

	}
	else if(facing == -1){
		genPlatform(platforms,x+10,y+size,size/4,10,false,false,true);
		genWall(walls,platforms,x,y,10,size-25);
		genWall(walls,platforms,x,y+size-15,10,25);
		genWall(walls,platforms,x+size,y,10,size+10);
		genPlatform(platforms,x+10,y+size-40,20,10);
		genPlatform(platforms,x+10,y,size/2,10,false,false,true);
		genPlatform(platforms,x+size/2,y,size/2,10);
	}
}
genSniperPostBackless = function (walls,platforms,x,y,facing,size){
	//genPlatform(platforms,x+10,y,size-10,10,false,false,true);
	if(facing == 1){

		genPlatform(platforms,x+(size/5)*4,y+size,size/5,10,false,false,false);
		genWall(walls,platforms,x+size,y,10,size-25);
		genWall(walls,platforms,x+size,y+size-15,10,25);
		//genWall(walls,platforms,x,y,10,size+10);
		//genPlatform(platforms,x+size-20,y+size-40,20,10);
		genPlatform(platforms,x+size/2,y,size/2,10,false,false,false);
		genPlatform(platforms,x,y,size/2,10);

	}
	else if(facing == -1){
		genPlatform(platforms,x+10,y+size,size/5,10,false,false,false);
		genWall(walls,platforms,x,y,10,size-25);
		genWall(walls,platforms,x,y+size-15,10,25);
		//genWall(walls,platforms,x+size,y,10,size+10);
		//genPlatform(platforms,x+10,y+size-40,20,10);
		genPlatform(platforms,x+10,y,size/2,10,false,false,false);
		genPlatform(platforms,x+size/2,y,size/2,10);
	}
}

genWall = function (walls,platforms,x,y,w,h){
	//x-=2;
	//w += 5;
	walls.push(new Wall(x,y+1,w,h-1));
	platforms.push(new Platform(x+1,y,w-2,10-1,false,false,true));
	// better ceiling - should block jumping better
	if (h > 30 && w < 30) { // check if it is a side wall
		platforms.push(new Platform(x+1, y+1+h-30, w-2, 10, false, false, true, true));
	}
}

genDiamond = function(platforms,x,y,size,horz,vert){
	for(var i = 0; i < size; i++){
		platforms.push(new Platform(x+i*10,           y+i*10,         20, 10, horz, vert));
		platforms.push(new Platform(x+i*10+(size*10), y+i*10-size*10, 20, 10, horz, vert));

		platforms.push(new Platform(x+i*-10+(10*size),           y+i*10-size*10, 20, 10, horz, vert));
		platforms.push(new Platform(x+i*-10+(20*size), y+i*10, 20, 10, horz, vert));
	}
}

genLava = function(lava, x, y, w, h) {
	lava.push(new Lava(x, y, w, h));
}

genPlatform = function(platforms,x,y,w,h,horz,vert,solid,partOfWall,xMovingPlat,yMovingPlat){
	platforms.push(new Platform(x,y,w,h,horz,vert,solid,partOfWall,xMovingPlat,yMovingPlat));
}

genRoom = function(walls, platforms, x1, y1, x2, y2, doorLeft, doorRight){
	if(doorLeft){
		genWall(walls,platforms,x1,y1,10,y2-y1-60);
		//genPlatform(platforms,x1-10,y2-50,10,10,false,false,true);
		//genPlatform(platforms,x1-10,y2,10,10,false,false,true);
	}
	else
		genWall(walls,platforms,x1,y1,10,y2-y1);
	if(doorRight){
		genWall(walls,platforms,x2,y1,10,y2-y1-60);
	}
	else
		genWall(walls,platforms,x2,y1,10,y2-y1);

	//genPlatform(platforms,x1+10,y1,x2-x1-10,10,false,false,true);
	//genPlatform(platforms,x1,y2,x2-x1+10,10,false,false,true);
}


genMirror = function(platforms,walls,lava, gameWidth, gameHeight){
	var newPlatforms = [];
	var newWalls = [];
	var newLava = [];
	for(var i = 0; i < platforms.length; i++){
		genPlatform(newPlatforms, gameWidth-platforms[i].x-platforms[i].width, platforms[i].y, platforms[i].width, platforms[i].height, platforms[i].horz, platforms[i].vert, platforms[i].solid,platforms[i].partOfWall);
	}
	for(var i = 0; i < walls.length; i++){
		genWall(newWalls, newPlatforms, gameWidth-walls[i].x-walls[i].width, walls[i].y, walls[i].width, walls[i].height);
	}
	if(lava != undefined) {
		for(var i = 0; i < lava.length; i++) {
			genLava(newLava, gameWidth - lava[i].x - lava[i].width, lava[i].y, lava[i].width, lava[i].height);
		}
	}


	for(var i = 0; i < newPlatforms.length; i++){
		platforms.push(newPlatforms[i]);
	}
	for(var i = 0; i < newWalls.length; i++){
		walls.push(newWalls[i]);
	}
	for (var i = 0; i < newLava.length; i++){
		lava.push(newLava[i]);
	}
}

//loads a specific map based on the ID passed (should it also load in game modes?)
loadMap = function(mapID, walls, platforms, lava, gameSizes, cakeLocation) {//, gameWidth, gameHeight) {
	/* Since we make so many calls to genPlatform and genWall, i decided to
	abstract them a bit.
		Example usage - to build a platform, all you need to call is:
			_p(x, y, w, h)

		All the optionals still work when you bind the functions in this way. */


	console.log('MapBuilder: Loading map: ' + mapID);

	var _p = genPlatform.bind(null, platforms);
	var _w = genWall.bind(null, walls, platforms);
	var _s = genStaircase.bind(null, platforms);

	switch(mapNames[mapID]) {
		case 'What is Jumping?': // What is jumping?
			gameSizes.width = 2000;
			gameSizes.height = 4000;

			// console.log('Loading 1');
			cakeLocation.x = 116;
			cakeLocation.y = 1660;


			genWall(walls,platforms,100,0,10,3900);

			genDiamond(platforms,150,700 + 3100,10,false,false);
			genDiamond(platforms,500,500 + 3100,10,false,false);
			genDiamond(platforms,650,400 + 3100,15,true,true);
			genPlatform(platforms,380,500 + 3100,20,10,false,false);
			genStaircase(platforms,1450,500 + 2000,-1,50);
			genPlatform(platforms,950,1050+ 2000,10,10);
			genPlatform(platforms,1000,1130+ 2000,10,10);
			genPlatform(platforms,1200,500+ 2000,200,10);
			genPlatform(platforms,1000,500+ 2000,30,10);
			genPlatform(platforms,800,400+ 2000,30,10);
			genPlatform(platforms,700,300+ 2000,30,10);
			genPlatform(platforms,700,200+2000,30,10);
			genDiamond(platforms,400,100+ 2000,10,false,false);
			genDiamond(platforms,120,100+ 2000,10,false,false);
			genPlatform(platforms,110,2000,10,10,false,false);
			genPlatform(platforms,110,1900,10,10,false,false);
			genPlatform(platforms,110,1800,10,10,false,false);
			genPlatform(platforms,110,1700,10,10,false,false);
			break;
		case 'Unnamed':

			gameSizes.width = 2300;
			gameSizes.height = 600;

			cakeLocation.x = 210;
			cakeLocation.y = 400;

			break;
	}

	// RETURN something else for mapdata in the switch if not null
	return null;
	// plat: 	platforms 	x 	y 	width 	height 	[hori	vert 	isSolid 	[partOfWall]]   (for when I forget how to make platforms lol)
	// wall: 	walls 	platforms 	x 	y 	w 	h
}
