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
var letterMap = {};
var boardType = 'text';
//-----------------------getters
function getGame(){
    return game;   
}

function getColorMap(){
    return colorMap;
}

function getSymbolMap(){
    if(getBoardType() === 'letter'){
        console.log("in letter");
        return letterMap;
    }
    else
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
    var symbols = ["\u25CE", "\u25BD", "\u25C8", "\u25A1", "\u25CC", "\u25AC", "\u25B0", "\u25D8","\u25BA"];
    for (var i = 0; i < 9; i++) {
        symbolMap[i+1] = symbols[i];

    } 
    letterMap[' '] = '';
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H","I"];
    for (var i = 0; i < 9; i++) {
        letterMap[i+1] = letters[i];
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
    this.hover_i = null;
    this.hover_j = null;
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
        console.log("Error: Not valid array size");
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
    if(active) // if start button is pressed while game is running, run restart funtion
        alert("restarting");
    newGame();
}

function toggle_autoSweep() { //Function to toggle Auto Sweep	
    game.autoSweep = !game.autoSweep; // cleaner toggle then if statment 
}

function toggle_highlight() { //Function to toggle Auto Sweep	
    game.highlight = !game.highlight; // cleaner toggle then if statment
    console.log("Highlight: "+game.highlight);
}

function toggle_boardType() { //Function to switch between board types (symbol, number, letter..
    if(!confirmChoice("change board type?"))
        return false;
    var e = document.getElementById("boardType");
    var board = e.options[e.selectedIndex].value;
    console.log(board);
    switch(board){
        case '1':
            boardType = 'text';
            break;
        case '2':
            boardType = 'color';
            break;
        case '3':
            boardType = 'symbol';
            break;
        case '4':
            boardType = 'letter';
            break;
        default:
            alert("Board type "+board+" is not a valid value");
            break;
    }
    if(active){
        newGame();
    }
    return true;
}

function toggle_New_Board(){
    if(!confirmChoice("get a new puzzel?"))
        return false;
    
    var e = document.getElementById("puzzelDifficulty");
    var difficulty = e.options[e.selectedIndex].value;
    console.log("Difficulty :"+difficulty);
    
    if(!getNewPuzzel(difficulty))
        return false;;
    if(active){
        newGame();
    }
    return true;
    
}

function getNewPuzzel(puzzel_Difficulity){
    switch(puzzel_Difficulity){
        case "1":
            break;
        case "2":
            break;
        case "3":
            break;
        case "4":
            break;
        case "5":
            break;
        default:
            break;
    }
    //php stuff here
    var newPuzzel = "123456789.........123456789.........123456789.........1.3.5.7.9.........123456789";
    var newSolution = "123456789123456789123456789123456789123456789123456789123456789123456789123456789";
    
    var newPuzzelArr = parsePuzzelString(newPuzzel);
    var newSolutionArr = parsePuzzelString(newSolution);
    
    if(newPuzzelArr.length != 81 ||
       newSolutionArr.length != 81){
        alert("There was an error retreiving a new puzzel:\nError: Incorrect size detected");
        return false;
    }
    given_Puzzle = newPuzzelArr;
    solution_Puzzle = newSolutionArr;
              
    return true;
}
              
function parsePuzzelString(puzzel){
    var parsed = puzzel.split('');
    for (var i = 0; i < parsed.length; i++){
        if(parsed[i] == '.')
            parsed[i] = ' ';
    }
    return parsed;
}

function confirmChoice(msg){
    msg = "Are you sure you want to "+msg+"\nYou will lose all progress!";
    if(active && !(window.confirm(msg))){
            return false;
    }
    return true;
}

function newGame(){
    if(active)
        game.canvas.reset();
    game = null;
    game = new gData("myCanvas", given_Puzzle, solution_Puzzle);
    active = true;
    stopCount();    
    timedCount();
}

function getData() {
    document.getElementById('timetaken').value = getCount();
}
}