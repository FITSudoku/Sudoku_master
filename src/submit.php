<?php
function submit() {
    $con = mysqli_connect("sudokuproject.mylha.com","edhjtylp_submit","SubmitData1!","edhjtylp_test");
   
    if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
        } else {

        if (isset($_POST[age]) &&
            isset($_POST[gender]) &&
            isset($_POST[education]) &&
            isset($_POST[experience])) 
        {
            $age = get_post('age');
            $gender = get_post('gender');
            $education = get_post('education');
            $experience = get_post('experience');
            $puzzleid = 3;
            $timetaken = 22;

            mysqli_query($con, "INSERT INTO `Results`(`puzzleID`, `age`, `time taken`, `gender`, `education`, `experience`)
            VALUES('$puzzleid', '$age', '$timetaken', '$gender', '$education', '$experience');");

            mysqli_close($con);
        }
    }
}
?>