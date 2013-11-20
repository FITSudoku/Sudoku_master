var canvas;

function Main() {
    var cSize = 500;
    var padding = 2;
    canvas = oCanvas.create({
        canvas: "#canvas",
        background: "#000",
        fps: 60,
    });
    
    var hi = "Hello World!";
    var boxes = [];
    for (var i = 0; i < 9; i++) {
        boxes[i] = canvas.display.rectangle({
            x: (i%3)*(cSize/3) + padding,
            y: Math.floor(i/3)*(cSize/3) + padding,
            width: (cSize/3) - padding*2,
            height: (cSize/3) - padding*2,
            fill: "#0aa",
            stroke: "outside 2px rgba(0, 0, 0, 0.9)" 
        });
    }
    for (var i = 0; i < boxes.length; i++) {
//        var writing = canvas.display.text({
//            x: boxes[i].width/2,
//            y: boxes[i].height/2,
//            origin: {x: "center", y: "top" },
//            font: "bold 20px sans-serif",
//            text: hi,
//            fill: "#000"
//        });
//        boxes[i].addChild(writing);
        canvas.addChild(boxes[i]);
    }
    
    for (i = 0; i < boxes.length; i++) {
        boxes[i].bind("click tap", function () {
            var selectionBox = canvas.display.rectangle({
                x: 0,
                y: 0,
                width: this.width,
                height: this.height,
                fill:  "hsl(" + Math.random() * 360 + ", 50%, 50%)"
            });
        var selections = [];
        for (var i = 0; i < 9; i++) {
            selections[i] = canvas.display.rectangle({
                x: (i%3)*(selectionBox.width/3) + padding/2,
                y: Math.floor(i/3)*(selectionBox.height/3) + padding/2,
                width: (selectionBox.width/3) - padding,
                height: (selectionBox.height/3) - padding,
            });
            selections[i].addChild(canvas.display.text({
                x: selections[i].width/2,
                y: selections[i].height/2,
                origin: {x: "center", y: "top" },
                font: "bold 10px sans-serif",
                text: i+1,
                fill: "black"
            }));
            selectionBox.addChild(selections[i]);
        }
            this.addChild(selectionBox);
            canvas.redraw();
        }); 
    }
}

function addSelectionBox () {
    var selectionBox = canvas.display.rectangle({
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        fill:  "hsl(" + Math.random() * 360 + ", 50%, 50%)"
    });
    var selections = [];
    for (var i = 0; i < 9; i++) {
        selections[i] = canvas.display.rectangle({
            x: (i%3)*(selectionBox.width/3) + padding/2,
            y: Math.floor(i/3)*(selectionBox.height/3) + padding/2,
            width: (selectionBox.width/3) - padding,
            height: (selectionBox.height/3) - padding,
        });
        selections[i].addChild(canvas.display.text({
            x: selections[i].width/2,
            y: selections[i].height/2,
            origin: {x: "center", y: "top" },
            font: "bold 10px sans-serif",
            text: i+1,
            fill: "black"
        }));
        selectionBox.addChild(selections[i]);
    }
    this.addChild(selectionBox);
    canvas.redraw();
}