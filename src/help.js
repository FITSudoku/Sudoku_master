
function highlight(menu,num,game){
    getGame().canvas.removeChild(menu.obj);
    console.log("hightlight:"+num);
    for(var i = 0; i < menu.user.length; i++){
        for(var j = 0; j < menu.user.length; j++){
            if(menu.user[i][j] == num){
                for(var x = 0; x < menu.user.length; x++){
                    getGame().cell_Array[x][j].fill = 'blue';
                    getGame().cell_Array[x][j].zIndex = 'back';
                    getGame().cell_Array[i][x].fill = 'blue';
                    getGame().cell_Array[i][x].zIndex = 'back';
                }
                var count = 0;
                for(var y = 0; y < 3; y++) {
                    for(var z = 0; z < 3; z++){
                        count++;
                        getGame().cell_Array[((Math.floor(i/3)*3)+y)][((Math.floor(j/3)*3)+z)].fill = 'blue';
                        getGame().cell_Array[((Math.floor(i/3)*3)+y)][((Math.floor(j/3)*3)+z)].zIndex = 'back';
                    }
                }
            }
        }
        if(getGame().boardType === 'color')
            menu.active_Cell.parent.fill = getGame().colorMap[num];
        menu.active_Cell.parent.stroke = "5px yellow";
        menu.active_Cell.parent.zIndex = 'front';
    }
}

function solver() { // solves the puzzle
    getGame().menu.user = to_2D(getGame().inSol); // Must recreate array because of object references
    for (var i = 0; i < getGame().menu.user.length; i++)
        for (var j = 0; j < getGame().menu.user.length; j++)
            getGame().cell_Array[i][j].children[0].text = getGame().menu.user[i][j]; // assignment works, data replace is bad
    getGame().canvas.redraw();
    stopCount();
}

function checker() { // checks puzzle for correctness
    var correct = true; // bool for quick breaking and message display
    for (var i = 0; i < getGame().menu.user.length; i++)
        for (var j = 0; j < getGame().menu.user.length; j++) {
            if (getGame().solu[i][j] != getGame().menu.user[i][j] && checker) { // added checker for a little optomization 
                alert("There appears to be a probelm with you solution!");
                getGame().cell_Array[i][j].fill = 'red'; // Highlights incorrect cell
                correct = false;
                i = 99; // quick break
                break;
            }
        }
    if(correct){
        stopCount();
        alert("Congratulations, now give us your data!");
    }
    getGame().canvas.redraw();
}