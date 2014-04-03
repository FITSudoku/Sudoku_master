<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

if(!isset($_GET['p'])){
    exit();
}
$diff = intval($_GET['p']);

$con = mysqli_connect("sudokuproject.mylha.com","edhjtylp_submit","SubmitData1!","edhjtylp_test");
if (!$con){
    die('Could not connect: ' . mysqli_error($con));
  }

$sql = "SELECT * FROM `PuzzlesAuto` WHERE `difficulty` = '$diff' ORDER BY RAND() LIMIT 0,1;";
$result = mysqli_query($con,$sql);
if(mysqli_num_rows($result) != 1){
    mysqli_close($con);
    exit()
}
$row = myaqli_fetch_array($result);

?>
<script>
    var dbID = <?php echo $row[0] ?>;
    var dbDiff = <?php echo $row[1] ?>;
    var dbGivens = <?php echo $row[2] ?>;
    var dbSolution = <?php echo $row[3] ?>;
</script>
<?php
mysqli_close($con);
?>