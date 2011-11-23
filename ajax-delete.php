<?php 
include "security.php";

$id = $_GET["id"];

//Delete element
$query = "DELETE FROM content WHERE id='$id'";
$result = mysql_query($query) or die(mysql_error());
$row = mysql_fetch_array($result);

?>