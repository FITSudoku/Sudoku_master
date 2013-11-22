/*jshint indent: 4 */
/*global oCanvas, console, alert*/ //used to hide erros
var given_Puzzle = [' ', ' ', ' ', 1, ' ', 5, ' ', ' ', ' ', 1, 4, ' ', ' ', ' ', ' ', 6, 7, ' ', ' ', 8,
					' ', ' ', ' ', 2, 4, ' ', ' ', ' ', 6, 3, ' ', 7, ' ', ' ', 1, ' ', 9, ' ', ' ', ' ',
					' ', ' ', ' ', ' ', 3, ' ', 1, ' ', ' ', 9, ' ', 5, 2, ' ', ' ', ' ', 7, 2, ' ', ' ', ' ',
					8, ' ', ' ', 2, 6, ' ', ' ', ' ', ' ', 3, 5, ' ', ' ', ' ', 4, ' ', 9, ' ', ' ', ' ']; // givens to start the game					 
var solution_Puzzle = [6, 7, 2, 1, 4, 5, 3, 9, 8, 1, 4, 5, 9, 8, 3, 6, 7, 2, 3, 8, 9, 7, 6, 2, 4, 5, 1, 2, 6, 3, 5, 7, 4, 8,
						1, 9, 9, 5, 8, 6, 2, 1, 7, 4, 3, 7, 1, 4, 3, 9, 8, 5, 2, 6, 5, 9, 7, 2, 3, 6, 1, 8, 4, 4, 2, 6, 8, 1,
						7, 9, 3, 5, 8, 3, 1, 4, 5, 9, 2, 6, 7]; //An array of entries for the sample puzzle
var game = null; // becuase button on html cant access non globals

//-------------------------Types and initialization
function gData(cName, _givens, _solutions) { // new type that holds all data about the game
	this.inGiven = _givens;
	this.inSol = _solutions;
	this.givens = to_2D(_givens); // converts given 1d array into 2d array of board givens 
	this.solu = to_2D(_solutions); // 2d array of solution to game
	this.given = create_Bool_Array(_givens); // bool 2d array for checking if cell is a given
	this.canvas = oCanvas.create({ // ocanvas call to link html canvas 
		canvas: "#" + cName, // canvas to add from html
		fps: 60
	});
	this.cell_Array = [];
	Draw_Grids(this.canvas); // draws big grid lines
	this.menu = new Menu(this.canvas, to_2D(_givens));
	setup_Cells(this.canvas, this.given, this.menu, this.cell_Array); // creates cell objects and fills them with givens
}

function Menu(canvas, user_Board) {
	this.check = false; // checker if menu is active
	this.obj = null; // the object being disp
	this.active_Cell = null; // cellText menu is acting on
	this.hover_Cell = null;
	this.mouse_Obj = null; // xbox to clear active cell of data
	this.xBox_Check = false; // checks if xbox in top right of cell is present
	this.user = user_Board;
}
// ------------------------Functions----------------------------
function start() {
	game = new gData("myCanvas", given_Puzzle, solution_Puzzle); // sets up game	
}
//-------------------------Board functions--------------------
function Draw_Grids(canvas) { // draws the background grids for the board
	for (var i = 3; i < 7; i += 3) { // only line 3 and 6 are needed
		Draw_Line(canvas, (canvas.width / 9) * i, 0, (canvas.width / 9) * i, canvas.width); // vertical lines
		Draw_Line(canvas, 0, (canvas.width / 9) * i, canvas.width, (canvas.width / 9) * i); // horizontal lines
	}
}

function Draw_Line(canvas, xstart, ystart, xend, yend) { // draws single line of background grid
	var line = canvas.display.line({ // creates line object
		start: {
			x: xstart,
			y: ystart
		},
		end: {
			x: xend,
			y: yend
		},
		stroke: '5px black', // big line properties
	});
	canvas.addChild(line); // add object to array of objects for ocanvas to auto draw
	line.zIndex = 'front'; // not sure if necessary, added for debuging
}

function setup_Cells(canvas, given, menu, cell_Array) { // creates and draws cells
	for (var i = 0; i < given.length; i++) {
		cell_Array[i] = [];
		for (var j = 0; j < given.length; j++) {
			var color = 'black'; // not given, future proofing for adding color
			if (given[i][j]) //if cell being added is a given
				color = 'red'; // given color
			cell_Array[i][j] = add_Cell(canvas, menu, i, j, color); //creates cell and menu elements and fills them with data 
		}
	}
}

