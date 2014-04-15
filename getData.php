<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

if(!isset($_GET['main']) || !isset($_GET['sub'])){
    error_log("missing {$_GET['main']} or {$_GET['sub']}");
    exit();
}
$main = $_GET['main'];
$sub = $_GET['sub'];
error_log("passed main:".$main);
error_log("passed sub:".$sub);

$con = mysqli_connect("sudokuproject.mylha.com","edhjtylp_submit","SubmitData1!","edhjtylp_test");
if (!$con){
    error_log('Could not connect: ' . mysqli_error($con));
  }

$sql = "SELECT '$main', '$sub', AVG(`time taken`) FROM `ResultsF` GROUP BY '$main', '$sub'";
$result = mysqli_query($con,$sql);

if(mysqli_num_rows($result) < 1){
    mysqli_close($con);
    error_log("Query failed or insufficient data");
    exit();
}

$rows = array();

while($r = myqli_fetch_assoc($result)) {
    $rows[] = $r;
}

$result->free();
mysqli_close($con);
$jsonE = json_encode($rows);
error_log("json:".$jsonE);
echo $jsonE
?>