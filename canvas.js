var canvas; //main canvas being draw to
var ctx;	// context, used to draw on canvas
var canvas_size; // passed from html code for size of drawing canvas
var fk_canvas; // fk canvas used for click detection in objects, never displayed
var fk_ctx;
var perm_canvas; // permanent canvas and only drawn once, ie game board
var perm_ctx;
var menu_canvas; // used to draw the menu
var menu_ctx;
var refresh = 20;// redraw interval
var canvasValid = false; // handler for if the canvas needs to be redrawn
var dispMenuHandler = false; // handler to display menu object
var intervalHandler; // handler for interval and auto run of draw function
var Cells = []; // 2d array of position and number in each cell
var mySel = 0; // copy of cell element to draw
var selColor =  "#FFFF00"; //color cell turns when it is clicked on
var selWidth = 5; // width of boarder around cell when clicked
var mx, my; //mouse coords 
var offsetx, offsety; // used to set correct coords for canvas taking into account where the canvas is drawn on the screen
var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop; // more offset variables 
var menu = new Menu(); // menu object that holds data about position
function init(cSize){
	canvas_size = cSize;
	canvas = document.getElementById("myCanvas"); // grabs canvas from html 
	ctx = canvas.getContext("2d"); // ties the canvas to a context used to draw to the canvas
	fk_canvas = document.getElementById("colorCanvas"); //same as above but for differing canvases ditto below
	fk_ctx = fk_canvas.getContext("2d"); // '' 
	perm_canvas = document.getElementById("permCanvas");// '' 
	perm_ctx = perm_canvas.getContext("2d");
	menu_canvas = document.getElementById("menuCanvas");
	menu_ctx = menu_canvas.getContext("2d");
	drawGrids(); // draws the game board once to the perm_canvas
	try{
	createCells(); // fills cells with starting data of position, fill number, size
	}catch(err){alert(err);}
	intervalHandler = setInterval(draw, refresh); // sets an interval to run draw automatically
	
	if (document.defaultView && document.defaultView.getComputedStyle) { // gets info about html code and how much to offset
		stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
		stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
		styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
		styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
	}
	canvas.onmousedown = mDown; // detects mouse down on top most canvas
	//canvas.onmouseup = mUp;
	//canvas.ondblclick = mDblClick;
} 
function draw(){ // all calls to draw on main canvas
	if(canvasValid === false){ // asks if canvas needs to be redrawn
		ctx.clearRect(0,0,canvas_size, canvas_size); // clears the canvas from previous draw
		try{
		drawStuffInCells(); // draws the numbers in each cell
		}catch(err){alert(err);}
		if(dispMenuHandler){ // asks if need to display menu
			drawMenu();
		}
		if (mySel !== 0) { // if there is a selection, highlight cell 
			//needs to be turned into its own function.........................
			ctx.strokeStyle = selColor; 
			ctx.lineWidth = selWidth;
			ctx.strokeRect(mySel.x,mySel.y,mySel.size,mySel.size); // draws boarder around selected cell
		}
		canvasValid = true; // canvas is now up to date
	}
}
function invalidate(){ // canvas is no longer uptodate, needs to be redrawn
	canvasValid = false;
}
function drawGrids(){ // draws the background grids for the board
	perm_ctx.strokeStyle = 'black'; // color of grids
	for(var i = 1; i < 9; i++){
		perm_ctx.beginPath(); //new set of lines to be drawn
		if(i%3 === 0){ //big lines
			perm_ctx.lineWidth = 5;
			perm_ctx.moveTo((canvas_size/9)*i,0); //starting point of horizontal line
			perm_ctx.lineTo((canvas_size/9)*i,canvas_size);//ending point of horizontal line
			perm_ctx.moveTo(0,(canvas_size/9)*i);	//starting point of vertical line
			perm_ctx.lineTo(canvas_size,(canvas_size/9)*i); // ending point of vertical line
		}else{//narrow lines
			perm_ctx.lineWidth = 1;
			perm_ctx.moveTo((canvas_size/9)*i,0); 
			perm_ctx.lineTo((canvas_size/9)*i,canvas_size);
			perm_ctx.moveTo(0,(canvas_size/9)*i);
			perm_ctx.lineTo(canvas_size,(canvas_size/9)*i);
		}
		perm_ctx.stroke(); // draw line on per canvas
	}
}
function Cell(){ // create type Cell
	this.x = 0; // where to draw on canvas 
	this.y = 0;
	this.size = canvas_size/9;
	this.fill = '#444444'; // dont really have a use for this..
	this.num = ' '; // what goes into the cell
	this.numbers = []; // array of bool to show in menu, not used yet
}
function Menu(i,j,x,y){ // menu type
	this.i; // cell row
	this.j; // column
	this.x; // position x
	this.y; // y
}
function drawMenu(){ // draws menu on menu canvas
	ctx.fillStyle = 'red'; // what color the menu is
	ctx.fillRect(Cells[menu.i][menu.j].x,Cells[menu.i][menu.j].y,(canvas_size/9),(canvas_size/9)); //draw menu using cell and menu info
	ctx.stroke();
	ctx.font="14px Georgia";
	ctx.fillStyle = 'white';
	for(var i = 1; i < 4; i++){ // displays numbers in menu to add to selected cell
		ctx.fillText(i,Cells[menu.i][menu.j].x+(canvas_size/9)*.3*i-10,(Cells[menu.i][menu.j].y)+(canvas_size/9)*.3);
		ctx.fillText(3+i,Cells[menu.i][menu.j].x+(canvas_size/9)*.3*i-10,(Cells[menu.i][menu.j].y)+(canvas_size/9)*.6);
		ctx.fillText(6+i,Cells[menu.i][menu.j].x+(canvas_size/9)*.3*i-10,(Cells[menu.i][menu.j].y)+(canvas_size/9)*.9);
	}
	invalidate();
	
}
function drawCell(contex,i,j,color){ // used to draw on fake canvas for click detection on cells 
	try{
	contex.lineWidth = 2;
	contex.fillStyle = color;
	contex.fillRect(Cells[i][j].x,Cells[i][j].y,(canvas_size/9),(canvas_size/9)); // draws cell on passed canvas
	invalidate();
	//contex.stroke();
	//alert("Drawing Cell");
	}catch(err){alert(err);}
}
function addCell(index,x,y,fill,num){ // adds cell to Cell array
	try{
	var cell = new Cell();
	// sets basic info for cell type
	cell.x = x;
	cell.y = y;
	cell.size = canvas_size/9;
	cell.fill = fill;
	cell.num = num;
	for(var i = 0; i < 9; i++){
		cell.numbers.push(true); //	fills menu boolean for menu numbers to display
	}
	Cells[index].push(cell); // pushes cells to 2d array
	}catch(err){alert(err);}
}
function createCells(){ // creates cell 2d array
	var color = "#000080"; // not used
	var num = ' '; // what is in the cell at the start
	try{
		for(var i = 0; i < 9; i++){
			Cells.push([]); // creates next cell array row
			for(var j = 0; j < 9; j++){
				addCell(i,(i*(canvas_size/9)),(j*(canvas_size/9)),color, num); // passes cell info to be created and pushed to array
			}
		}
	}catch(err){alert(err);}
}
function clear(context){ // removes all objects on passed canvas
	context.clearRect(0,0,canvas_size, canvas_size);
}
function mDown(e){ // what happens when mouse left button is depressed
	getMouse(e); // gets corrected mouse coords with offsets
	clear(ctx); // clears main canvas
	menuClick(); // checks to see if menu is clicked
	cellClick(); // checks to see if cell is clicked
	clear(ctx); // clears canvas again.....might not need this
	invalidate();
}
function menuClick(){ // checks for menu click
	/*     copyed from cell click, needs to be rewritten for menus
	for (var i = 0; i < Cells.length; i++) {
		for (var j = 0; j < Cells[i].length; j++) {
			var imageData;
			drawCell(fk_ctx,i,j,'blue');
			imageData = fk_ctx.getImageData(mx, my, 1, 1);
			clear(fk_ctx);
			if (imageData.data[3] > 0) {//3 is alpha value of colour at mouse coordinates
				mySel = Cells[i][j];
				offsetx = mx - mySel.x;
				offsety = my - mySel.y;
				mySel.x = mx - offsetx; 
				mySel.y = my - offsety;
				invalidate();
				return;
			}
		}																			
	}
	mySel = 0;
	*/
}
function cellClick(){ // checks if a cell was clicked
	for (var i = 0; i < Cells.length; i++) { // cycle through cell 2d array 
		for (var j = 0; j < Cells[i].length; j++) {
			var imageData; // RBG data for canvas
			drawCell(fk_ctx,i,j,'blue'); // draws cell on non-displayed canvas
			imageData = fk_ctx.getImageData(mx, my, 1, 1); // gets RBG data for mouse cords
			clear(fk_ctx);
			if (imageData.data[3] > 0) {//3 is alpha value of colour at mouse coordinates
			// if there is color then cell was clicked
				try{
				popUpMenu(mx,my,i,j); // sends info to menu for it to be displayed
				}catch(err){console.log(err);};
				fillCell(i,j,"5"); // when clicked fill this. this is just for testing, need to update menu click to fill correctly
				mySel = Cells[i][j]; // sets the clicked cell to mySel to be used for displaing info // might use this instead of menu object
				offsetx = mx - mySel.x; // mouse cords correction
				offsety = my - mySel.y;
				mySel.x = mx - offsetx; 
				mySel.y = my - offsety;
				invalidate();
				return;
			}
		}																			
	}
	
	mySel = 0;
}
function popUpMenu(x,y,i,j){ // sets new menu info 
	dispMenuHandler = true; // tells draw to disp menu
	menu.x = x; // mouse
	menu.y = y;
	menu.i = i;  // cell
	menu.j = j;
}
function getMouse(e) { // mouse offsets
      var element = canvas, offsetX = 0, offsetY = 0; //gets uncorrected mouse cords
      if (element.offsetParent) { //if html has offset 
        do {
          offsetX += element.offsetLeft; // add to offset counters
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
      }
      offsetX += stylePaddingLeft; // add padding info to offset
      offsetY += stylePaddingTop;

      offsetX += styleBorderLeft; // add boarder to offset
      offsetY += styleBorderTop;

      mx = e.pageX - offsetX; // create the corrected mouse cords
      my = e.pageY - offsetY;
}
function fillCell(i,j,stuff){// fills cell with passed info
	// i,j cell, stuff is what to put into it
	try{
	//add assert that num is a string number 1 - 9
	Cells[i][j].num = String(stuff);
	}catch(err){alert(err);}
}
function drawfilledCell(i,j){ // display number in cell
	ctx.font="50px Georgia";
	try{
	ctx.fillText(Cells[i][j].num,Cells[i][j].x+15,(Cells[i][j].y-15)+canvas_size/9);
	}catch(err){alert(err);}
}
function drawStuffInCells(){ // dispaly all numbers in cells
	ctx.fillStyle = 'black';
	for(var i = 0; i < Cells.length; i++){
		for(var j = 0; j < Cells[i].length; j++){
			try{
			drawfilledCell(i,j); // display number in passed cell 
			}catch(err){alert(err);}
		}
	}
	ctx.stroke();
	invalidate();
}