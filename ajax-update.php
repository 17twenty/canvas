<?php

// Make a MySQL Connection
mysql_connect("localhost", "canvas", "password") or die(mysql_error("Database Connection Error"));
mysql_select_db("canvas") or die(mysql_error("Database Selection Error"));

// Retrieve all the data from the "example" table
$id = $_GET["id"];
$x = $_GET["x"];
$y = $_GET["y"];
$z = $_GET["z"];
$size = $_GET["size"];
$rotation = $_GET["rotation"];

$query = "UPDATE content SET x='$x', y='$y', z='$z', size='$size', rotation='$rotation' WHERE id='$id'";
$result = mysql_query($query)
or die(mysql_error());  
?>
