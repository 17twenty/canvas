<?php
/* Copyright 2011 Cambridge Design Research LLP.
* All rights reserved.
*
* This file is part of Canvas.
* Canvas is free software: you can redistribute it and/or modify
* it under the terms of the GNU Lesser General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* Canvas is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Lesser General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with Canvas.  If not, see <http://www.gnu.org/licenses/>.
*
* Alternatively, this file may be used in accordance with the terms and
* conditions contained in a signed written agreement between you and
* Cambridge Design Research LLP.
*/

// Make a MySQL Connection
mysql_connect("localhost", "canvas", "password") or die(mysql_error("Database Connection Error"));
mysql_select_db("canvasbeta") or die(mysql_error("Database Selection Error"));
?>
