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

function validateForm(form)
{
	console.log(form.URL.value);
}

function YouTube()
{
	$.ajax({
	  type: "GET",
	  url: "php/YouTube.php",
	  // data: {sequence: sequence},
	  datatype: "html",
	  success: function(html){ document.getElementById('popupFrame').innerHTML = html; }
	});
}
</script>

<div id="popupFrame">
	<h1>Add new item</h1>
	<div align="center">
	<table border=0 cellspacing=5>
		<tr>
			<td><a href='#' onClick="UploadImage();"><img src='images/picture.png' /></a></td>
			<td>&nbsp;</td>
			<td><img src='images/YouTube_dim.png' /></td>
			<td>&nbsp;</td>
			<td><img src='images/news_dim.png' /></td>
		</tr>
		<tr>
			<td><div align='center'><a href='#' onClick="UploadImage();">Upload object</a></div></td>
			<td></td>
			<td><div align='center'><a href='#' onClick="YouTube();">Link to YouTube</br>TO DO</a></div></td>
			<td></td>
			<td><div align='center'>BBC News</br>TO DO</div></td>

		</tr>
	</table>
	</div>
</div>
