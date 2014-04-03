<?php 
error_reporting(E_ALL);
ini_set('display_errors', '1');
?>
<html>
    <script src="lib/jquery-2.1.0.min.js"></script>
<body>
    Hi, you are in upload.php!<br>
<?php
function upload() {
    echo "Started submit<br>";
    
    $con = mysqli_connect("sudokuproject.mylha.com","edhjtylp_submit","SubmitData1!","edhjtylp_test");
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
        goHome($con);
    } //check connection status
    echo "Connected<br>";
    
    $data=json_decode($_POST['upload']); // get data
    $rate=json_decode($_POST['diffRating']);
    if (!isset($_POST['upload']) ||
            !isset($_POST['diffRating'])){
        echo "Upload Data Error<br>";
        goHome($con);
    } //check data passed in
    echo "Data Good<br>";

    foreach($data as $value){
        echo "$value <br>";
    } // print data
    
    for($i=0;$i<count($data);$i++){
        uploadData(&$con,$rate,$data[$i],$data[$i+1]);
        $i++;
    } //upload data
    
    echo "Data uploaded!";
    goHome($con);    
     
}
function goHome(&$data = null){
    if ($data != null){
    mysqli_close($data);
    }
    header('Location: http://sudokuproject.mylha.com/index.html');
    exit();
} // go back to home page

function uploadData(&$con,$diff,$puz,$sol){
    mysqli_query($con, "INSERT INTO `PuzzlesAuto`(`difficulty`, `givens`, `solution`)
        VALUES ('$diff','$puz',$sol);");
} // upload puzzles to database

if(true){
   upload();
} //calls main method on start
?>
</body>
</html>