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
		case 2:

			break;
		case 61: //the dank ctf map
			gameSizes.width = 2300;
			gameSizes.height = 600;

			genPlatform(platforms,0,500,600,10,false,false,true);
			genPlatform(platforms,110,400,290,10,false,false,true);
			genPlatform(platforms,300,200,300,10,false,false,true);
			genPlatform(platforms,300,300,200,10,false,false,true);
			genPlatform(platforms,110,300,40,10);
			genPlatform(platforms,110,250,40,10);
			genPlatform(platforms,110,200,40,10);
			genPlatform(platforms,110,150,40,10);
			genPlatform(platforms,610,200,40,10);
			genPlatform(platforms,610,300,40,10);
			genPlatform(platforms,610,400,40,10);
			genPlatform(platforms,610,500,140,10);
			genWall(walls,platforms,600,200,10,310);
			genWall(walls,platforms,100,0,10,410);
			genWall(walls,platforms,500,300,10,100);
			genStaircase(platforms,750,500,1,10);
			genMirror(platforms,walls, [], gameSizes.width, gameSizes.height);
			break;

		case 62: //jump challenge
			gameSizes.width = 2000;
			gameSizes.height = 4000;

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

		case 63: //free for all 1
			gameSizes.width = 1050;
			gameSizes.height = 1000;

			genWall(walls,platforms,0,850,10,150);
			genPlatform(platforms,200,950,900,10,false,false,true);
			genStaircase(platforms,200,950,-1,10);
			genSniperPostBackless(walls,platforms,0,850,1,100);
			genPlatform(platforms,970,610,100,10);
			genPlatform(platforms,970,660,100,10);
			genPlatform(platforms,970,710,100,10);
			genPlatform(platforms,970,760,100,10);
			genPlatform(platforms,970,810,100,10);
			genPlatform(platforms,970,860,100,10);
			genPlatform(platforms,560,700,350,10,false,false,true);
			genPlatform(platforms,750,900,210,10,false,false,true);
			genPlatform(platforms,920,830,40,10);
			genPlatform(platforms,920,780,40,10);
			genPlatform(platforms,920,730,40,10);
			genPlatform(platforms,130,690,100,10);
			genWall(walls,platforms,960,580,10,330);
			genPlatform(platforms,700,850,210,10,false,false,true);
			genWall(walls,platforms,690,850,10,60);
			genWall(walls,platforms,910,700,10,160);
			genSniperPostBackless(walls,platforms,860,400,-1,100);
			genPlatform(platforms,0,740,20,10);
			genPlatform(platforms,970,500,100,10,false,false,true);
			genPlatform(platforms,870,580,90,10,false,false,true);
			//genWall(walls,platforms,860,565,10,25);
			genWall(walls,platforms,1040,500,10,450);
			genPlatform(platforms,420,500,100,10);
			genPlatform(platforms,300,610,100,10);
			genPlatform(platforms,0,580,100,10);
			genPlatform(platforms,150,500,130,10);
			genPlatform(platforms,0,400,70,10);
		break;

		case 64: //lava map
			gameSizes.width = 1550;
			gameSizes.height = 1100;
			genPlatform(platforms,350,901,30,10,false,true,false,false);
			lava.push(new Lava(0,910,gameSizes.width,200));
			genPlatform(platforms,600,905,10,5,false,false,false,true);
			genPlatform(platforms,130,905,10,5,false,false,false,true);

			for(var i = 0;i<5;i++){
				genSniperPostBackless(walls,platforms,500,300 + i*100,1,100);
			}
			for(var i = 0;i<5;i++){
				genSniperPostBackless(walls,platforms,130,300 + i*100,-1,100);
			}

			genPlatform(platforms,140,900,460,10,false,false,false,true);
			genPlatform(platforms,140,300,460,10,false,false,true,true);
			genPlatform(platforms,350,500,30,10);
			genMirror(platforms, walls, lava, gameSizes.width, gameSizes.height);
			genPlatform(platforms,675,300,26,10,true,false,false);

		break;

		case 65: //duel map
			gameSizes.width = 800;
			gameSizes.height = 600;
			genPlatform(platforms,50,400,700,10,false,false,true);
			/*genPlatform(platforms,100,410,600,10);
			genPlatform(platforms,150,420,500,10);
			genPlatform(platforms,200,430,400,10);
			genPlatform(platforms,250,440,300,10);
			genPlatform(platforms,300,450,200,10);
			genPlatform(platforms,350,460,100,10);*/
			//genPlatform(platforms,450,470,50,10);
			lava.push(new Lava(0,500,gameSizes.width,100));

		break;
		case 66: //1v1 ffa fire small map
			gameSizes.width = 800;
			gameSizes.height = 600;

			//right and left floor
			genPlatform(platforms,0,550,100,10,false,false,true);//solid
			genPlatform(platforms,0,560,100,40,false,false,true);
			genPlatform(platforms,700,550,100,10,false,false,true);
			genPlatform(platforms,700,560,100,40,false,false,true);

			//middle moving floor
			genPlatform(platforms,200,550,200,10,true);

			//middle stationary floaters
			genPlatform(platforms,100,440,140,10);
			genPlatform(platforms,540,440,140,10);
			genPlatform(platforms,330,340,140,10);

			//genPlatform(platforms,450,470,50,10);
			lava.push(new Lava(100,560,600,50));

		break;
		case 67: //1v1 basic small map
			gameSizes.width = 800;
			gameSizes.height = 600;

			//floor base
			genPlatform(platforms,0,570,gameSizes.width,10,false,false,true);
			genPlatform(platforms,0,580,gameSizes.width,20,false,false,true);//everything down 70

			//up and down on right and left
			//genPlatform(platforms,140,500,140,10,false,true);
			//genPlatform(platforms,520,500,140,10,false,true);
			genPlatform(platforms,180,410,240,10,true);

			//middles
			genPlatform(platforms,160,290,180,10);
			//genPlatform(platforms,300,400,200,10);

			//left and right bunks
			genPlatform(platforms,0,350,60,10);
			genPlatform(platforms,0,470,60,10);
			genPlatform(platforms,740,350,100,10);
			genPlatform(platforms,740,470,100,10);

			//top right
			genPlatform(platforms,520,230,280,10);
		break;
		case 68:
			/* map has 3 basic levels:
				1 - floor(2000-3000)
					- 3 entrances, from mineshaft, spawning, or middle of the map
				2 - underground(1000-2000)
				3 - aboveground+castles(0-1000)
			*/
			var width = 5000, height = 3000;

			var mapData = {
				lowGrav: {
					x0: [2000, width-2040],
					xf: [2030, width-2010],
					y0: [1000, 1000],
					yf: [2915, 2915],
					fallSpeed: -500
				}
			}

			gameSizes.width = width;
			gameSizes.height = height;

			// ------------- 	ROOF 	-------------
			_w(0, 0, 2500, 1);

			// ------------- FLOOR TIER -------------
			buildFloor = function() {
				_p(0, height-11, width/2, 10);
				// mineshaft elevator
				_p(0, height, 26, 10, false, true, false);
				// mineshaft wall - 4 exits
				for (var i = 0; i < 4; i++){
					y0 = 1000+i*500;
					_w(65, y0, 10, 425);
					// minshaft ladder wall
					_w(105, y0, 10, 425);
					_p(75, y0, 30, 10);
					for (var j = 0; j < 4; j++) {
						_p(75, y0+60+j*110, 5, 2);
					}
				}

				// ceiling
				_w(115, 2915, 1925, 10);

				_s(106, 2500, 1, 42);
			}
			// ------------- UNDERGROUND -------------



			// ------------- CASTLE TIER -------------
			buildCastlePlane = function() {
				// GROUND - from elevator to the end of the castle
				_p(65, 1000, 1425, 10);

				// LAVA TRENCH - end of castle to max jump length
				_w(1490, 1000, 10,  150); // left side
				_w(1500, 1140, 240, 10); // floor
				_w(1740, 1000, 10,  150); // right side
				genLava(lava, 1500, 1100, 240, 50);

				// mid ground
				_w(1750, 1000, 220, 10);
				_w(2030, 1000, 500, 10);

				// hole through mid
				_w(1960, 1000, 10, 1800);
				_w(2030, 1000, 10, 1915);
				//_p(2000, 2915, 30, 10, false, true, false);
			}

			buildCastle = function() {
				// CASTLE - 700 wide, 500 tall
				// 			begins at x=800, ends at x=1500

				// left wall, with platforms to climb
				_w(800, 500, 20, 450);
				// ladder on left wall
				for (var i = 0; i < 4; i++) {
					_p(785, 500+i*122, 15, 10);
				}

				// right wall
				_w(1480, 500, 20, 245); // super secret hole in the wall
				_w(1480, 780, 20, 200);
				_w(1480, 990, 20, 20);

				// super secret tunnel to roof
				_w(1420, 500, 10, 290);
				_w(1430, 780, 50, 10);

				// ceiling, can get up via left of castle or from inside, only one small exit onto the roof
				_p(820, 500, 50,  10);
				_w(870, 500, 560, 10);
				// super secret entrance to roof
				_p(1430, 500, 50, 10);
				_p(1430 ,640, 10 ,10);

				_w(1340, 910, 15, 90);
				_p(820, 865, 465, 10);
				_p(1360, 760, 60, 10);

				_p(1150, 670, 40, 10);
				_p(940, 610, 55, 10);

				_p(820, 570, 40, 10);
				_p(1325, 910, 15, 5);

				buildTower();
			}

			buildTower = function() {
				// builds the basic flag tower
				_w(1410, 150, 10, 350);
				_w(1330, 100, 10, 340);
				_w(1420, 0, 10, 110);

				_p(1420, 370, 5, 10);
				_p(1420, 270, 5, 10);
				_w(1375, 150, 40, 10);
				// platform to the top
				_p(1340, 150, 70, 10);
				_w(1375, 110, 10, 40);
				// floor of the roof
				_p(1330, 100, 90, 10);
				for (var i = 0; i < 2; i++) {
					_p(1405, 150+i*200, 5, 10);
					_p(1340, 250+i*180, 5, 10);
				}
			}

			buildFloor();
			buildCastlePlane();
			buildCastle();

			genMirror(platforms, walls, lava, width, height);

			return mapData;
		break;

		case 69: //ffa map
			gameSizes.width = 1500;
			gameSizes.height = 900;

			var bottomPortal = {
				entrance: {
					x: 670,
					y: 850,
					w: 160,
					h: 50
				},
				exit: {
					x: gameSizes.width/2,
					y: 0
				}
			}
			var mapData = {
				portals: [bottomPortal]
			}

			genPlatform(platforms,0,300,150,10);

			//lava pit
			genPlatform(platforms,500,500,100,10);
			genWall(walls,platforms,300,500,10,210);
			genWall(walls,platforms,500,500,10,150);
			genPlatform(platforms,310,700,210,10,false,false,true);
			genLava(lava,310,550,190,150);
			genPlatform(platforms,200,500,100,10);

			genPlatform(platforms,0,700,80,10);
			genPlatform(platforms,0,800,gameSizes.width/2 - 80,10,false,false,true);
			genLava(lava,0,810,gameSizes.width/2 - 90,500);
			genPlatform(platforms,110,600,50,10);
			genPlatform(platforms,0,500,60,10);
			genPlatform(platforms,0,400,60,10);
			genLava(lava,500,650,310-100,50);
			genPlatform(platforms,505,700,310-100,10,false,false,true);
			genPlatform(platforms,500,640,50,10,false,false,true);
			genPlatform(platforms,500,570,20,10);
			//genPlatform(platforms,400,740,70,10);
			//genPlatform(platforms,600,770,50,10);
			genPlatform(platforms,300,300,180,10);
			genPlatform(platforms,600,400,100,10);
			genWall(walls,platforms,gameSizes.width/2- 90,800,10,500);
			genWall(walls,platforms,gameSizes.width/2- 40,640,10,70);
			genPlatform(platforms,671,640,40,10,false,false,true);
			genMirror(platforms,walls,lava,gameSizes.width,gameSizes.height);
			genPlatform(platforms,625,250,250,10);
			genPlatform(platforms,700,500,100,10);
			genPlatform(platforms,720,700,60,10);
			genPlatform(platforms,735,760,30,10);
		break;

		case 70: //simple randomly generated map
			gameSizes.width = 800;
			gameSizes.height = 600;

			//generate half the platforms on the left, half on the right a=0 for right a=1 for left
			for(var a = 0; a <= 1; a++){

				//starting number of platforms per side
				var r = Math.floor((Math.random() * 2) + 3);

				//generate platforms
				for(var i = 0; i < r; i++){
					//platform position
					var w = Math.floor((Math.random() * 150) + 20);
					var h = 10;
					var x = Math.floor((Math.random() * gameSizes.width/2) + gameSizes.width/2*a);
					var y = Math.floor((Math.random() * gameSizes.height) + 300);

					//generate the platform
					genPlatform(platforms,x,y,w,h,false,false,false);
				}
			}
			for(var t = 0; t< platforms.length;t++){
				if(platforms[t].y < gameSizes.height-110){
					w = Math.floor((Math.random() * 130) + 40);
					var x2 = Math.floor((Math.random() * 300) + platforms[t].x - 150);
					var y2 = Math.floor((Math.random() * 50) + platforms[t].y + 60);
					genPlatform(platforms,x2,y2,w,h,false,false,false);

				}
			}
			for(var t = 0; t< platforms.length;t++){
				for(var i = 0; i< platforms.length;i++){
					if(platforms[t].y + platforms[t].height > platforms[i].y &&
		            platforms[t].y < platforms[i].y + platforms[i].height &&
		            platforms[t].x + platforms[t].width  > platforms[i].x &&
		            platforms[t].x < platforms[i].x + platforms[i].width &&
					t!= i){
 						platforms.splice(t,1);
 						i=0;
 						t=0;
					}
				}
			}

		break;

		case 71: //simple randomly generated mirror map
			gameSizes.width = 1600;
			gameSizes.height = 600;
			if (mode == CTF) {
				flags.push(new Flag(30,550, 0));
	            flags.push(new Flag(1570, 550, 1));
        	}

			genMirror(platforms,walls,lava,gameSizes.width,gameSizes.height);

		break;

		case 72: //ffa
			gameSizes.width = 1500;//3000
			gameSizes.height = 1100;

			_w(100,400,10,250);
			_w(100,750,10,500);
			_p(0,750,400,10);
			_p(100,400,300,10);
			_w(400,400,10,250);
			_w(400,750,10,400);

			_w(500,450,10,300);
			_p(490,850,30,10);
			_p(410,750,10,10);
			_p(490,650,10,10);
			_p(410,550,10,10);
			_p(490,450,10,10);

			_w(500,850,10,400);
			_p(500,450,300,10);
			_w(800,450,10,50);
			_w(800,600,10,800);
			_p(790,600,30,10);

			_w(950,500,10,100);
			_w(950,700,10,400);
			_p(950,400,250,10);
			_p(940,500,30,10);
			_w(1250,300,10,205);//410
			_w(1250,605,10,105)
			_p(1450,300,50,10);
			_p(1160,300,90,10,false,false,false);
			_w(1150,300,10,40);
			_p(0,300,100,10);
			_w(950,400,10,20);
			_p(650,720,30,10);
			_w(660,720,10,400);


			_p(1240,450,30,10);
			_p(1240,500,30,10);
			//_p(1240,550,30,10);
			_p(1240,600,30,10);
			//_p(1240,650,30,10);
			_p(1240,700,30,10);
			_p(1260,400,10,10);
			_p(1260,350,10,10);


			_p(800,200,250,10);
			_p(600,300,100,10);
			_p(940,700,30,10);
			_p(1100,800,400,10);

			_p(90,640,10,10);
			_p(90,540,10,10);

			_p(90,440,10,10);

			//genMirror(platforms,walls,lava, gameSizes.width, gameSizes.height);
			genLava(lava,0,1050,1000,200);
			genLava(lava,1000,1050,1000,200);
			genLava(lava,2000,1050,1000,200);

		break;

		case 73:
			gameSizes.width = 3000;
			gameSizes.height = 800;
			var move = 1500;

			_p(950,400,250,10,false,false,true);
			_p(1200,400,150,10);
			_w(1350,400,10,60);
			_w(1450,400,10,60);
			_p(1460,450,40,10,false,false,true);
			_p(1460,400,40,10,false,false,true);
			_p(1300,450,50,10,false,false,true);
			_p(1360,290,40,10);
			_p(1360,190,40,10);
			_p(1200,600,100,10);
			_p(1300,700,200,10);
			_p(1100,500,100,10);
			_w(1100,500,10,60);
			_p(900,550,200,10);
			_w(1000,450,10,60);
			_p(1300,500,200,10);
			_p(1000,450,100,10);
			_p(850,500,150,10,false,false,true);
			_w(900,550,10,50);
			_p(820,600,90,10,false,false,true);
			_w(810,600,10,160);
			_p(800,600,10,10);
			_p(800,650,10,10);
			_p(800,700,10,10);
			_p(800,750,10,10);
			_p(600,200,700,10);
			_w(600,200,10,100);
			_w(600,400,10,100);
			_w(600,600,10,100);
			_p(610,690,90,10);
			_p(610,490,90,10);
			_p(610,290,90,10);
			_p(600,600,140,10);
			_p(600,400,140,10);
			_p(600,200,140,10);
			_p(800,300,200,10);
			_w(1300,100,10,110);
			_p(1310,100,90,10);
			_w(1400,100,10,200);

			for(var i = 0; i < platforms.length;i++){
				platforms[i].x += move;
			}
			for(var i = 0; i < walls.length;i++){
				walls[i].x += move;
			}

			_w(0,100,10,1000);
			_p(600,750,100,10);
			_p(0,790,1100,10,false,false,true);
			genLava(lava,1100,790,400,10);

			_p(1100,690,200,10);
			_p(1300,590,100,10);
			_p(1250,415,100,10);
			_p(1000,470,100,10);

			genMirror(platforms,walls,lava, gameSizes.width, gameSizes.height);
			_p(1400,540,200,10);

			_p(1450,300,100,10);
		break;

		case 74:
			gameSizes.width = 3000;
			gameSizes.height = 800;
			var move = 1500;

			_p(950,400,250,10,false,false,true);
			_p(1200,400,150,10);
			_w(1350,400,10,60);
			_w(1450,400,10,60);
			_p(1460,450,40,10,false,false,true);
			_p(1460,400,40,10,false,false,true);
			_p(1300,450,50,10,false,false,true);
			_p(1360,290,40,10);
			_p(1360,190,40,10);
			_p(1200,600,100,10);
			_p(1300,700,200,10);
			_p(1100,500,100,10);
			_w(1100,500,10,60);
			_p(900,550,200,10);
			_w(1000,450,10,60);
			_p(1300,500,200,10);
			_p(1000,450,100,10);
			_p(850,500,150,10,false,false,true);
			_w(900,550,10,50);
			_p(820,600,90,10,false,false,true);
			_w(810,600,10,160);
			_p(800,600,10,10);
			_p(800,650,10,10);
			_p(800,700,10,10);
			_p(800,750,10,10);
			_p(600,200,700,10);
			_w(600,200,10,100);
			_w(600,400,10,100);
			_w(600,600,10,100);
			_p(610,690,90,10);
			_p(610,490,90,10);
			_p(610,290,90,10);
			_p(600,600,140,10);
			_p(600,400,140,10);
			_p(600,200,140,10);
			_p(800,300,200,10);
			_w(1300,100,10,110);
			_p(1310,100,90,10);
			_w(1400,100,10,200);

			for(var i = 0; i < platforms.length;i++){
				platforms[i].x += move;
			}
			for(var i = 0; i < walls.length;i++){
				walls[i].x += move;
			}

			_w(0,100,10,1000);
			_p(600,750,100,10);
			_p(0,790,1100,10,false,false,true);
			genLava(lava,1100,790,400,10);

			_p(1100,690,200,10);
			_p(1300,590,100,10);
			_p(1250,415,100,10);
			_p(1000,470,100,10);

			genMirror(platforms,walls,lava, gameSizes.width, gameSizes.height);
			gameSizes.width = 1500;
			_p(1400,540,200,10);

			_p(1450,300,100,10);
		break;

		case 75:
			gameSizes.width = 4001;
			gameSizes.height = 1300;

        	var lowGravZone1 = {
        		x: 960,
        		y: 200,
        		w: gameSizes.width - 960*2,
        		h: gameSizes.height - 200,
        		fallSpeed: 500
        	}
        	var lowGravZone2 = {
        		x: 700,
        		y: 0,
        		w: gameSizes.width - 700*2,
        		h: 200,
        		fallSpeed: 500        		
        	}
    		var mapData = {
    			lowGrav: [lowGravZone1, lowGravZone2],
    			genForeground: true
    		}
			_p(0,gameSizes.height-10,3000,10,false,false,true);
			//base
			_w(100,700,10,210);
			_w(900,700,10,210);
			genRoom(walls, platforms, 100, 400, 900, 700, true, true);
			_p(110,400,80,10,false,false,true);
			_p(300,400,600,10,false,false,true);
			_w(500,500,10,140);
			_w(190,500,10,60);
			_p(200,500,300,10,false,false,true);
			_p(200,550,250,10,false,false,true);
			_p(450,630,50,10,false,false,true);
			_w(440,550,10,90);
			_p(590,630,230,10,false,false,true);
			_p(590,580,230,10,false,false,true);
			_w(580,580,10,60);
			_w(820,580,10,60);
			for(var i=0;i<10;i++){
				_p(80*(i%2),400+i*100,20,10);
			}
			_p(0,300,20,10);
			
			for(var i=0;i<6;i++){
				_p(910,400+i*100,50,10);
			}
			_p(110,700,100,10);
			_p(200,900,100,10);
			_p(500,900,100,10);
			_p(350,800,100,10);
			_p(200,700,100,10);
			_p(500,700,400,10);
			_p(110,1200,850,10,false,false,true);
			_w(100,1000,10,210);
			_p(200,1100,200,10);
			_p(700,1100,260,10);
			_p(400,1000,300,10);
			_w(400,1000,10,110);
			_p(110,1000,20,10);
			_p(0,200,500,10,false,false,false);

			//middle
			_p(1200,500,200,10);
			_p(1400,700,200,10);
			_p(1901,300,100,10);
			_p(1700,1000,200,10);
			_p(1780,600,150,10);
			_p(1200,950,300,10);
			_p(1300,1200,250,10);
			_p(1801,800,200,10);
			genMirror(platforms,walls,lava,gameSizes.width,gameSizes.height);
			return mapData;
		break;


		case 76:
			gameSizes.width = 1000;
			gameSizes.height = 1500;

			_p(110,500,340,10,false,false,true);
			_p(560,500,240,10,false,false,true);
			_w(100,500,10,110);
			_p(110,600,100,10,false,false,true);
			_w(200,500,10,110);
			_w(550,500,10,110);
			_w(800,500,10,110);
			_p(560,600,240,10,false,false,true);
			_p(450,500,100,10);
			_p(910,500,100,10,false,false,true)
			_w(900,500,10,110);
			_p(910,600,100,10,false,false,true);
			_p(550,300,350,10);
			_p(450,390,100,10);
			_p(0,300,100,10);
			_p(150,200,100,10);
			_p(900,390,100,10);
        	var reverseGrav = {
        		x: 0,
        		y: 500,
        		w: 1000,
        		h: 2000,
        		fallSpeed: -2500
        	}       	
        	genLava(lava,0,700,1000,600);
    		var mapData = {
    			lowGrav: [reverseGrav]
    		}
			return mapData;
		break;


		case 78:
			gameSizes.width = 1200;
			gameSizes.height = 3000;
			_p(40, 2880, 10, 10);
			_p(170, 2820, 10, 10);
			_p(320, 2820, 10, 10);
			_p(360, 2680, 10, 10);
			_p(410, 2760, 10, 10);
			_p(510, 2580, 10, 10);
			_p(750, 2570, 10, 10);
			_p(920, 2620, 10, 10);
			_p(1180, 2620, 10, 10);
			_p(1160, 2470, 10, 10);
			_p(1180, 2540, 10, 10);
			_p(990, 2380, 10, 10);
			_p(1110, 2210, 10, 10);
			_p(870, 2240, 10, 10);
			_p(790, 2270, 10, 10);
			_p(1150, 2080, 10, 10);
			_p(950, 2000, 10, 10);
			_p(710, 1990, 10, 10);
			_p(490, 1980, 10, 10);
			_p(300, 1970, 10, 10);
			_p(0, 1960, 140, 10);
			_p(110, 1790, 10, 10);
			_p(40, 1860, 10, 10);
			_p(280, 1740, 10, 10);
			_p(180, 1610, 10, 10);
			_p(420, 1580, 10, 10);
			_p(330, 1430, 10, 10);
			_p(590, 1380, 10, 10);
			_p(420, 1480, 10, 10);
			_p(780, 1320, 10, 10);
			_p(450, 1290, 10, 10);
			break;
		case 77: //Rhys' mirror nest
			gameSizes.width = 1000;
			gameSizes.height = 800;

			//_p(x, y, width, height, horizontal moving(boolean), vertical moving(boolean), solid(boolean))

			genSniperPostBackless(walls,platforms,0,500,1,100);

			_p(0, 700, 109, 10,false,false,true);
			_w(100, 700, 10, 100);

			_p(250, 700, 150, 10);
			_p(100, 500, 120, 10);

			genMirror(platforms,walls,lava,gameSizes.width,gameSizes.height);

			_p(350, 600, 300, 10);
			_p(300,400,200,10,true,false,false);
		break;

		case 79: // "Beach Assault" CTF map
			gameSizes.width = 3500; // it's really fucking long
			gameSizes.height = 800;

			_p(50,   450, 140,  10, false, false, true);
			_w(190, 450, 10,   300); // wall from left side of base to floor
			_p(260, 500, 485,  10, false, false, true); // mid level plat
			_w(740, 500, 10,   210); // +10
			_p(750, 700, 1875, 10, false, false, true); // sea floor

			_p(320, 700, 430, 10, false, false, true);
			_p(260, 700, 60, 10);
			_w(250, 500, 10, 40);
			// _p(260, 550, 80, 10, false, false, true);
			_p(260, 630, 80, 10);
			_w(250, 630, 10, 80);
			_w(410, 510, 10, 110);
			_p(420, 610, 270, 10, false, false, true);
			_p(420, 545, 40, 10);
			_w(50, 450, 10, 300);
			_p(60, 740, 130, 10, false, false, true);

			genMirror(platforms, walls, lava, gameSizes.width, gameSizes.height);

			var helicopter1 = {
				velocity: 500,
				travelDistance: 3400
			};
			var helicopter2 = {
				velocity: -500,
				travelDistance: 3400
			};
			var boat = {
				velocity: 225,
				travelDistance: 1650
			};
			var boat2 = {
				velocity: -225,
				travelDistance: 1650
			}
			// helicopters
			_p(50,  250,  70,  3, true, false, false, false, helicopter1);
			_p(gameSizes.width - 50 - 70, 240, 70, 3, true, false, false, false, helicopter2);
			// boats
			_p(750, 525, 350, 10, true, false, false, false, boat);
			_p(gameSizes.width - 750 - 350, 590, 350, 10, true, false, false, false, boat2);
			// _p(3300, 300, 26, 3, true, false, false, false, helicopter2)

			var reverseGrav1 = {
        		x: 200,
        		y: 450,
        		w: 50,
        		h: 450,
        		fallSpeed: -2500
        	};
        	// model for genMirror to copy low grav zones
        	var reverseGrav2 = {
        		x: gameSizes.width - reverseGrav1.x - reverseGrav1.w,
        		y: reverseGrav1.y,
        		w: reverseGrav1.w,
        		h: reverseGrav1.h,
        		fallSpeed: reverseGrav1.fallSpeed
        	};
        	var mapData = {
        		lowGrav: [reverseGrav1, reverseGrav2]
        	};

			genLava(lava, 750, 	650, 1000, 50);
			genLava(lava, 1750, 650, 1000, 50);
			// genLava(lava, 2750, 650, 1000, 50);

			return mapData;
		break;

		return null;
	}
	// plat: 	platforms 	x 	y 	width 	height 	[hori	vert 	isSolid 	[partOfWall]]   (for when I forget how to make platforms lol)
	// wall: 	walls 	platforms 	x 	y 	w 	h
}
