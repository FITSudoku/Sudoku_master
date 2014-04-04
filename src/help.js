function highlight(menu,num){
    hintUsed = true;
    if(menu.obj != null){
        getGame().canvas.removeChild(menu.obj);
    }
    console.log("hightlight:"+num);
    for(var i = 0; i < menu.user.length; i++){
        for(var j = 0; j < menu.user.length; j++){
            if(getGame().given[i][j]){
                getGame().cell_Array[i][j].fill = 'blue';
                getGame().cell_Array[i][j].zIndex = 'back';
            } //highlight all givens   
            if((menu.user[i][j] == num )){
                for(var x = 0; x < menu.user.length; x++){
                    getGame().cell_Array[x][j].fill = 'blue';
                    getGame().cell_Array[x][j].zIndex = 'back';
                    getGame().cell_Array[i][x].fill = 'blue';
                    getGame().cell_Array[i][x].zIndex = 'back';
                } // highlight row and coloum
                for(var y = 0; y < 3; y++) {
                    for(var z = 0; z < 3; z++){
                        getGame().cell_Array[((Math.floor(i/3)*3)+y)][((Math.floor(j/3)*3)+z)].fill = 'blue';
                        getGame().cell_Array[((Math.floor(i/3)*3)+y)][((Math.floor(j/3)*3)+z)].zIndex = 'back';
                    }
                } //highlight box
            } //highlight row/column/box of matchs
        }
    } // find highlight
    for(var i = 0; i < menu.user.length; i++){
        for(var j = 0; j < menu.user.length; j++){         
            if((menu.user[i][j] == num )){
                getGame().cell_Array[i][j].stroke = "5px yellow";
                getGame().cell_Array[i][j].zIndex = 'front';
                if(getBoardType() == 'color'){
                    getGame().cell_Array[i][j].fill = getColorMap()[num];
                }//if cell matches
            } 
        }
    } // find matches
    getGame().canvas.redraw();
}

function solver() { // solves the puzzle
    hintUsed = true;
    getGame().menu.user = to_2D(getGame().inSol); // Must recreate array because of object references
    for (var i = 0; i < getGame().menu.user.length; i++)
        for (var j = 0; j < getGame().menu.user.length; j++){
            if( getBoardType() === 'letter' || getBoardType() === 'symbol'){
                getGame().cell_Array[i][j].children[0].text = getSymbolMap()[getGame().menu.user[i][j]]; 
            }else if(getBoardType() === 'color')
                getGame().cell_Array[i][j].fill = getColorMap()[getGame().menu.user[i][j]];
            else
                getGame().cell_Array[i][j].children[0].text = getGame().menu.user[i][j];
        }
    getGame().canvas.redraw();
}

function checker(check_empty) { // checks puzzle for correctness
    var g = getGame();
    clear_Cells(g.menu)
    var empty_Cell_Check = false;
    var full_Board = false;
    var correct = true; // bool for quick breaking and message display
    for (var i = 0; i < g.menu.user.length; i++){
        for (var j = 0; j < g.menu.user.length; j++) {
            if (g.menu.user[i][j] == ' ' && check_empty){
                getGame().cell_Array[i][j].fill = 'yellow';
                empty_Cell_Check = true;
            }
            if (g.solu[i][j] != g.menu.user[i][j] && g.menu.user[i][j] != ' ') { // added checker for a little optomization 
                getGame().cell_Array[i][j].fill = 'red'; // Highlights incorrect cell
                correct = false;
            }
        }
        full_Board = true;
    }
    if(correct && !empty_Cell_Check && check_empty){
        getData(); //Get data immediately after solving. Don't allow some variables to change before submission
        stopCount();
        alert("Congratulations, now give us your data!");
        document.getElementById('submitButton').style.visibility = "visible"; //Show submit button after solving puzzle
    }
    if (empty_Cell_Check){
        alert("Empty Cell\(s\) Found");
    }
    if(!correct){
        alert("There appears to be a probelm with you solution!");
    }
    getGame().canvas.redraw();
    return correct;
        
}
