<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

if(!isset($_GET['p'])){
    error_log("diff valud not set {$_GET['p']}");
    exit();
}
$diff = intval($_GET['p']);
error_log("passed diff:".$diff);
$con = mysqli_connect("sudokuproject.mylha.com","edhjtylp_submit","SubmitData1!","edhjtylp_test");
if (!$con){
    error_log('Could not connect: ' . mysqli_error($con));
  }

$sql = "SELECT * FROM `PuzzlesAuto` WHERE `difficulty` = '$diff' ORDER BY RAND() LIMIT 0,1;";
$result = mysqli_query($con,$sql);
if(mysqli_num_rows($result) != 1){
    mysqli_close($con);
    error_log("returned rows fail");
    exit();
}
$row = mysqli_fetch_assoc($result);
$result->free();
mysqli_close($con);
$jsonE = json_encode($row);
error_log("json:".$jsonE);
echo $jsonE
?>