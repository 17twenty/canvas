<?php
    // Make a MySQL Connection
    mysql_connect("localhost", "canvas", "password") or die(mysql_error());
    mysql_select_db("canvas") or die(mysql_error());

    $sequence = $_GET["sequence"];
    
    $query = "SELECT MAX(sequence) FROM content";
    $result = mysql_query($query) or die(mysql_error()); 
    $row = mysql_fetch_array($result);
    $newsequence = $row['MAX(sequence)'];
    // Retrieve all the data from the "example" table
    $query = "SELECT * FROM content WHERE sequence>'$sequence' ORDER BY z ";
    $result = mysql_query($query)
    or die(mysql_error());  
    while($row = mysql_fetch_array($result))
    {
        print "
        console.log(\"" . $row['id'] . "\");
        var l = objects.length;
        for (var i = l-1; i >= 0; i--)
	{
            if(objects[i].id == " . $row['id'] . ") 
            {
                console.log(\"Found object\");
                objects[i].x = " . $row['x'] . ";
                objects[i].y = " . $row['y'] . ";
                objects[i].z = " . $row['z'] . ";
                objects[i].size = " . $row['size'] . ";
                objects[i].rotation = " . $row['rotation'] . ";
            }
        }
        ";
    }
    print "sequence = $newsequence;
    render();\n"
    
?>
