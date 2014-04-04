
function setup_Cells(canvas, given, menu, cell_Array) { // creates and draws cells
    for (var i = 0; i < given.length; i++) {
        cell_Array[i] = [];
        for (var j = 0; j < given.length; j++) {
            cell_Array[i][j] = add_Cell(canvas, menu, i, j,given); //creates cell and menu elements and fills them with data 
        }
    }
}

function add_Cell(canvas, menu, index, jndex,given) { // add cell object to canvas
    var num = menu.user[index][jndex]
    var colorCell = null;
    var colorData = null;
    var data = null;
    if(getBoardType() === 'color'){
        colorCell = getColorMap()[num];
        colorData = colorCell;
        data = ' ';
        if (given[index][jndex]){ //if cell being added is a given
            data = '*';
            colorData = 'black';
        }
    } //set up for color cells
    else{
        colorData = 'black'; // not given, future proofing for adding color
        colorCell = '';
        
        if(getBoardType() === 'symbol'  ||
           getBoardType() === 'letter'){
            data = getSymbolMap()[num];//convert to symbol map
        } // get symbol
        else{
            data = num;
        } //or num to put into cell
        if (given[index][jndex]){ //if cell being added is a given
            colorData = 'red'; // given color
        } //set givin color
    } // symbols, letters and text 
        
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
        fill: colorData// red for given, black for user 
    });
    
    cell.addChild(cellText); // binds the cell and the text toeachother
    canvas.addChild(cell); // adds cell/text to canvas object
    cell.zIndex = 'back';
    
    cell.bind("dblclick", function () {
        if(!getGame().highlight){
            return;
        } // do nothing if highligh not on
        clear_Cells(menu); //clears color fills on cells
       // menu.user[index][jndex] = num; // put orignal number back       not sure if needed..
        if(getBoardType() === 'color' && given[index][jndex]){
            num = '*';
        }
        else if(getBoardType() === 'symbol' ||
                getBoardType() === 'letter'){
            num = getSymbolMap()[num];//convert to symbol map
        } // get symbol
        
        cellText.text = num;
        num = menu.user[index][jndex]; //get real value
        if(num != ' '){ // if cell has somthing in it
            highlight(menu, num);
        } //highlight
        canvas.redraw();
    });
    cell.bind("mouseenter", function () {
            menu.hover_Cell = cell;
            hover(canvas, menu, index, jndex);
            canvas.redraw(); // prevent xbox lag
    }); //hover
    
    if (!given[index][jndex]) { // dont bind givin cells
        cell.bind("mousedown", function () {
            num = menu.user[index][jndex]; //get current number in cell
            menu.active_Cell = cellText; // put cell as active cell
        }); //mark cell as active
        cell.bind("click", function () { // on click action
            console.log("I:J",index,jndex);
            num = menu.user[index][jndex];
            clear_Cells(menu);
            menu.active_Cell = cellText;
            if(getGame().autoSweep){ // only if autosweep is on
                menu.constraints = find_constraints(menu,index, jndex);
            } // find contraints
            setup_Menu(canvas, menu, index, jndex); // display menu
        }); // disp menu and contraints if necessary
    } //for user cells only
    return cell;
}

function clear_Cells(menu){ // clears cell colors
    for(var i = 0; i < menu.user.length; i++)
        for(var j = 0; j < menu.user.length; j++){
            if(getBoardType() === 'color'){
                getGame().cell_Array[i][j].fill = getColorMap()[menu.user[i][j]];
            }
            else{
                getGame().cell_Array[i][j].fill = '';
            }
            getGame().cell_Array[i][j].stroke = '1px black';
                
        }
} // clear fill colors