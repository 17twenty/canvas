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


?>
<script type="text/javascript" >
function UploadImage()
{
	document.getElementById('fileupload').click();
	disablePopup();
}

var youtube;

function validateForm(id)
{
	console.log("YouTube " + id);
	ytvbp.hideMainSearch();
	document.getElementById('searchResults').innerHTML = "<b>Downloading ... Please Wait</b> <img src='images/throbber.gif' />";

	$.get('php/YouTube/YouTube_Info.php?url='+id, function(data) { // Get initial YouTube info
		youtube = JSON.parse(data);
		document.getElementById('searchResults').innerHTML = "<img style='float:left' src='"+youtube.thumbnail+"' height='50'><div style='width:10px; float:left'>&nbsp;</div><div class='YouTubeContent'><b>" +youtube.title+ "</b><br/>"+youtube.description+"<br/><b>Downloading ... Please Wait</b> <img src='images/throbber.gif' /></div>";
		YouTube_Progress_Function=setInterval(function() {
			$.get('objects/'+youtube.id+'.webm.progress.json', function(youtube_progress) {
				document.getElementById('searchResults').innerHTML = "<img style='float:left' src='"+youtube.thumbnail+"' height='50'><div style='width:10px; float:left'>&nbsp;</div><div class='YouTubeContent'><b>" +youtube.title+ "</b><br/>"+youtube.description+"<br/><b>Downloading "+youtube_progress[0]+" ... ETA: "+youtube_progress[1]+"</b> <img src='images/throbber.gif' /></div>";
			});
		},2000);
		$.ajax({	// Start the download
			type: "GET",
			url: "php/YouTube/YouTube_Download.php",
			data: {url: id},
			datatype: "json",
			success: function(response){ 
				clearTimeout(YouTube_Progress_Function);
				var youtube = JSON.parse(response);
				if(youtube.error == null)
				{
					type = VIDEO;
					$.ajax({
						type: "GET",
						url: "ajax-insert.php",
						data: {
							x: 0.5,
							y: 0.5,
							size: 0.2,
							rotation: ((Math.random()*60)-30),
							name: youtube.title,
							type: type,
							link: "objects/"+youtube.filename
						},
						dataType: "script",
						success: function(e){
						}
					});
					disablePopup();
					setTimeout("PopupMain()",2500);
				}
				else
				{
					document.getElementById('searchResults').innerHTML = "<b>Download Failed - Clip does not contain a WEBM format video.  YouTube are slowly converting all videos to WEBM format, so perhaps try again another day?";
				}
			}
		});
		});
}

function validateFormWeb(form)
{
	type = WEB;
	url = form.target.URL.value;
	document.getElementById('ExtraContent').innerHTML = "<img src='images/throbber.gif' /> <b>Analysing Images</b>";
	


	
	$.ajax({
		type: "GET",
		url: "ajax-insert.php",
		data: {
			x: 0.5,
			y: 0.5,
			size: 0.2,
			rotation: ((Math.random()*60)-30),
			name: "Temp Title",
			type: type,
			link: "images/news.png",
			url: url
		},
		//dataType: "script",
		success: function(){
			disablePopup();
			setTimeout("PopupMain()",2500);
			}
	});
}


function YouTube()
{
	$.ajax({
	  type: "GET",
	  url: "php/YouTube/YouTube.php",
	  datatype: "html",
	  success: function(html){ document.getElementById('popupFrame').innerHTML = html; }
	});

	var popupHeight = $("#popupContact").height();
	var popupWidth = $("#popupContact").width();
}

function WebLink()
{
	$.ajax({
	  type: "GET",
	  url: "php/addWebLink.php",
	  datatype: "html",
	  success: function(html){ document.getElementById('popupFrame').innerHTML = html; }
	});
}

function PopupMain()
{

	console.log("Back");
	$.ajax({
	  type: "GET",
	  url: "add-item.php",
	  datatype: "html",
	  success: function(html){ document.getElementById('popupFrame').innerHTML = html; }
	});
}
</script>

<div id="popupFrame">
	<div id="menu">
		<h1>Add new item</h1>
		<br/><br/>
		<div align="center">
		<table border=0 cellspacing=5>
			<tr>
				<td><div align='center'><a href='#' onClick="UploadImage();"><img src='images/picture.png' /></a></div></td>
				<td width='100px'></td>
				<td><div align='center'><a href='#' onClick="YouTube();"><img src='images/YouTube.png' /></a></div></td>
				<td width='100px'></td>
	 			<td><div align='center'><a href='#' onClick="WebLink();"><img src='images/news.png' /></a></div></td>
			</tr>
			<tr>
				<td><div align='center'><a href='#' onClick="UploadImage();">Upload object</a></div></td>
				<td></td>
				<td><div align='center'><a href='#' onClick="YouTube();">Link to YouTube</a></div></td>
	 			<td></td>
	 			<td><div align='center'><a href='#' onClick="WebLink();">Web Link</a></div></td>
	
			</tr>
		</table>
		</div>
	</div>
</div>
