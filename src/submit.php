<html>
<body>
<?php
function submit() {
    echo "Started submit";
    $con = mysqli_connect("sudokuproject.mylha.com","edhjtylp_submit","SubmitData1!","edhjtylp_test");
    echo "Tried connection";
    if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
        } else {
        echo "Didn't fail connection";
        if (isset($_POST['age']) &&
            isset($_POST['gender']) &&
            isset($_POST['education']) &&
            isset($_POST['experience'])) 
        {
            echo "ISSET completed";
            $age = $_POST['age'];
            $gender = $_POST['gender'];
            $education = $_POST['education'];
            $experience = $_POST['experience'];
            $puzzleid = $_POST['puzzid'];
            $timetaken = $_POST['time'];
            
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
   echo "Found true statement";
   submit();
}
?>
</body>
</html>