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
var boardType = 'text';
//-------------------------Types and initialization

function gData(cName, _givens, _solutions){// new type that holds all data about the game	
    this.autoSweep = false;
    this.highlight = false;
    this.inGiven = _givens;
    this.given = create_Bool_Array(_givens); // bool 2d array for checking if cell is a given
    this.inSol = _solutions;
    colorMap[' '] = '';
    var colors = ["navy", "green", "orange", "grey", "red", "yellow", "indigo", "violet", "teal"];
    for (var i = 0; i < 9; i++) {
        colorMap[i+1] = colors[i];
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
            cell_Array[i][j] = add_Cell(canvas, menu, i, j,given); //creates cell and menu elements and fills them with data 
        }
    }
    console.log(menu.user);
}

function add_Cell(canvas, menu, index, jndex,given) { // add cell object to canvas
    //console.log(menu.user[index][jndex]);
    var colorCell = null;
    var colorData = null;
    var data = null;
    if(boardType === 'color'){
        colorCell = colorMap[menu.user[index][jndex]];
        colorData = colorCell;
        data = ' ';
        if (given[index][jndex]){ //if cell being added is a given
            data = '*';
            colorData = 'black';
        }
    }else{
        colorData = 'black'; // not given, future proofing for adding color
        colorCell = '';
        data = menu.user[index][jndex];
        if (given[index][jndex]) //if cell being added is a given
            colorData = 'red'; // given color
    }
        
    var cell = canvas.display.rectangle({
        x: (canvas.width / menu.user.length) * index + (canvas.width / (menu.user.length * 2)), //center of cell
        y: (canvas.width / menu.user.length) * jndex + (canvas.width / (menu.user.length * 2)), //messy to make text alignment easier
        origin: {
            x: "center",
            y: "center"
        },
        width: canvas.width / menu.user.length,
        height: canvas.width / menu.user.length,
        stroke: "1px black",
        fill: colorCell
    });
    var cellText = canvas.display.text({ // what goes into the cell
        x: 0, // use parent as child
        y: 0,
        origin: {
            x: "center",
            y: "center"
        },
        font: "bold 40px sans-serif",
        text:data , // if this does not work. change the way it is passed
        fill: colorData//mapColor(menu.user[index][jndex]) // red for given, black for user 
    });
    cell.addChild(cellText); // binds the cell and the text toeachother
    canvas.addChild(cell); // adds cell/text to canvas object
    cell.zIndex = 'back';
    var num = null;
    cell.bind("mousedown", function () {
        num = menu.user[index][jndex];
        menu.active_Cell = cellText;
    });
    cell.bind("dblclick", function () {
        clear_Cells(menu);
        menu.user[index][jndex] = num;
        if(boardType === 'color' && given[index][jndex])
            num = '*';
        cellText.text = num;
        num = menu.user[index][jndex];
        if(num != ' ' && game.highlight)
            highlight(menu, num, game);
        canvas.redraw();
    });
    if (!given[index][jndex]) { // black == user cell, red == given
        cell.bind("click", function () { // on click action
            num = menu.user[index][jndex];
            clear_Cells(menu);
            menu.active_Cell = cellText;
            menu.constraints = find_constraints(menu,index, jndex);
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
    if (menu.check) { // if menu exists, delete it
        menu.obj.remove();
	}              
    menu.obj = canvas.display.rectangle({// dummy object to hold 9 small objects to create menu
        x: menu.active_Cell.parent.abs_x,
        y: menu.active_Cell.parent.abs_y,
    });   
    for (var i = 0; i < 3; i++){
        for (var j = 0; j < 3; j++){
            var num = (j * 3) + i + 1;
            var color = 'white';
            if (game.autoSweep) //Only add numbers that are not constrained
                if (!menu.constraints[num]){
                    color = 'blue';
                    if(boardType === 'color')
                        color = colorMap[num];
                }
            add_Menu(canvas, menu, index, jndex, (canvas.width / 27) * (i - 1), (canvas.width / 27) * (j - 1), i, j,color);
        }
    }
    canvas.addChild(menu.obj); // disp dummy+children
    menu.check = true;        
    menu.obj.zIndex = 'front';
    canvas.redraw(); // placed here to update after move, else menu lags
}

function add_Menu(canvas, menu, index, jndex, x, y, i, j,color) { // disp menu numbers
    var boxColor = 'blue';
    if(boardType === 'color')
        boxColor = colorMap[(j * 3) + i + 1];
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
        text: (j * 3) + i + 1,
        fill: boxColor
    });
    var menu_Cell_Text = canvas.display.text({ // what goes into the cell
        origin: {
            x: "center",
            y: "center"
        },
        font: "bold 15px sans-serif",
        text: (j * 3) + i + 1, // this took me way longer to figure out then it should
        fill: color
    });
    menu.active_Cell.parent.fill = '';
    menu_Cell.addChild(menu_Cell_Text);
    menu.obj.addChild(menu_Cell);
    menu_Cell.bind("click tap", function () { // click bind for small menu
        if(color === 'white'){
            menu.active_Cell.text = this.text; //sets new value for cell
            menu.user[index][jndex] = this.text; // edits user board for new value
        }
        if(boardType === 'color')
            menu.active_Cell.parent.fill = colorMap[menu.user[index][jndex]];
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
            text: 'X', // if this does not work. change the way it is passed
            fill: 'grey' // red for given, black for user 
        });
        xBox.addChild(xbox_Text);
        canvas.addChild(xBox);
        xBox.zIndex = 'front';
        menu.mouse_Obj = xBox;
        xBox.bind("click tap", function () {
            menu.hover_Cell.children[0].text = ' ';
            menu.user[index][jndex] = ' ';
            menu.constraints = find_constraints(menu,index, jndex);
            canvas.redraw(); // prevents removal lag
        });
    }
}