function add_Cell(canvas, menu, index, jndex, color) { // add cell object to canvas
	var cell = canvas.display.rectangle({
		x: (canvas.width / menu.user.length) * index + (canvas.width / (menu.user.length * 2)), //center of cell
		y: (canvas.width / menu.user.length) * jndex + (canvas.width / (menu.user.length * 2)), //messy to make text alignment easier
		origin: {
			x: "center",
			y: "center"
		},
		width: canvas.width / menu.user.length,
		height: canvas.width / menu.user.length,
		stroke: "1px black"
	});
	var cellText = canvas.display.text({ // what goes into the cell
		x: 0, // use parent as child
		y: 0,
		origin: {
			x: "center",
			y: "center"
		},
		font: "bold 40px sans-serif",
		text: menu.user[index][jndex], // if this does not work. change the wya it is passed
		fill: color // red for given, black for user 
	});
	cell.addChild(cellText); // binds the cell and the text toeachother
	canvas.addChild(cell); // adds cell/text to canvas object
	var num = null;
	cell.bind("mousedown", function () {
		num = menu.user[index][jndex];
		menu.active_Cell = cellText;
	});
	cell.bind("dblclick", function () {
		clear_Cells(menu);
		cellText.text = num;
		menu.user[index][jndex] = num;
		highlight(menu, num);
		canvas.redraw();
	});
	if (color === 'black') { // black == user cell, red == given
		cell.bind("click", function () { // on click action
			num = menu.user[index][jndex];
			clear_Cells(menu);
			menu.active_Cell = cellText;
			setup_Menu(canvas, menu, index, jndex);
		});
		cell.bind("mouseenter", function () {
			menu.hover_Cell = cell;
			hover(canvas, menu, index, jndex);
			canvas.redraw(); // prevent xbox lag
		});
	}
	return cell;
}

function setup_Menu(canvas, menu, index, jndex) { // change to small cells only
	if (menu.check) // if menu exists, move instead of create new one
		menu.obj.moveTo(menu.active_Cell.parent.abs_x, menu.active_Cell.parent.abs_y); //moves menu to new active cell
	else {
		menu.obj = canvas.display.rectangle({ // dummy object to hold 9 small objects to create menu
			x: menu.active_Cell.parent.abs_x,
			y: menu.active_Cell.parent.abs_y
		});
		for (var i = 0; i < 3; i++)
			for (var j = 0; j < 3; j++)
				add_Menu(canvas, menu, index, jndex, (canvas.width / 27) * (i - 1), (canvas.width / 27) * (j - 1), i, j);
		canvas.addChild(menu.obj); // disp dummy+children 
		menu.check = true;
	}
	menu.obj.zIndex('front');
	canvas.redraw(); // placed here to update after move, else menu lags
}

function add_Menu(canvas, menu, index, jndex, x, y, i, j) { // disp menu numbers
	var menu_Cell = canvas.display.rectangle({
		x: x, //center of cell
		y: y,
		origin: {
			x: "center",
			y: "center"
		},
		width: canvas.width / (menu.user.length * 3),
		height: canvas.width / (menu.user.length * 3),
		fill: "blue",
		stroke: "1px black",
		text: (j * 3) + i + 1
	});
	var menu_Cell_Text = canvas.display.text({ // what goes into the cell
		origin: {
			x: "center",
			y: "center"
		},
		font: "bold 15px sans-serif",
		text: (j * 3) + i + 1, // this took me way longer to figure out then it should
		fill: "white"
	});
	menu.active_Cell.parent.fill = '';
	menu_Cell.addChild(menu_Cell_Text);
	menu.obj.addChild(menu_Cell);
	menu_Cell.bind("click tap", function () { // click bind for small menu
		menu.active_Cell.text = this.text; //sets new value for cell
		menu.user[index][jndex] = this.text; // edits user board for new value
		menu.obj.remove(); // removes dummy+childrne menu from disp
		menu.check = false;
	});


}

function hover(canvas, menu, index, jndex) {
	if (menu.xBox_Check)
		menu.mouse_Obj.moveTo(menu.hover_Cell.abs_x + (canvas.height / (menu.user.length * 2)),
			menu.hover_Cell.abs_y - (canvas.height / (menu.user.length * 2)));
	else {
		menu.xBox_Check = true;
		var xBox = canvas.display.arc({
			x: menu.hover_Cell.abs_x + canvas.height / (menu.user.length * 2), //center of cell
			y: menu.hover_Cell.abs_y - canvas.height / (menu.user.length * 2), //messy to make text alignment easier
			origin: {
				x: "center",
				y: "center"
			},
			start: 90,
			end: 180,
			radius: 20,
			pieSection: true,
			fill: "yellow",
			stroke: "0px black",
			opacity: 0.8,
			join: "cap"
		});
		var xbox_Text = canvas.display.text({ // what goes into the cell
			x: -2, // use parent as child
			y: +2,
			origin: {
				x: "right",
				y: "top"
			},
			font: "bold 13px sans-serif",
			text: 'X', // if this does not work. change the wya it is passed
			fill: 'grey' // red for given, black for user 
		});
		xBox.addChild(xbox_Text);
		canvas.addChild(xBox);
		menu.mouse_Obj = xBox;
		xBox.bind("click tap", function () {
			menu.hover_Cell.children[0].text = ' ';
			menu.user[index][jndex] = ' ';
			canvas.redraw(); // prevents removal lag
		});
	}
}

