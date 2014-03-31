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
               switch(importType){
                    case 'Very Easy':
                       alert("Uploading: Very Easy");
                       //php upload somewhere around here!!!!!!!!!!
                       break;
                    case 'Easy':
                       alert("Uploading: Easy");
                       break;
                    case 'Middle':
                       alert("Uploading: Middle");
                       break ;
                    case 'Hard':
                       alert("Uploading: Hard");
                       break;
                    case 'Very Hard':
                       alert("Uploading: Very Hard");
                       break;
                    default:
                       alert("Invalid file!");
                       return;
               }
               var allPuzzles = reader.result.replace(/[^(1-9)\.]/g,''); //remove +-|(whitespace)
               allPuzzles = allPuzzles.match(/(\.|[1-9]){81}/g);
               console.log(allPuzzles);
            };
           var t = reader.readAsText(file);
           //Reads the file in as a single string
       } else {
           alert("File not supported!");
       }
   });
};


