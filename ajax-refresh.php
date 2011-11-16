<?php
    // Make a MySQL Connection
    mysql_connect("localhost", "canvas", "password") or die(mysql_error());
    mysql_select_db("canvas") or die(mysql_error());

    // Retrieve all the data from the "example" table
    $result = mysql_query("SELECT * FROM content ORDER BY z")
    or die(mysql_error());  
    while($row = mysql_fetch_array($result)) print ("addObject(" . $row['id'] . ", " . $row['type'] . ", " . $row['x'] . ", " . $row['y'] . ", " . $row['z'] . ", " . $row['size'] . ", " . $row['rotation'] . ", \"" . $row['link'] . "\");\n");
?>
