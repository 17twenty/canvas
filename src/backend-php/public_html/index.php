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
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
<title>Canvas by Cambridge Design Partnership</title>
<style type="text/css">
body {
	margin: 0px;
	overflow: hidden;
}
</style>
<link rel="stylesheet" href="css/general.css" type="text/css"
	media="screen" />
<!-- <script type="text/javascript" src="https://www.google.com/jsapi"></script> -->
<script src="scripts/jquery-latest.js" type="text/javascript"></script>

<script type="text/javascript" src="scripts/apprise-1.5.full.js"></script>
<link rel="stylesheet" href="css/apprise.css" type="text/css" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body onresize="resize();">
	<canvas id="myCanvas" width="500" height="500" style="border: 0px">
    	Your browser does not support the canvas element.
    </canvas>
	<div id="popupContact">
		<a id="popupContactClose">x</a>
		<?php include "add-item.php"; ?>
	</div>
	<div id="backgroundPopup"></div>
	<input id="fileupload" type="file" name="files[]" multiple />
 	<script src="scripts/jquery.min.js" type="text/javascript"></script>
 	<script src="scripts/jquery-ui.min.js" type="text/javascript"></script>
	<script src="scripts/jquery.iframe-transport.js" type="text/javascript"></script>
	<script src="scripts/jquery.fileupload.js" type="text/javascript"></script>
	<script src="scripts/popup.js" type="text/javascript"></script>

	<script type="text/javascript" src="scripts/main.js"> </script>
	
	
        <?php
                include "../includes/config.php";

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
            
                while($row = mysql_fetch_array($result)) print ("addObject(" . $row['id'] . ", " . $row['type'] . ", " . $row['x'] . ", " . $row['y'] . ", " . $row['z'] . ", " . $row['size'] . ", " . $row['rotation'] . ", \"" . $row['name'] . "\", \"" . $row['link']. "\", \"" . $row['URL'] . "\");\n");
            ?>
        </script>

</body>
</html>
