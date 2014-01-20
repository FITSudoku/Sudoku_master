
function highlight(menu,num,game){
    game.canvas.removeChild(menu.obj);
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
                for(var y = 0; y < 3; y++) {
                    for(var z = 0; z < 3; z++){
                        count++;
                        game.cell_Array[((Math.floor(i/3)*3)+y)][((Math.floor(j/3)*3)+z)].fill = 'blue';
                        game.cell_Array[((Math.floor(i/3)*3)+y)][((Math.floor(j/3)*3)+z)].zIndex = 'back';
                    }
                }
            }
        }
        if(game.boardType === 'color')
            menu.active_Cell.parent.fill = game.colorMap[num];
        menu.active_Cell.parent.stroke = "5px yellow";
        menu.active_Cell.parent.zIndex = 'front';
    }
}