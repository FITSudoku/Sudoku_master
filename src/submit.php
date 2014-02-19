<?php
    require once 'login.php';
    $db_server = mysql_connect($db_hostname, $db_username, $db_password);
   
    if (!$db_server) die("Unable to connect to MySQL: " . mysql_error());
    
    mysql_select_db($db_database, $db_server)
        or die("Unable to select database: " . mysql_error());

    if (isset($_POST[age]) &&
        isset($_POST[gender]) &&
        isset($_POST[education]) &&
        isset($_POST[experience])) 
    {
        $age = get_post('age');
        $gender = get_post('gender');
        $education = get_post('education');
        $experience = get_post('experience');
    }
?>