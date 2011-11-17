<?php
// Make a MySQL Connection
mysql_connect("localhost", "canvas", "password") or die(mysql_error("Database Connection Error"));
mysql_select_db("canvas") or die(mysql_error("Database Selection Error"));
?>