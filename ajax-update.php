<?php
	include "security.php";

	$id = $_GET["id"];
	$x = $_GET["x"];
	$y = $_GET["y"];
	$z = $_GET["z"];
	$size = $_GET["size"];
	$rotation = $_GET["rotation"];

	//Find latest sequence number
	$query = "SELECT MAX(sequence) FROM content";
	$result = mysql_query($query) or die(mysql_error()); 
	$row = mysql_fetch_array($result);
	$sequence = $row['MAX(sequence)'] + 1;	//Increment Sequence
	
	//Update data in table
	$query = "UPDATE content SET x='$x', y='$y', z='$z', size='$size', rotation='$rotation', sequence='$sequence' WHERE id='$id'";
	$result = mysql_query($query) or die(mysql_error());  
	echo $sequence;							//Return sequence to main program
?>
