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

function hover(canvas, menu, index, jndex) {
    menu.hover_i = index;
    menu.hover_j = jndex;
    if(getGame().given[index][jndex]){
      menu.mouse_Obj.moveTo(0,canvas.height);  
    }
    else if (menu.xBox_Check)
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
            console.log("I:J",menu.hover_i,menu.hover_j);
            menu.hover_Cell.children[0].text = ' ';
            getGame().menu.user[menu.hover_i][menu.hover_j] = ' ';
            menu.constraints = find_constraints(menu,menu.hover_i, menu.hover_j);
            canvas.redraw(); // prevents removal lag
        });
    }
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
            if (getGame().autoSweep) //Only add numbers that are not constrained
                if (!menu.constraints[num]){
                    color = 'blue';
                    if(getBoardType() === 'color')
                        color = getColorMap()[num];
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
    var num = (j * 3) + i + 1;
    if(getBoardType() === 'color')
        boxColor = getColorMap()[num];
    if(getBoardType() === 'symbol' || getBoardType() === 'letter')
        num = getSymbolMap()[num];
    var menu_Cell = canvas.display.rectangle({
        x: x, //center of cell
        y: y,
        origin: {
            x: "center",
            y: "center"
        },
        width: canvas.width / (menu.user.length * 3),
        height: canvas.width / (menu.user.length * 3),
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
        text: num,
        fill: color
    });
    menu.active_Cell.parent.fill = '';
    menu_Cell.addChild(menu_Cell_Text);
    menu.obj.addChild(menu_Cell);
    menu_Cell.bind("click tap", function () { // click bind for small menu
        if(color === 'white'){
            if(getBoardType() === 'symbol'  || getBoardType() === 'letter'){
                menu.active_Cell.text = getSymbolMap()[this.text]; //sets new value for cell
            }else{
                menu.active_Cell.text = this.text; //sets new value for cell
            }
            menu.user[index][jndex] = this.text; // edits user board for new value
        }
        
        if(getBoardType() === 'color')
            menu.active_Cell.parent.fill = getColorMap()[menu.user[index][jndex]];
        menu.obj.remove(); // removes dummy+childrne menu from disp
        menu.check = false;
    });
}

