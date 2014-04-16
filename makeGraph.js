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
    
    for (var i=0; i < jsonObj.length; i++) {
        var obj = jsonObj[i];
        console.log(obj.toString());
    }
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