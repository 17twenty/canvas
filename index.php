<!DOCTYPE html>
<!--  
Copyright 2011 Cambridge Design Research LLP.
All rights reserved.

This file is part of Canvas.
Canvas is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Canvas is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU General Public License
along with Canvas.  If not, see <http://www.gnu.org/licenses/>.

Alternatively, this file may be used in accordance with the terms and 
conditions contained in a signed written agreement between you and 
Cambridge Design Research LLP.
-->
<html>
    <head>
        <title>Canvas by Cambridge Design Partnership</title>
        <style type="text/css">
            body {margin:0px; overflow: hidden;}
        </style>
        <link rel="stylesheet" href="general.css" type="text/css" media="screen" />
        <script type="text/javascript" src="https://www.google.com/jsapi"></script>
        <script src="jquery-latest.js"></script>

    </head>
    <body onresize="resize();">
        <canvas id="myCanvas" width="500" height="500" style="border:0px">
            Your browser does not support the canvas element.
        </canvas>
        
        
<input id="fileupload" type="file" name="files[]" multiple>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"></script>
<script src="jquery.iframe-transport.js"></script>
<script src="jquery.fileupload.js"></script>
<script src="popup.js" type="text/javascript"></script>

        <script type="text/javascript" src="main.js"> </script>
        <?php
                include "security.php";

                $query = "SELECT MAX(sequence) FROM content";
                $result = mysql_query($query) or die(mysql_error()); 
                $row = mysql_fetch_array($result);
                $sequence = $row['MAX(sequence)'];
                // Retrieve all the data from the "example" table
                $result = mysql_query("SELECT * FROM content ORDER BY z")
                or die(mysql_error("Database Table Error"));  
        ?>
              
        <script type="text/javascript">
            <?php
            print "var sequence = $sequence;\n";
            
                while($row = mysql_fetch_array($result)) print ("addObject(" . $row['id'] . ", " . $row['type'] . ", " . $row['x'] . ", " . $row['y'] . ", " . $row['z'] . ", " . $row['size'] . ", " . $row['rotation'] . ", \"" . $row['name'] . "\", \"" . $row['link'] . "\");\n");
            ?>
        </script>

	<div id="popupContact">
		<a id="popupContactClose">x</a>
		<iframe src="add-item.php" width="100%"
			height="300"> You browser doesn't support iframes </iframe>
	</div>
	<div id="backgroundPopup"></div>

</body>
</html>