function clear_Cells(menu){ // clears cell colors
	for(var i = 0; i < menu.user.length; i++)
		for(var j = 0; j < menu.user.length; j++)
			game.cell_Array[i][j].fill = '';
}
//------------------------Data manipulation fucntions------------------------
function create_Bool_Array(inArray) { // creates a 2d bool array of givens
	var boolArray = [];
	for (var i = 0; i < inArray.length; i++) { // generates bool array if cell is a given
		boolArray[i] = true;
		if (inArray[i] == ' ')
			boolArray[i] = false; // not given
	}
	return to_2D(boolArray); // returns 2d array of bool given?
}

function to_2D(inArray) { // takes in 1d array and converts to 2d, must pass correct size, sqrt(size)= whole number
	var array = [];
	var size = Math.sqrt(inArray.length); // gets square root of size input array
	if (size * size !== inArray.length) // checks to make sure the input array is of a correct size
		console.log("Not valid array size");
	else {
		var index = 0;
		for (var i = 0; i < size; i++) { // creates the 2d array
			array[i] = []; // creates next cell array row
			for (var j = 0; j < size; j++) {
				array[i][j] = inArray[index++];
			}
		}
	}
	return array;
}
//------------------------Button fucntions-----------------------------------
function restart() { // puts original values in cells
	game.menu.user = to_2D(game.inGiven); //has to recreate array because of obj pointers mess shit up
	for (var i = 0; i < game.menu.user.length; i++)
		for (var j = 0; j < game.menu.user.length; j++)
			game.cell_Array[i][j].children[0].text = game.menu.user[i][j]; // assinment works, data replace is bad
	game.canvas.redraw();
}

function solver() { // solves the puzzle
	game.menu.user = to_2D(game.inSol); // Must recreate array because of object refrences
	for (var i = 0; i < game.menu.user.length; i++)
		for (var j = 0; j < game.menu.user.length; j++)
			game.cell_Array[i][j].children[0].text = game.menu.user[i][j]; // assinment works, data replace is bad
	game.canvas.redraw();
}

function checker() { // checks puzzle for correctness
	var correct = true; // bool for quick breaking and message display
	for (var i = 0; i < game.menu.user.length; i++)
		for (var j = 0; j < game.menu.user.length; j++) {
			if (game.solu[i][j] != game.menu.user[i][j] && checker) { // added checker for a little optomization 
				alert("There appears to be a probelm with you solution!");
				game.cell_Array[i][j].fill = 'red'; // Highlights incorrect cell
				correct = false;
				i = 99; // quick break
				break;
			}
		}
	if (correct)
		alert("Congradulations, now give us your data!");
	game.canvas.redraw();
}
//------------------------Help Functions--------------------------------------
function highlight(menu,num){
	menu.obj.remove();
	console.log("hightlight:"+num);
	for(var i = 0; i < menu.user.length; i++){
		for(var j = 0; j < menu.user.length; j++){
			if(menu.user[i][j] == num){
				for(var x = 0; x < menu.user.length; x++){
					game.cell_Array[x][j].fill = 'blue';
					game.cell_Array[x][j].zIndex = 'back';
					game.cell_Array[i][x].fill = 'blue';
					game.cell_Array[i][x].zIndex = 'back';
				}
				var count = 0;
				for(var y = 0; y < 3; y++)
					for(var z = 0; z < 3; z++){
						count++;
						console.log("X:"+((Math.floor(i/3)*3)+y)+" y:"+((Math.floor(j/3)*3)+z)+" C:"+count);
						game.cell_Array[((Math.floor(i/3)*3)+y)][((Math.floor(j/3)*3)+z)].fill = 'blue';
						game.cell_Array[((Math.floor(i/3)*3)+y)][((Math.floor(j/3)*3)+z)].zIndex = 'back';
						console.log("X:"+i+" y:"+j+" C:"+count);											 
					}
			}
		}
	}
	menu.active_Cell.parent.fill = 'green';
}