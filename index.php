<!DOCTYPE html>
<html>
    <head>
        <title>Canvas by Cambridge Design Partnership</title>
        <style type="text/css">
            body {margin:0px; overflow: hidden;}
        </style>
        <script src="jquery-latest.js"></script>
    </head>
    <body onresize="resize();">
        <canvas id="myCanvas" width="500" height="500" style="border:0px">
            Your browser does not support the canvas element.
        </canvas>

        <script type="text/javascript" src="main.js"> </script>
        <?php
                include "security.php";

                $query = "SELECT MAX(sequence) FROM content";
                $result = mysql_query($query) or die(mysql_error()); 
                $row = mysql_fetch_array($result);
                $sequence = $row['MAX(sequence)'] + 1;
                // Retrieve all the data from the "example" table
                $result = mysql_query("SELECT * FROM content ORDER BY z")
                or die(mysql_error("Database Table Error"));  
        ?>
              
        <script type="text/javascript">
            <?php
            print "var sequence = $sequence;\n";
            
                while($row = mysql_fetch_array($result)) print ("addObject(" . $row['id'] . ", " . $row['type'] . ", " . $row['x'] . ", " . $row['y'] . ", " . $row['z'] . ", " . $row['size'] . ", " . $row['rotation'] . ", \"" . $row['link'] . "\");\n");
            ?>
        </script>
    </body>
</html>