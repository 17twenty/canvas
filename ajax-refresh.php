<?php
	include "security.php";

    $sequence = $_GET["sequence"];
    
	//Find latest sequence number
    $query = "SELECT MAX(sequence) FROM content";
    $result = mysql_query($query) or die(mysql_error()); 
    $row = mysql_fetch_array($result);
    $newsequence = $row['MAX(sequence)'];
	
	//Check for any new data based on sequence number
    $query = "SELECT * FROM content WHERE sequence>'$sequence' ORDER BY z ";
    $result = mysql_query($query)
    or die(mysql_error());  
    while($row = mysql_fetch_array($result))
    {
        print "
        if (sequence < $sequence)
        {
	        var l = objects.length;
	        for (var i = l-1; i >= 0; i--)
			{
	            if(objects[i].id == " . $row['id'] . ") 
	            {
	                console.log(\"Object " . $row['id']. " changed!\");
	                objects[i].x = " . $row['x'] . ";
	                objects[i].y = " . $row['y'] . ";
	                objects[i].z = " . $row['z'] . ";
	                objects[i].size = " . $row['size'] . ";
	                objects[i].rotation = " . $row['rotation'] . ";
	            }
	        }
        }
        ";
    }
    print "sequence = $newsequence;
    render();\n"
    
?>
