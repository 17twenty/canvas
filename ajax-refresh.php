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
        if (sequence < $newsequence)
        {
	        var l = objects.length;
	        var isnew = true;
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
	                isnew = false;
	            }
	        }
	        if (isnew)  addObject(" . $row['id']. ", " . $row['type']. ", " . $row['x']. ", " . $row['y']. ", " . $row['z']. ", " . $row['size']. ", " . $row['rotation']. ", \"" . $row['name']. "\", \"" . $row['link']. "\") ;
        }
        ";
    }
    
    //Check for deleted items
    print "
    var elements = [];\n";
    $query = "SELECT * FROM content ORDER BY z ";
    $result = mysql_query($query)
    or die(mysql_error());
    while($row = mysql_fetch_array($result))
    {
    	print "elements.push(".$row['id'].");\n";
    }
    
    print "
    
    function contains(a, obj) {
	    for (var j in a) 
	    {
	    	//console.log(a[j] + \" == \" + obj);
	       if (a[j] == obj) 
	       {
	           return true;
	       }
	    }
	    return false;
    }
    var i;
    for (var i in objects)
    {
    	//console.log(i);
    	//console.log(objects[i].id);
    	if (contains(elements, objects[i].id) == false) 
    	{
    		console.log(\"Object \" + objects[i].id + \" was deleted elsewhere, removing object\");
    		objects.splice(i, 1);
		}
	}
    sequence = $newsequence;
    objects.sort(sortNumber);
    render();\n"
    
?>
