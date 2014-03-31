function hint(){
    clear_Cells(getGame().menu);
    if(checker(false)) // if not all cells correct, dont give hint. false means ignore empty cells
        if(!check_Columns())
            if(!check_Rows())
                if(!check_Boxs())
                    if(!row_Inspections())
                        alert("no hint available try checking to see if all values are correct");
                        
}

function display_Hint(message, index, jndex){
    clear_Cells(getGame().menu);
    getGame().cell_Array[index][jndex].fill = 'yellow';
    getGame().canvas.redraw();
    alert(message);
}

//Checks columns for single missing cell, return true if found
function check_Columns(){
    for (var i = 0; i < getGame().menu.user.length; i++){
        var j = check_Column(i);
        if(j > 0){
            var msg = "Check this cells COLUMN for a clue...";
            display_Hint(msg,i,j);
            return true;
        }
    }
    return false;
}

function check_Column(column){
    var g = getGame();
    var missing = 0;
    var single_j = null;
    for (var j = 0; j < g.menu.user.length; j++){
        if(g.menu.user[column][j] == ' '){
            missing++;
            if(missing > 1){
                return 0;
            }
            single_j = j; //keeps track in case only one cell is missing
        }
    }
    return single_j;
}

//Checks rows for single missing cell, return true if found
function check_Rows(){
    for (var j = 0; j < getGame().menu.user.length; j++){
        var i = check_Row(j);
        if(i > 0){
            var msg = "Check this cells ROW for a clue...";
            display_Hint(msg,i,j);
            return true;
        }
    }
    return false;
}

function check_Row(row){
    var g = getGame();
    var missing = 0;
    var single_i = null;
    for (var i = 0; i < g.menu.user.length; i++){
        if(g.menu.user[i][row] == ' '){
            missing++;
            if(missing > 1){
                return 0;
            }
            single_i = i; //keeps track in case only one cell is missing
        }
    }
    return single_i;   
}

//Checks boxs for single missing cell, return true if found
function check_Boxs(){
    for(var i = 0; i < getGame().menu.user.length;){
        for(var j = 0; j < getGame().menu.user.length;){ //Scan 3 by 3 box.  Algorithm by Alec.....
            var box = check_Box(i,j);
            if( box[0] != 99){
                var msg = "Check this cells 3x3 BOX for a clue...";
                display_Hint(msg,box[0],box[1]);
                return true;               
            }
            j = j+3;
        }
        i = i+3;
    }
    return false;
}

function check_Box(column,row){
    var missing = 0;
    var box = [99,99]
    for(var y = 0; y < 3; y++){
        for(var z = 0; z < 3; z++){
            if(getGame().menu.user[((Math.floor(column/3)*3)+y)][((Math.floor(row/3)*3)+z)] == ' '){
                missing++;
                box[0] = (Math.floor(column/3)*3)+y;
                box[1] = (Math.floor(row/3)*3)+z;
                if(missing > 1){
                    return [99,99]
                }
            }
        }
    }
    return box;
        
}
 
//checks cells row column and box for valud value, returns on first found
function row_Inspections(){
    for(var i = 0; i < getGame().menu.user.length; i++){
        for(var j = 0; j < getGame().menu.user.length; j++){ // check each row
            if(!getGame().given[i][j]){ // if cell is not a given
                var row_Val = get_Missing_Row_Values(j); // find missing values for row
                var col_Val = get_Missing_Column_Values(i); // find missing values for row
                var box_Val = get_Missing_Box_Values(i,j); // find missing values for row
                var check = check_By_Inspection(row_Val,col_Val,box_Val);
                if(check > 0){
                    var msg = "Check this cells Row, Column and Box for a clue...\n";
                    display_Hint(msg,i,j);
                    return true;
                }
            }
        }
    }
    return false;
}

//finds the numbers no currently in each row
function get_Missing_Row_Values(row){
    var gM = getGame().menu;
    var row_Values = [false,false,false,false,false,false,false,false,false,false];
    for(var i = 0; i < getGame().menu.user.length; i++){
        row_Values[gM.user[i][row]] = true;
    }
    return row_Values;
}
//finds the numbers no currently in each column
function get_Missing_Column_Values(column){
    var gM = getGame().menu;
    var column_Values = [false,false,false,false,false,false,false,false,false,false];
    for(var i = 0; i < getGame().menu.user.length; i++){
        column_Values[gM.user[column][i]] = true;
    }
    return column_Values;
}

//finds the numbers no currently in each box
function get_Missing_Box_Values(column,row){
    var gM = getGame().menu;
    var box_Values = [false,false,false,false,false,false,false,false,false,false];
    for(var y = 0; y < 3; y++){
        for(var z = 0; z < 3; z++){
            box_Values[gM.user[((Math.floor(column/3)*3)+y)][((Math.floor(row/3)*3)+z)]] = true;
        }
    }
    return box_Values;     
}

//using the bitfields, check if 
function check_By_Inspection(row_Val,col_Val,box_Val){
    var value_fits = 0;
    var value = 0;
    for(var n = 1; n < row_Val.length; n++){
        if(!row_Val[n] && !col_Val[n] && !box_Val[n]){ // checks for value that i
            value = n;
            value_fits++;
            if(value_fits > 1)
                return 0;
        }
    }
    return value;
}