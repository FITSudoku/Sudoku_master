var jsonObj = null;

function drawGraph() {
    var margin = {top: 10, right: 10, bottom: 100, left: 60},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;
    // Margins for drawing the graphs
    
    retrieveData();
    if (jsonObj == null) {
        alert ("Data Retrieval failed!");
    }
    
    for (var key in jsonObj) {
        var obj = jsonObj[key];
        console.log(obj[document.getElementById("mainSort").value]);
    }
    
    //Creating svg reference
    var svg = d3.select("body").append("svg")
              .attr("width", width+margin.left+margin.right)
              .attr("height", height+margin.top+margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //Creating the y scale for the dataset. Using a logarithmic function for now
    var yScale = d3.scale.linear()
                 .domain(0, d3.max(jsonObj, function(d) {
                     return d["time taken"]
                 }))
                 .range([height, 0]);
    
    var formatAsInt = d3.format(",d");
    
    var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .tickFormat(formatAsInt);
    
    //Scale for sub attribute
    var x0Scale = d3.scale.ordinal()
                  .rangeRoundBands([0, width], 0.1);
    
    //Scale for main attribute
    var x1Scale = d3.scale.ordinal();
    
    //Colors for the main attribute
    var color = d3.scale.linear()
                .range(["#aad", "#556"]);
    
    var xAxis = d3.svg.axis()
                .scale(x0Scale)
                .orient("bottom");
    
    
    
}

function retrieveData() {
    var m = document.getElementById("mainSort").value;
    var s = document.getElementById("subSort").value;
    console.log("Requesting main Sorter: " + m + "Requesting sub sorter: " + s);
    $.ajax({
        url: "getData.php?main="+m+"&sub="+s,
        type:"GET",
        async: false,
        dataType: "json",
        success: function(response) {
            jsonObj = response;;
        }
    });
   return true;
}