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

	include "../includes/config.php";
	require_once 'php/simple_html_dom.php';
	require_once 'php/url_to_absolute.php';

	$x = $_GET["x"];
	$y = $_GET["y"];
	$size = $_GET["size"];
	$rotation = $_GET["rotation"];
	$name = addslashes($_GET["name"]);
	$type = $_GET["type"];
	$link = $_GET["link"];
	$url = $_GET["url"];
	
	//Find latest sequence number, id and z
	$query = "SELECT MAX(sequence), MAX(id), MAX(z) FROM content";
	$result = mysql_query($query) or die(mysql_error()); 
	$row = mysql_fetch_array($result);
	$sequence = $row['MAX(sequence)'] + 1;	//Increment Sequence
	$id = $row['MAX(id)'] + 1;	//Increment id
	$z = $row['MAX(z)'] + 1;	//Increment z
	
	if($type == 2) //WEB
	{
		$str = file_get_contents($url);
		if(strlen($str)>0){
			preg_match("/\<title\>(.*)\<\/title\>/",$str,$title);
			$name =  $title[1];
			$name =  addslashes(html_entity_decode($name, ENT_QUOTES, 'UTF-8'));
			
			$html = file_get_html($url);
			foreach($html->find('img') as $element)
			{
				$src = url_to_absolute($url, $element->src);
				$imageSize = getimagesize($src);
				if($imageSize[0] > 40 && $imageSize[1] > 40 && $imageSize[0]/$imageSize[1] > 0.3 && $imageSize[0]/$imageSize[1] < 3)
				{
					$images["$src"] = $imageSize[0] * $imageSize[1];
				}
			}
			arsort($images);
			print_r($images);
			
			foreach($images as $element)
			{
				//echo '<img src=\'' .$element[0] . '\'><br>';
			}
			$link = key(array_slice($images, 0, 1));
		}
	}
	
	//Update data in table
	$query = "INSERT INTO content (id, x, y, z, size, rotation, name, type, link, sequence, URL)
	VALUES ($id, $x, $y, $z, $size, $rotation, '$name', $type, '$link', $sequence, '$url')";
	$result = mysql_query($query) or die(mysql_error());  
	
	echo "	sequence = $sequence;
	addObject($id, $type, $x, $y, $z, $size, $rotation, '$name', '$link', '$url');"
?>
