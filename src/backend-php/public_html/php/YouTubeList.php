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

include "../../includes/config.php";

//Grab YouTube Queue
$query = "SELECT * FROM youtube";
$result = mysql_query($query)
or die(mysql_error());  
while($row = mysql_fetch_array($result))
{
	$vidID = $row['v'];
	$url = "http://gdata.youtube.com/feeds/api/videos/". $vidID;
	$doc = new DOMDocument;
	$doc->load($url);
	$title = $doc->getElementsByTagName("title")->item(0)->nodeValue;
	$content = $doc->getElementsByTagName("content")->item(0)->nodeValue;
	
	if (strlen($content) > 100)
	$content = substr($content, 0, strrpos(substr($content, 0, 100), ' ')) . '...';
	
	print "<img style='float:left' src='http://img.youtube.com/vi/". $vidID ."/2.jpg' height='50' />";
	print "<div class='YouTubeContent'><b>" . $title . "</b><br/>" . $content . "</div>";
	print "<br/>";
	
	
}
//$url = "http://www.youtube.com/get_video_info?&video_id=G0k3kHtyoqc";
//account_playback_token=&shortform=True&allow_embed=1&ad_host_tier=439818&rvs=view_count%3D4%252C452%26author%3DJesusLoverJesus123%26length_seconds%3D245%26id%3DYXxk9GcGSxY%26title%3DRevival%2Bfire%2Bfall%2B%255BWorship%255D%2Cview_count%3D30%252C258%26author%3DHisWayChurch%26length_seconds%3D89%26id%3Dx6LCBC2oNZ0%26title%3DRevival%2BFire%2BFalls%2Bat%2BHis%2BWay%2BChurch%2Bw%252F%2BRob%2BDeLuca%2Cview_count%3D4%252C952%26author%3Dellettsvillehope%26length_seconds%3D503%26id%3DcXbf5pfF6wc%26title%3DPraise%2B%2526%2BWorship%2B%2522Revival%2BFire%2BFall%2522%2B11%252F22%252F2009%2Cview_count%3D78%252C714%26author%3DTrueMinistries%26length_seconds%3D299%26id%3DU0ZBoTuwrGg%26title%3DLet%2BYour%2BFire%2BFall%2Cview_count%3D29%252C131%26author%3Dshazfun%26length_seconds%3D302%26id%3DrgHKKLopKik%26title%3DSend%2Bthe%2BFire%2Cview_count%3D24%252C294%26author%3D810bowman1190%26length_seconds%3D73%26id%3DFHZBgRPGcJE%26title%3DBrownsville%2BRevival%253A%2BRevival%2BFire%2BFall%2Cview_count%3D39%252C730%26author%3DTrueMin
//$page = @file_get_contents($url);
//$decode = urldecode($page);
//$doc = new DOMDocument;
//$doc->load($url);
//print $decode;
//print $pagejson;

?>