<?php
	include "security.php";

	$x = $_GET["x"];
	$y = $_GET["y"];
	$size = $_GET["size"];
	$rotation = $_GET["rotation"];
	$name = $_GET["name"];
	$type = $_GET["type"];
	$link = $_GET["link"];
	
	//Find latest sequence number, id and z
	$query = "SELECT MAX(sequence), MAX(id), MAX(z) FROM content";
	$result = mysql_query($query) or die(mysql_error()); 
	$row = mysql_fetch_array($result);
	$sequence = $row['MAX(sequence)'] + 1;	//Increment Sequence
	$id = $row['MAX(id)'] + 1;	//Increment id
	$z = $row['MAX(z)'] + 1;	//Increment z
	
	//Update data in table
	$query = "INSERT INTO content (id, x, y, z, size, rotation, name, type, link, sequence)
	VALUES ($id, $x, $y, $z, $size, $rotation, '$name', $type, '$link', $sequence)";
	$result = mysql_query($query) or die(mysql_error());  
	
	echo "	sequence = $sequence;
	addObject($id, $type, $x, $y, $z, $size, $rotation, '$name', '$link');"
?>
