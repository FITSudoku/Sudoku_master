//--------------Globals-------------------------
var given_Puzzle = [' ',' ',' ',1,' ',5,' ',' ',' ',1,4,' ',' ',' ',' ',6,7,' ',' ',8
					,' ',' ',' ',2,4,' ',' ',' ',6,3,' ',7,' ',' ',1,' ',9,' ',' ',' '
					,' ',' ',' ',' ',3,' ',1,' ',' ',9,' ',5,2,' ',' ',' ',7,2,' ',' ',' '
					,8,' ',' ',2,6,' ',' ',' ',' ',3,5,' ',' ',' ',4,' ',9,' ',' ',' '] // givens to start the game
					 
var solution_Puzzle = [6,7,2,1,4,5,3,9,8,1,4,5,9,8,3,6,7,2,3,8,9,7,6,2,4,5,1,2,6,3,5,7,4,8
						,1,9,9,5,8,6,2,1,7,4,3,7,1,4,3,9,8,5,2,6,5,9,7,2,3,6,1,8,4,4,2,6,8,1
						,7,9,3,5,8,3,1,4,5,9,2,6,7];//An array of entries for the sample puzzle
//types and initialization
function gData(cName,_givens,_solutions){// new type that holds all data about the game
	this.givens = to_2D(_givens); // converts given 1d array into 2d array of board givens 
	this.solu = to_2D(_solutions); // 2d array of solution to game
	this.user = this.givens; // the user board
	this.given = create_Bool_Array(_givens); // bool 2d array for checking if cell is a given
	this.menu = new Menu();
	this.canvas = oCanvas.create({ // ocanvas call to link html canvas 
		canvas: "#"+cName, // canvas to add from html
		fps: 60
	});
	setup_Cells(this.canvas,this.givens,this.given,this.menu); // creates cell objects and fills them with givens
	Draw_Grids(this.canvas); // draws big grid lines
}
function Menu(){
	this.check = false;
	this.obj;
}
// functions----------------------------
function start(){
var game = new gData("myCanvas",given_Puzzle,solution_Puzzle); // sets up game

test(game);
}
function test(canvas, cell){ // test function for random tests

}
//-----------------Starting functions-----------------------------------------
function Draw_Grids(canvas){ // draws the background grids for the board
	for(var i = 3; i < 7; i+=3){ // only line 3 and 6 are needed
		Draw_Line(canvas,(canvas.width/9)*i,0,(canvas.width/9)*i,canvas.width); // vertical lines
		Draw_Line(canvas,0,(canvas.width/9)*i,canvas.width,(canvas.width/9)*i); // horizontal lines
	}
}
function Draw_Line(canvas, xstart,ystart,xend, yend){ // draws single line of background grid
	var line = canvas.display.line({ // ocanvas line call
		start: { x: xstart, y: ystart },
		end: { x: xend, y: yend },
		stroke: '5px black',
	});
	canvas.addChild(line); // add object to array of objects for ocanvas to auto draw
}
function setup_Cells(canvas,givens,given,menu){ // creates and draws cells
	for(var i = 0; i < givens.length; i++){
		for(var j = 0; j < givens.length; j++){
			var color = 'black'; // not given
			if (given[i][j]) //if cell being added is a given
				color = 'red'; // given
            add_Cell(canvas,givens,given,i,j,color,menu);
		}
	}
}
function add_Cell(canvas,givens,given,index,jndex,color,menu){ // add cell object to canvas
	var cell = canvas.display.rectangle({
		x: (canvas.width/givens.length)*index+(canvas.width/(givens.length*2)), //center of cell
		y: (canvas.width/givens.length)*jndex+(canvas.width/(givens.length*2)), //messy to make text alignment easier
		origin: { x: "center", y: "center" },
		width: canvas.width/givens.length,
		height:canvas.width/givens.length,
		fill: "white", 
		stroke: "1px black"
	});
	var cellText = canvas.display.text({ // what goes into the cell
		x: 0, 
		y: 0,
		origin: { x: "center", y: "center" },
		font: "bold 40px sans-serif",
		text: givens[index][jndex], // if this does not work. change the wya it is passed
		fill: color
	});
	cell.addChild(cellText); // binds the cell and the text toeachother
	canvas.addChild(cell); // adds cell/text to canvas object

	cell.bind("click tap", function () { // on click action
		if(!given[index][jndex])
			disp_Menu(canvas,menu,cell);
		else
			alert("This is an unchangeable cell");
	});
}
function disp_Menu(canvas,menu,cell){
	if(menu.check)
		menu.obj.stop().animate({
			height: 0,
			width: 0,
			rotation: -360
		});
	var menu_Obj = canvas.display.rectangle({
		x: cell.abs_x,
		y: cell.abs_y,
		origin: { x: "center", y: "center" },
		width: 0,
		height: 0,
		fill: "blue",
		stroke: "1px black",
	});
	canvas.addChild(menu_Obj);
	menu.obj = menu_Obj;
	menu_Obj.stop().animate({
		height: cell.width,
		width: cell.width,
		rotation: 360
		});
	menu_Obj.bind("click tap", function(){
		this.stop().animate({
		height: 0,
		width: 0,
		rotation: 360
		});
		//canvas.removeChild(menu_Obj);
		menu.check = false;
	});
	canvas.redraw();
	menu.check = true;
}
function create_Bool_Array(inArray){ // creates a 2d bool array of givens
	var boolArray = [];
	for(var i = 0; i < inArray.length; i++){ // generates bool array if cell is a given
		if(inArray[i] == ' ') 
			boolArray[i] = false; // not given
		else
			boolArray[i] = true; // given
	}
	return to_2D(boolArray);
}
function to_2D(inArray){ // takes in 1d array and converts to 2d, must pass correct size, sqrt(size)= whole number
	var array = [];
	var size = Math.sqrt(inArray.length); // gets square root of size input array
	var index = 0;
	if(size*size !== inArray.length){ // checks to make sure the input array is of a correct size
		console.log("Not valid array size");
		return 0;
	}
	for(var i = 0; i < size; i++){ // creates the 2d array
		array[i] = []; // creates next cell array row
		for(var j = 0; j < size; j++){
			array[i][j] = inArray[index++];
			//console.log(i+":"+j+" "+array[i][j]);
		}
	}
	return array;
}
