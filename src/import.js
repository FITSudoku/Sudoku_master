window.onload = function () {
   var fileInput = document.getElementById('fileInput');

   fileInput.addEventListener('change', function (e) {
       var file = fileInput.files[0];
       var textType = /text.*/;
       
       if (file.type.match(textType)) {
           var reader = new FileReader();
           reader.onload = function (e) {
               var importType = reader.result.split("\n")[1].trim(); // gets difficulty of file input
               console.log("Import Puzzle Type:"+importType);
               var diff = document.getElementById('diffRating');
               switch(importType){ // set diff value
                    case 'Very Easy':
                       alert("Uploading: Very Easy");
                       diff = 0;
                       break;
                    case 'Easy':
                       alert("Uploading: Easy");
                       diff = 1;
                       break;
                    case 'Middle':
                       alert("Uploading: Middle");
                       diff = 2;
                       break ;
                    case 'Hard':
                       alert("Uploading: Hard");
                       diff = 3;
                       break;
                    case 'Very Hard':
                       alert("Uploading: Very Hard");
                       diff = 4;
                       break;
                    default:
                       alert("Invalid file!");
                       diff = 5;
                       return;
               } //set diff value
               var allPuzzles = reader.result.replace(/[^(1-9)\.]/g,''); //remove +-|(whitespace)
               allPuzzles = allPuzzles.match(/(\.|[1-9]){81}/g);
               var upload = document.getElementById('upload');
               
               diffRating.value = JSON.stringify(diff);
               upload.value = JSON.stringify(allPuzzles);
    
               console.log(allPuzzles);
            };
           var t = reader.readAsText(file);
           //Reads the file in as a single string
       } else {
           alert("File not supported!");
       }
   });
};


