<? php
/******************************************************************************
 *
 * Copyright (c) 2011 Cambridge Design Partnership
 * All rights reserved.
 * 
 * This file is part of the Canvas Project
 *
 * Commercial Usage
 * Licensees holding a commercial license for the Canvas Project are provided
 * with the rights agreed when taking out this license and are bound to these
 * terms in perpetuity.
 *
 * GNU Lesser General Public License Usage
 * Alternatively, this file may be used under the terms of the GNU Lesser
 * General Public License version 2.1 as published by the Free Software
 * Foundation and appearing in the file LICENSE.LGPL included in the
 * packaging of this file.
 * Please review the following information to ensure the GNU Lesser General
 * Public License version 2.1 requirements will be met:
 * http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
 *
 ******************************************************************************/
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Canvas by Cambridge Design Partnership</title>
        <style type="text/css">
            body {margin:0px; overflow: hidden;}
        </style>
        <script src="http://code.jquery.com/jquery-latest.js"></script>
    </head>
    <body onresize="resize();">
        <canvas id="myCanvas" width="500" height="500" style="border:0px">
            Your browser does not support the canvas element.
        </canvas>

        <script type="text/javascript" src="main.js"> </script>
        <?php
                // Make a MySQL Connection
                mysql_connect("localhost", "canvas", "password") or die(mysql_error("Database Connection Error"));
                mysql_select_db("canvas") or die(mysql_error("Database Selection Error"));

                // Retrieve all the data from the "example" table
                $result = mysql_query("SELECT * FROM content ORDER BY z")
                or die(mysql_error("Database Table Error"));  
        ?>
              
        <script type="text/javascript">
            <?php
                while($row = mysql_fetch_array($result)) print ("addObject(" . $row['id'] . ", " . $row['type'] . ", " . $row['x'] . ", " . $row['y'] . ", " . $row['z'] . ", " . $row['size'] . ", " . $row['rotation'] . ", \"" . $row['link'] . "\");\n");
            ?>
        </script>
    </body>
</html>