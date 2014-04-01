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
    echo "Tried connection<br>";
    
    $data=json_decode($_POST['upload']);
    
    foreach($data as $value){
        echo "$value <br>";
    }
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    } else if (false) {
        echo "<br>Didn't fail connection<br>";
        if (false) 
        {
            mysqli_query($con, "INSERT INTO `Results`(`puzzleID`, `age`, `time taken`, `gender`, `education`, `experience`)
            VALUES('$puzzleid', '$age', '$timetaken', '$gender', '$education', '$experience');");
            mysqli_close($con);
            header('Location: http://sudokuproject.mylha.com/index.html');
            exit();
        } else {
            echo "Could not find all data";
        }
    }
}

if(true)
{
   upload();
}
?>
</body>
</html>