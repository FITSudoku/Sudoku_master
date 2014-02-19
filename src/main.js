/*jshint indent: 4 */
/*global oCanvas, console, alert, stopCount, timedCount */ //used to hide erros
var active = false;
var given_Puzzle = [6, 7, ' ', 1, ' ', 5, ' ', ' ', 8, 1, 4, ' ', ' ', ' ', ' ', 6, 7, ' ', ' ', 8,
                     ' ', ' ', ' ', 2, 4, ' ', ' ', ' ', 6, 3, ' ', 7, ' ', ' ', 1, ' ', 9, ' ', ' ', ' ',
                     ' ', ' ', ' ', ' ', 3, ' ', 1, ' ', ' ', 9, ' ', 5, 2, ' ', ' ', ' ', 7, 2, ' ', ' ', ' ',
                    8, ' ', ' ', 2, 6, ' ', ' ', ' ', ' ', 3, 5, ' ', ' ', ' ', 4, ' ', 9, ' ', ' ', ' ']; // givens to start the game                                         
var solution_Puzzle = [6, 7, 2, 1, 4, 5, 3, 9, 8, 1, 4, 5, 9, 8, 3, 6, 7, 2, 3, 8, 9, 7, 6, 2, 4, 5, 1, 2, 6, 3, 5, 7, 4, 8,
                        1, 9, 9, 5, 8, 6, 2, 1, 7, 4, 3, 7, 1, 4, 3, 9, 8, 5, 2, 6, 5, 9, 7, 2, 3, 6, 1, 8, 4, 4, 2, 6, 8, 1,
                        7, 9, 3, 5, 8, 3, 1, 4, 5, 9, 2, 6, 7]; //An array of entries for the sample puzzle
var game = null; // becuase button on html cant access non globals
var colorMap = {};
var symbolMap = {};
var boardType = 'text';
//-----------------------getters
function getGame(){
    return game;   
}

function getColorMap(){
    return colorMap;
}

function getSymbolMap(){
    return symbolMap;
}

function getBoardType(){
    return boardType;
}

//-------------------------Types and initialization

function gData(cName, _givens, _solutions){// new type that holds all data about the game	
    this.autoSweep = false;
    this.highlight = false;
    this.inGiven = _givens;
    this.given = create_Bool_Array(_givens); // bool 2d array for checking if cell is a given
    this.inSol = _solutions;
    colorMap[' '] = '';
    var colors = ["darkgoldenrod", "green", "orange", "grey", "red", "yellow", "indigo", "violet", "teal"];
    for (var i = 0; i < 9; i++) {
        colorMap[i+1] = colors[i];
    }    
    symbolMap[' '] = '';
    var symbols = ["\u25CE", "\u25BD", "\u25C8", "\u25A1", "\u25CC", "\u2042", "\u203B", "\u2623","\u262F"];
    for (var i = 0; i < 9; i++) {
        symbolMap[i+1] = symbols[i];
    }
    this.givens = to_2D(_givens); // converts given 1d array into 2d array of board givens 
    this.solu = to_2D(_solutions); // 2d array of solution to game
    this.canvas = oCanvas.create({ // ocanvas call to link html canvas 
        canvas: "#" + cName, // canvas to add from html
        fps: 60
    });
    this.cell_Array = [];
    this.menu = new Menu(this.canvas, to_2D(_givens));
    setup_Cells(this.canvas, this.given, this.menu, this.cell_Array); // creates cell objects and fills them with givens
    Draw_Grids(this.canvas); // draws big grid lines
}

function Menu(canvas, user_Board) {
    this.check = false; // checker if menu is active
    this.obj = null; // the object being disp
    this.active_Cell = null; // cellText menu is acting on
    this.hover_Cell = null;
    this.mouse_Obj = null; // xbox to clear active cell of data
    this.xBox_Check = false; // checks if xbox in top right of cell is present
    this.user = user_Board;
    this.constraints= null;
}

//-------------------------Board functions--------------------


function find_constraints (menu,column,row) { //Finds all constraints and returns a Boolean array representing the values that are valid for that cell.
								//NOTE: the index for the array is shifted to match number values:  booleanArray[1] represents the number 1.
	var boolArray = [null,true,true,true,true,true,true,true,true,true];
	for(var y = 0; y < 3; y++) //Scan 3 by 3 box.  Algorithm by Alec.....
        for(var z = 0; z < 3; z++)
            if(menu.user[((Math.floor(column/3)*3)+y)][((Math.floor(row/3)*3)+z)] != ' ') 
                boolArray[menu.user[((Math.floor(column/3)*3)+y)][((Math.floor(row/3)*3)+z)]] = false;
	for (var columnIdx = 0; columnIdx < 9; columnIdx++) //Scan column
        if(menu.user[columnIdx][row] != ' ') 
            boolArray[menu.user[columnIdx][row]] = false;
	for (var rowIdx = 0; rowIdx < 9; rowIdx++) //Scan Row
        if(menu.user[column][rowIdx] != ' ') 
            boolArray[menu.user[column][rowIdx]] = false;
	return (boolArray);	
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
            for (var j = 0; j < size; j++)
                array[i][j] = inArray[index++];
        }
    }
    return array;        
}

function mapColor(num){
    var color = colorMap[num];
    return color;//red = no color, black = given, color = maped color
}
//------------------------Button functions-----------------------------------

function start() {
    
    if(active){ // if start button is pressed while game is running, run restart funtion
        alert("restarting");
        restart();
    }else{
        game = new gData("myCanvas", given_Puzzle, solution_Puzzle); // sets up game
        active = true;
        stopCount();    
        timedCount();

    }
}

function restart() { // puts original values in cells
    game.menu.user = to_2D(game.inGiven); //has to recreate array because of obj pointers mess shit up
    for (var i = 0; i < game.menu.user.length; i++)
        for (var j = 0; j < game.menu.user.length; j++)
            game.cell_Array[i][j].children[0].text = game.menu.user[i][j]; // assignment works, data replace is bad
    game.canvas.redraw();
    stopCount();       
    timedCount();
}

function toggle_autoSweep() { //Function to toggle Auto Sweep	
    game.autoSweep = !game.autoSweep; // cleaner toggle then if statment 
}

function toggle_highlight() { //Function to toggle Auto Sweep	
    game.highlight = !game.highlight; // cleaner toggle then if statment
    console.log("Highlight: "+game.highlight);
}

function toggle_boardType() { //Function to toggle Auto Sweep
    var e = document.getElementById("boardType");
    var board = e.options[e.selectedIndex].value;
    console.log(board);
    var save = game.menu.user;
    if(board == '1')
        boardType = 'text';
    else if(board == '2')
        boardType = 'color';
    else
        boardType = 'symbol';
    game.canvas.reset();
    game = null;
    game = new gData("myCanvas", given_Puzzle, solution_Puzzle);
}