function clear_Cells(menu){ // clears cell colors
    for(var i = 0; i < menu.user.length; i++)
        for(var j = 0; j < menu.user.length; j++){
            if(boardType === 'color'){
                console.log(menu.user[i][j]);
                game.cell_Array[i][j].fill = colorMap[menu.user[i][j]];
            }
            else
                game.cell_Array[i][j].fill = '';
            game.cell_Array[i][j].stroke = '1px black';
                
        }
}

function find_constraints (menu,column,row) { //Finds all constraints and returns a Boolean array representing the values that are valid for that cell.
										//NOTE: the index for the array is shifted to match number values:  booleanArray[1] represents the number 1.
	var boolArray = [null,true,true,true,true,true,true,true,true,true];
    //console.log(boolArray);
	for(var y = 0; y < 3; y++) //Scan 3 by 3 box.  Algorithm by Alec.....
        for(var z = 0; z < 3; z++)
            if(menu.user[((Math.floor(column/3)*3)+y)][((Math.floor(row/3)*3)+z)] != ' ') 
                boolArray[menu.user[((Math.floor(column/3)*3)+y)][((Math.floor(row/3)*3)+z)]] = false;
    //console.log(boolArray);    
	for (var columnIdx = 0; columnIdx < 9; columnIdx++) //Scan column
        if(menu.user[columnIdx][row] != ' ') 
            boolArray[menu.user[columnIdx][row]] = false;
    //console.log(boolArray);
	for (var rowIdx = 0; rowIdx < 9; rowIdx++) //Scan Row
        if(menu.user[column][rowIdx] != ' ') 
            boolArray[menu.user[column][rowIdx]] = false;
    //console.log(boolArray);
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
    return color;
    
  //  return red if given not using colors
   // return black if given and using colors
   // return color if using colors and not given
    //return color;   
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

function solver() { // solves the puzzle
    game.menu.user = to_2D(game.inSol); // Must recreate array because of object references
    for (var i = 0; i < game.menu.user.length; i++)
        for (var j = 0; j < game.menu.user.length; j++)
            game.cell_Array[i][j].children[0].text = game.menu.user[i][j]; // assignment works, data replace is bad
    game.canvas.redraw();
    stopCount();
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
    if(correct){
        stopCount();
        alert("Congratulations, now give us your data!");
    }
    game.canvas.redraw();
}

function toggle_autoSweep() { //Function to toggle Auto Sweep	
    game.autoSweep = !game.autoSweep; // cleaner toggle then if statment 
}

function toggle_highlight() { //Function to toggle Auto Sweep	
    game.highlight = !game.highlight; // cleaner toggle then if statment
    console.log("Highlight: "+game.highlight);
}
function toggle_boardType() { //Function to toggle Auto Sweep	
    //   setup_Cells(game.canvas, game.given, game.menu, game.cell_Array)
    var save = game.menu.user;
    if(boardType === 'color')
        boardType = 'text';
    else
        boardType = 'color';
    game.canvas.reset();
    game = null;
    game = new gData("myCanvas", given_Puzzle, solution_Puzzle);
}

//------------------------Help Functions--------------------------------------

