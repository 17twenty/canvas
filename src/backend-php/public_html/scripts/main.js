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

// CONSTANTS
IMAGE = 0;
VIDEO = 1;
WEB = 2;

UPDATE = 0;
REFRESH = 1;
DELETE = 2;

hotspot_size = 45;
minimum_object_size = 0.08;  //% of screen width
renderFPS = 20;

// GLOBALS
var drag_flag = false; 
var rotate_flag = false; 
var resize_flag = false;
var move_flag = false; 
var moved_flag = false; 
var touch_flag = false;
var single_touch_flag = false;
var canvas;
var popupContact;
var iframe;
var ctx;
var v;
var x = 0.5;
var y = 0.5;
var temp_x = 0.5;
var temp_y = 0.5;
var size = 0.2;
var rotation = 0;
var rotate_offset = 0;
var resise_ratio = 0;
var objects = [];
var imageId = 0;
var maxz = 0;
var displayIcons = false;
var fontsLoaded = false;
var dropX = 0.5;
var	dropY = 0.5;

var clickBlock = false;
var touch = false;
var multitouch = false;
var touches = {};
touches[2] = {
	      x:0,
	      y:0,
	      oldx:0,
	      oldy:0,
	      temp_x:0,
	      temp_y:0,
	      object:0,
	      active:false
	    };
touches[3] = {
	      x:0,
	      y:0,
	      oldx:0,
	      oldy:0,
	      temp_x:0,
	      temp_y:0,
	      object:0,
	      active:false
	    };

var currentX;
var currentY;
var oldX;
var oldY;

var volume = 0.5;
var tempVolume = 0.5;
var volumeFlag = false;


var removeIcons = null;

var bgImage = new Image;
bgImage.src = "images/bg.jpg";
bgImage.onload = function(){bgImage.loaded = true;console.log("Background Loaded");render();};
var rotateImage = new Image;
rotateImage.src = "images/ball.png";
var binImageEmpty = new Image;
binImageEmpty.src = "images/Recylebin_empty.png";
var binImageFull = new Image;
binImageFull.src = "images/Recylebin_full.png";
var target = new Image;
target.src = "images/target.png";
var add = new Image;
add.src = "images/add.png";
var arrange = new Image;
arrange.src = "images/arrange.png";
var volumeImage0 = new Image;
volumeImage0.src = "images/volume0.png";
var volumeImage1 = new Image;
volumeImage1.src = "images/volume1.png";
var volumeImage2 = new Image;
volumeImage2.src = "images/volume2.png";
var volumeImage3 = new Image;
volumeImage3.src = "images/volume3.png";
var volumeSlider = new Image;
volumeSlider.src = "images/volumeSlider.png";
var CDPImage = new Image;
CDPImage.src = "images/cdp.png";
var progressImage = new Image;
progressImage.src = "images/progress.png";
var webImage = new Image;
webImage.src = "images/web.png";


function init()
{
//	google.load("webfont", "1");
//	google.setOnLoadCallback(function() {
//		WebFont.load({
//			google: {
//				families: [ 'Cabin Sketch' ]
//			},
//			active: function(){
//				console.log("Font Loaded");
//				fontsLoaded = true;
//				render();
//			}
//		});
//	});
	canvas = document.getElementById("myCanvas");
	popupContact = document.getElementById("popupContact");
	iframe = document.getElementById("iframe");
	ctx=canvas.getContext("2d");
	resize();

	console.log("Initialisation");
	
	Refresh=setInterval(function() {
		$.ajax({
			  type: "GET",
			  url: "ajax-refresh.php",
			  data: {sequence: sequence},
			  dataType: "script"
			});
	},5000); //increased to 5s to help with bandwidth issues

	// Set Framerate
	renderTimeout = setInterval(autoRender,1000/renderFPS); //50
	
	// Drag and drop stuff
	canvas.addEventListener("drop", function(e) {
		dropX = e.pageX;
		dropY = e.pageY;
	}, true);
	
	$(function () {
	    $('#fileupload').fileupload({
	        dataType: 'json',
	        url: 'php/index.php',
	        done: function (e, data) {
				$.each(data.result, function (index, file) {
					if (file.error == null)	{
						if (name == false) name = "";
						var temptype = null;
						if (file.type == "image/jpeg" || file.type == "image/gif" || file.type == "image/png" || file.type == "image/tiff") 
							temptype = IMAGE;
						if (file.type == "video/webm" || file.type == "video/mp4" || file.type == "video/ogg") 
							temptype = VIDEO;
						if (temptype != null) {
							apprise('Please enter a caption?',{'confirm':false,'verify':false,'input':true,'animate':true,'textCancel':'Cancel'}, function(name) {
								$.ajax({
									type: "GET",
									url: "ajax-insert.php",
									data: {
										x: (dropX / window.innerWidth ),
										y: (dropY / window.innerHeight),
										size: 0.2,
										rotation: ((Math.random()*60)-30),
										name: name,
										type: temptype,
										link: "objects/"+file.name,
										url: ""
									},
									dataType: "script"
								});
							});
						}
						else apprise('File format not supported');
					}
				});
	        }
	    });
	});
	
	window.addEventListener("MozTouchDown", myDown, true);
	window.addEventListener("MozTouchUp"  , myUp  , true);
	window.addEventListener("MozTouchMove", myMove, true);
	window.addEventListener("mousedown"  , function(e) { setTimeout(function() { myDown(e); } ,10); } , false);
	window.addEventListener("mouseup"  , function(e) { setTimeout(function() { myUp(e); } ,10); } , false);
}

function CanvasImage() {
	this.id = 0;
	this.type  = IMAGE;
	this.x = 0.5;
	this.y = 0.5;
	this.z = 0;
	this.desc = "";
	this.size = 1;
	this.rotation = 0;
	this.aspectRatio = 1;
	this.image = new Image();
	this.loaded = false;
}

function addObject(id, type, x, y, z, size, rotation, desc, src, url) {

	console.log("Add: " + src);
	var tempImage = new CanvasImage;
	tempImage.id = id;
	tempImage.type = type;
	tempImage.x = x;
	tempImage.y = y;
	tempImage.z = z;
	tempImage.size = size;
	tempImage.rotation = rotation;
	tempImage.desc = desc;
	if(type == WEB)
	{
		tempImage.url = url;
		console.log("Web: " + url);
	}
	if(type == VIDEO)
	{
		tempImage.image = document.createElement('video');
		tempImage.image.src = src;
		tempImage.image.height = 0;
		tempImage.image.width = 0;
		document.body.appendChild(tempImage.image);
		var newid = objects.push(tempImage) - 1;
		objects[newid].image.newid = newid;
		objects[newid].image.volume = convertVolume(volume);
	}
	else if(type == IMAGE || type == WEB)
	{
		tempImage.image.src = src;
		var newid = objects.push(tempImage) - 1;
		objects[newid].image.onload = function(){
			console.log("Image " + objects[newid].image.src + " Loaded");
			objects[newid].loaded = true;
			objects[newid].aspectRatio = objects[newid].image.height / objects[newid].image.width;
			render();
		};
	}
}

// Workaround to render Video and get AspectRatio for Chrome
window.addEventListener('loadedmetadata', function(e) { 
	console.log("Video " + e.target.src + " Loaded");
	//e.target.height = e.target.videoHeight;
	//e.target.width = e.target.videoWidth;
	objects[e.target.newid].aspectRatio = e.target.videoHeight / e.target.videoWidth; 
	objects[e.target.newid].loaded = true;
	render();
}, true);



function resize()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

	binSize = Math.floor(0.08 * window.innerWidth);
	binX = window.innerWidth -  binSize - 10;
	binY = window.innerHeight - binSize - 10;
	
	addSize = Math.floor(0.05 * window.innerWidth);
	addX = window.innerWidth -  addSize - 10;
	addY = 10;
	arrangeY = addY + addSize + 20;
	volumeY = arrangeY + addSize + 20;
	
	popupContact.style.width = Math.floor(window.innerWidth * 0.7) + "px";
	popupContact.style.height = Math.floor(window.innerHeight * 0.8) + "px";
	//iframe.style.height = Math.floor(window.innerHeight * 0.8) + "px";
	
	dropX  = 0.5 * window.innerWidth;
	dropY  = 0.5 * window.innerHeight;

	centerPopup();
	render();
}

function convertx(x, size) {return Math.floor((x - (size/2)) * window.innerWidth) ;}
function converty(y, size, aspectRatio) {return Math.floor((y * window.innerHeight - ((size/2)* aspectRatio) * window.innerWidth));}
function convertSize(size) {return Math.floor(size * window.innerWidth);}

function formatTime(time) {
	var seconds = parseInt( time % 60);
	if (seconds < 10) seconds = "0"+seconds;
	return parseInt( time / 60 ) % 60+":"+seconds;
}

function drawImage(image)
{
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.save();  // Save co-ordinate system
	var size = convertSize(image.size);

	if (image.type == IMAGE || image.type == VIDEO || image.type == WEB)
	{

		ctx.translate(Math.floor(image.x * window.innerWidth), Math.floor(image.y * window.innerHeight));
		ctx.rotate(image.rotation * Math.PI / 180);

		if((drag_flag || rotate_flag || resize_flag) && image.z == maxz)    
		{
			ctx.shadowOffsetX = 10;
			ctx.shadowOffsetY = 10;
			ctx.shadowBlur    = 5;
			ctx.shadowColor   = 'rgba(0,0,0,0.5)';    
		}

		// Frame around each item
		ctx.beginPath(); 
		ctx.rect(-0.5*size-10, Math.floor(-0.5 * size * image.aspectRatio -25), size+20, Math.floor((size * image.aspectRatio)+50));	
		ctx.fillStyle = "rgb(255, 255, 255)"; 
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#FFFFFF";
		ctx.stroke(); 

		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur    = 0;
		ctx.shadowColor   = 'rgba(0, 0, 0, 0)';    

		//if(fontsLoaded)
		{
			ctx.fillStyle = "#000000"; 
			ctx.font = "20px 'Cabin Sketch', cursive";
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";


			if (VIDEO == image.type && (image.image.paused ||  image.image.ended))
				ctx.fillText(image.desc+" ["+formatTime(image.image.duration)+"]", 0, 0.5*size*image.aspectRatio + 5, size);
			else if (VIDEO == image.type)
				ctx.fillText(image.desc+" ["+formatTime(image.image.currentTime)+"/"+formatTime(image.image.duration)+"]", 0, 0.5*size*image.aspectRatio + 5, size);
			else
				ctx.fillText(image.desc, 0, 0.5*size*image.aspectRatio + 5, size);
		}

		ctx.drawImage(image.image, -0.5*size, (-0.5*size * image.aspectRatio) - 15, size, (size * image.aspectRatio));

		if (VIDEO == image.type && (image.image.paused ||  image.image.ended))
		{    	
			ctx.beginPath(); 
			ctx.moveTo(-0.1*size,-0.1*size-15);
			ctx.lineTo(-0.1*size, 0.1*size-15);
			ctx.lineTo(0.1*size, -15);
			ctx.closePath(); 
			ctx.lineWidth = 10;
			ctx.strokeStyle = "#FFFFFF";  
			ctx.globalAlpha = 0.2;  
			ctx.lineJoin = 'round';
			ctx.stroke(); 

			ctx.fillStyle = "#FFFFFF"; 
			ctx.fillText("Click to Play", 0, 0.2*size*image.aspectRatio, size);  
		}
		if (VIDEO == image.type && !(image.image.paused ||  image.image.ended))
		{ 
			// Progress Bar
//			ctx.beginPath(); 
//			ctx.moveTo(-0.5*size, 0.5*size * image.aspectRatio - 15);
//			ctx.lineTo( 0.5*size, 0.5*size * image.aspectRatio - 15);
//			ctx.closePath(); 
//			ctx.lineWidth = 10;
//			ctx.strokeStyle = "#FF0000"; 
//			//ctx.globalAlpha = 0.2;  
//			ctx.stroke();   
			ctx.drawImage(progressImage, -0.5*size - hotspot_size/4 + (image.image.currentTime/image.image.duration * size), 0.5*size * image.aspectRatio - 15 - hotspot_size/4, hotspot_size/2,hotspot_size/2);

		}
		if (WEB == image.type)
			{
    		ctx.drawImage(webImage, -size/6, (-size/6) - 15 , size/3, size/3);
			}
	}

	ctx.restore();  // Restore co-ordinate system
}

function angle_cursor_to_corner(x,y, i, angle, mag ) { return Math.atan2(y - (objects[i].y * window.innerHeight + Math.sin(angle) * mag), x - (objects[i].x * window.innerWidth + Math.cos(angle) * mag) ) / Math.PI  * 180; }

function clean_angle(angle) {
	if (angle > 180) angle -= 360;
	if (angle <= -180) angle += 360;
	return angle;
	}
function clean_angle_rad(angle) {
	if (angle > Math.PI) angle -= 2*Math.PI;
	if (angle <= (-1 * Math.PI)) angle += 2*Math.PI;
	return angle;
	}

function myDown(e){
	if(popupStatus==0)
		{
		if (e.type != "MozTouchDown")  // click event
			{
			if ((e.mozInputSource > 1)) // check if a 'click' is really a 'touch'
					//touches[2].active || touches[3].active || touch || clickBlock || (e.mozInputSource > 1))
				return
			//console.log("Click");
			touch = false;
			canvas.onmousemove = myMove;
			oldX = e.pageX;
			oldY = e.pageY;
			}
		else	// touch event
			{
			e.preventDefault();  
			touch = true;
			//console.log("Touch: " + e.streamId);
		    //touches[e.streamId].active = false; //reset
		    clickBlock = true;
			canvas.onmousemove = null;
			}

	    currentX = e.pageX;
	    currentY = e.pageY;
	    //Add Hotspot
	    if (	(e.pageX >= addX ) &&
				(e.pageX <= addX + addSize) &&
				(e.pageY >= addY) &&
				(e.pageY <= addY + addSize)  )
		{
	    	//centering with css
			centerPopup();
			//load popup
			$.ajax({
				  type: "GET",
				  url: "add-item.php",
				  datatype: "html",
				  success: function(html){ document.getElementById('popupFrame').innerHTML = html; }
				});
			
			loadPopup();
		}
    	// Arrange items
	    else if (	(e.pageX >= addX ) &&
				(e.pageX <= addX + addSize) &&
				(e.pageY >= arrangeY) &&
				(e.pageY <= arrangeY + addSize)  )
		{
	    	arrange_offset = 100;	// Distance in from the edge
	    	arrange_circum = 2 * canvas.width + 2 * canvas.height - 8 * arrange_offset;	// Total length of the path
	    	arrange_spacing = arrange_circum / objects.length;
	    	//console.log("Total Circumference: "+arrange_circum);
	    	//console.log("Spacing: "+arrange_spacing);

			var l = objects.length;
		    for (var i = l-1; i >= 0; i--)
	    	{
		    	arrange_position = arrange_spacing * i;
		    	if (arrange_position < canvas.width - 2 * arrange_offset)			// Top
		    	{
		    		arrange_x = arrange_position + arrange_offset;
		    		arrange_y = arrange_offset;
		    	}
		    	else if (arrange_position < canvas.width + canvas.height - 4 * arrange_offset)	//Right
		    	{
		    		arrange_x = canvas.width - arrange_offset;
		    		arrange_y = (arrange_position - (canvas.width - 2 * arrange_offset)) + arrange_offset;
		    	}
		    	else if (arrange_position < 2 * canvas.width + canvas.height - 6 * arrange_offset)	//Bottom
		    	{
		    		arrange_x = canvas.width - arrange_offset - (arrange_position - (canvas.width + canvas.height - 4 * arrange_offset));
		    		arrange_y = canvas.height - arrange_offset;
		    	}
		    	else //Left
		    	{
		    		arrange_x = arrange_offset;
		    		arrange_y = canvas.height - arrange_offset - (arrange_position - (2 * canvas.width + canvas.height - 6 * arrange_offset));
		    	}
		    	console.log("Object "+i+": "+arrange_x+", "+arrange_y);
		    	objects[i].x = arrange_x / canvas.width;
		    	objects[i].y = arrange_y / canvas.height;
		    	objects[i].size = minimum_object_size;
		    	objects[i].rotation = ((Math.random()*60)-30);
				$.ajax({
					type: "GET",
					url: "ajax-update.php",
					data: { id: objects[i].id, x: objects[i].x, y: objects[i].y, z: objects[i].z, size: objects[i].size, rotation: objects[i].rotation },
					cache: false,
					success: function(html){ sequence = html; }
				});
		    	
	    	}
		}
    	// Volume
	    else if (	(e.pageX >= addX ) &&
				(e.pageX <= addX + addSize) &&
				(e.pageY >= volumeY) &&
				(e.pageY <= volumeY + addSize)  )
		{
	    	volumeFlag = true;
	    	tempVolume = volume;
	    	console.log("Volume");
			temp_x = (e.pageX);
			temp_y = (e.pageY);
			canvas.onmousemove = myMove;
		}
		else 
		{
			var l = objects.length;
		    for (var i = l-1; i >= 0; i--)
			{
		    	
		        var angle_to_TR = clean_angle_rad(Math.atan2(-1 * (convertSize(objects[i].size) * objects[i].aspectRatio + 30), convertSize(objects[i].size)) + (objects[i].rotation * Math.PI  / 180));
		        var angle_to_BR = clean_angle_rad(Math.atan2((convertSize(objects[i].size) * objects[i].aspectRatio + 30), convertSize(objects[i].size)) + (objects[i].rotation * Math.PI  / 180));
		        var angle_to_BL = clean_angle_rad(angle_to_TR + Math.PI);
		        var angle_to_TL = clean_angle_rad(angle_to_BR + Math.PI);
		        var mag_to_corner = Math.sqrt(Math.pow(convertSize(objects[i].size),2) + Math.pow((convertSize(objects[i].size) * objects[i].aspectRatio + 30),2)) / 2;
		        
				
				var cursor_TL = angle_cursor_to_corner(e.pageX, e.pageY, i, angle_to_TL, mag_to_corner); 
				var cursor_TR = angle_cursor_to_corner(e.pageX, e.pageY, i, angle_to_TR, mag_to_corner);
				var cursor_BR = angle_cursor_to_corner(e.pageX, e.pageY, i, angle_to_BR, mag_to_corner);
				var cursor_BL = angle_cursor_to_corner(e.pageX, e.pageY, i, angle_to_BL, mag_to_corner);
		
				var TL_TR = clean_angle(objects[i].rotation);
				var TR_BR = clean_angle(objects[i].rotation + 90);
				var BR_BL = clean_angle(objects[i].rotation + 180);
				var BL_TL = clean_angle(objects[i].rotation + 270);
				
				// Rotate hotspot
				if (    objects[i].loaded && //touch == false &&
						(  e.pageX < objects[i].x * window.innerWidth + Math.cos(angle_to_TR)  * mag_to_corner + hotspot_size/2 
		                        && e.pageX > objects[i].x * window.innerWidth + Math.cos(angle_to_TR)  * mag_to_corner - hotspot_size/2
		                        && e.pageY < objects[i].y * window.innerHeight + Math.sin(angle_to_TR) * mag_to_corner + hotspot_size/2 
		                        && e.pageY > objects[i].y * window.innerHeight + Math.sin(angle_to_TR) * mag_to_corner - hotspot_size/2 )  ||
		                        (  e.pageX < objects[i].x * window.innerWidth + Math.cos(angle_to_TL)  * mag_to_corner + hotspot_size/2 
		                        && e.pageX > objects[i].x * window.innerWidth + Math.cos(angle_to_TL)  * mag_to_corner - hotspot_size/2
		                        && e.pageY < objects[i].y * window.innerHeight + Math.sin(angle_to_TL) * mag_to_corner + hotspot_size/2 
		                        && e.pageY > objects[i].y * window.innerHeight + Math.sin(angle_to_TL) * mag_to_corner - hotspot_size/2 )  ||
		                        (  e.pageX < objects[i].x * window.innerWidth + Math.cos(angle_to_BR)  * mag_to_corner + hotspot_size/2 
		                        && e.pageX > objects[i].x * window.innerWidth + Math.cos(angle_to_BR)  * mag_to_corner - hotspot_size/2
		                        && e.pageY < objects[i].y * window.innerHeight + Math.sin(angle_to_BR) * mag_to_corner + hotspot_size/2 
		                        && e.pageY > objects[i].y * window.innerHeight + Math.sin(angle_to_BR) * mag_to_corner - hotspot_size/2 )  ||
		                        (  e.pageX < objects[i].x * window.innerWidth + Math.cos(angle_to_BL)  * mag_to_corner + hotspot_size/2 
		                        && e.pageX > objects[i].x * window.innerWidth + Math.cos(angle_to_BL)  * mag_to_corner - hotspot_size/2
		                        && e.pageY < objects[i].y * window.innerHeight + Math.sin(angle_to_BL) * mag_to_corner + hotspot_size/2 
		                        && e.pageY > objects[i].y * window.innerHeight + Math.sin(angle_to_BL) * mag_to_corner - hotspot_size/2 )
		                )	
				{
					if (objects[i].z < maxz) {
						objects[i].z = maxz+1;
						objects.sort(sortNumber);
						render();
						myDown(e); 
						return;
					}
					temp_x = (e.pageX);
					temp_y = (e.pageY);
					
					canvas.onmousemove = myMove;
					imageId = i;
					resise_ratio = objects[i].size / (Math.sqrt(Math.pow((e.pageY - (objects[i].y * window.innerHeight)),2) + Math.pow((e.pageX - (objects[i].x * window.innerWidth)),2) ));
					rotate_offset = Math.atan2((temp_y - (objects[i].y * window.innerHeight)) , (temp_x - (objects[i].x * window.innerWidth))) * 180 / Math.PI - objects[i].rotation;
		            rotate_flag = true;
					displayIcons = true;
					if (removeIcons != null) {clearTimeout(removeIcons);removeIcons=null;}
					return;
				}
				// Move hotspot
				else if (objects[i].loaded && (clean_angle(cursor_TL - TL_TR) > 0) && (clean_angle(cursor_TR - TR_BR) > 0) && (clean_angle(cursor_BR - BR_BL) > 0) && (clean_angle(cursor_BL - BL_TL) > 0)) 
				{
					if (objects[i].z < maxz) {
						objects[i].z = maxz+1;
						objects.sort(sortNumber);
						render();
						myDown(e); 
						return;
					}
		
					temp_x = (objects[i].x * window.innerWidth) - e.pageX;
					temp_y = (objects[i].y * window.innerHeight) - e.pageY;
					
					if (touch)
					{
					    touches[e.streamId].active = true;
						touches[e.streamId].object = objects[i].id;
						touches[e.streamId].oldx = e.pageX;
						touches[e.streamId].oldy = e.pageY;
						touches[e.streamId].tempx = temp_x;
						touches[e.streamId].tempy = temp_y;
				    	touches[e.streamId].x = e.pageX;
				    	touches[e.streamId].y = e.pageY;	
						
						//window.addEventListener("MozTouchMove", myMove, true);
						canvas.onmousemove = null;
						touch_flag = true;
						imageId = i;
						
					}
					else
					{
						drag_flag = true;
						imageId = i;
						canvas.onmousemove = myMove;
					}
					moved_flag = false;
					displayIcons = true;  
					if (removeIcons != null) {clearTimeout(removeIcons);removeIcons=null;};
					
					
					return;
				}
			}
		}
	}
}

function findObjectId (id){
	var l = objects.length;
    for (var i = l-1; i >= 0; i--)
	{
    	if (objects[i].id == id)
    		return i;
    	
	}
    return null;
    console.error("Object not found");
}

function myMove(e){
	//console.log("Moved");
    if (e.type == "MozTouchMove")
    {
    	//Work around for hyper sensitive touch events
    	if ( (e.pageX < touches[e.streamId].oldx - 2) || (e.pageX > touches[e.streamId].oldx + 2) || (e.pageY < touches[e.streamId].oldy - 2) || (e.pageY > touches[e.streamId].oldy + 2) ) moved_flag = true;
    	else
    		return;	
		touches[e.streamId].oldx = e.pageX;
		touches[e.streamId].oldy = e.pageY;
    		
    	if (touches[e.streamId].active == false) return;
    	objectId = findObjectId(touches[e.streamId].object);
    	touches[e.streamId].x = e.clientX;
    	touches[e.streamId].y = e.clientY;	

		single_touch_flag = ((touches[2].active && touches[3].active && (touches[2].object == touches[3].object)) == false);
    	if (single_touch_flag == false) {
    		if (multitouch == false)  {
    			multitouch = true;
    			
    			temp_x = (objects[objectId].x * window.innerWidth) - ( (touches[2].oldx + touches[3].oldx) / 2);
    			temp_y = (objects[objectId].y * window.innerHeight) - ( (touches[2].oldy + touches[3].oldy) / 2);
    			temp_size = objects[objectId].size;
    			//resise_ratio = objects[objectId].size / (Math.sqrt (Math.pow((touches[2].y - (objects[objectId].y * window.innerHeight)),2) + Math.pow((touches[2].x - (objects[objectId].x * window.innerWidth)),2) ));
    			resise_ratio = objects[objectId].size / (Math.sqrt (Math.pow((touches[2].y - touches[3].y),2) + Math.pow((touches[2].x - touches[3].x),2) ));
    			clean_angle(rotate_offset = Math.atan2((touches[2].y - touches[3].y) , (touches[2].x - touches[3].x)) * 180 / Math.PI - objects[objectId].rotation);
    		}
    		rot_correction_x = 0;
    		rot_correction_y = 0;
    		
			objects[objectId].rotation = clean_angle(Math.atan2((touches[2].y - touches[3].y) , (touches[2].x - touches[3].x)) * 180 / Math.PI - rotate_offset);
			//objects[objectId].size = (Math.sqrt(Math.pow((touches[2].y - (objects[objectId].y * window.innerHeight)),2) + Math.pow((touches[2].x - (objects[objectId].x * window.innerWidth)),2)) * resise_ratio );
			objects[objectId].size = (Math.sqrt (Math.pow((touches[2].y - touches[3].y),2) + Math.pow((touches[2].x - touches[3].x),2) ) * resise_ratio );
			if (objects[imageId].size < minimum_object_size) objects[imageId].size = minimum_object_size;
			objects[objectId].x = (((touches[2].x + touches[3].x) / 2) + (temp_x * (objects[objectId].size / temp_size)) + rot_correction_x) / window.innerWidth;				// temp_x needs an offset so the image scales from the midpoint of touch, not the image midpoint
			objects[objectId].y = (((touches[2].y + touches[3].y) / 2) + (temp_y * (objects[objectId].size / temp_size)) + rot_correction_y) / window.innerHeight;

    	}
    	else
    	{
    		if (multitouch == true) {
    			touches[e.streamId].tempx = (objects[objectId].x * window.innerWidth) - e.pageX;
    			touches[e.streamId].tempy = (objects[objectId].y * window.innerHeight) - e.pageY;
    		}
    		multitouch = false;
    		objects[objectId].x = (touches[e.streamId].x + touches[e.streamId].tempx) / window.innerWidth;
    		objects[objectId].y = (touches[e.streamId].y + touches[e.streamId].tempy) / window.innerHeight;
    	}
    }
    else
    	{
    	if ( (e.pageX < oldX - 2) || (e.pageX > oldX + 2) || (e.pageY < oldY - 2) || (e.pageY > oldY + 2) ) moved_flag = true;
    	
    	}
    currentX = e.pageX;
    currentY = e.pageY;
	if (drag_flag)	{
		objects[imageId].x = (e.pageX + temp_x) / window.innerWidth;
		objects[imageId].y = (e.pageY + temp_y) / window.innerHeight;
	}
	if (rotate_flag)	{
		objects[imageId].rotation = clean_angle(Math.atan2((e.pageY - (objects[imageId].y * window.innerHeight)) , (e.pageX - (objects[imageId].x * window.innerWidth))) * 180 / Math.PI - rotate_offset);
		objects[imageId].size = (Math.sqrt(Math.pow((e.pageY - (objects[imageId].y * window.innerHeight)),2) + Math.pow((e.pageX - (objects[imageId].x * window.innerWidth)),2)) * resise_ratio );
		if (objects[imageId].size < minimum_object_size) objects[imageId].size = minimum_object_size;
	}
	if (volumeFlag) {
		volume = ((temp_y - e.pageY) / (addSize*3)) + tempVolume;
		
		if (volume < 0) volume = 0;
		if (volume > 1) volume = 1;
		
		updateVolume();
		}
	//render(); //Increase Framerate while moving an object
}
function updateVolume() {
	var l = objects.length;
    for (var i = 0; i < l; i++)  {
    	if (objects[i].type == VIDEO) {
    		objects[i].image.volume = convertVolume(volume);
    	}
    	
    }
}

function convertVolume(volumeIn){
	return  volume * volume;
}

function myUp(e){
	//console.log("myUp");
	//canvas.onmouseup = null;
	if (e.type == "MozTouchUp") {//Touched
		touches[e.streamId].active = false;
    	objectId = findObjectId(touches[e.streamId].object);
		//imageId = objectId;
		console.log("TouchUp: " + e.streamId + "  - Moved? " + moved_flag);
		multitouch = false;
		}
	if(volumeFlag) {
		volumeFlag = false;
		}
	//console.log("Moved? " + moved_flag);
	currentX = e.pageX;
	currentY = e.pageY;
	canvas.onmousemove = null;
	//console.log(removeIcons);
	if (removeIcons == null){
		//console.log("SetTimeout");
		removeIcons=setTimeout("displayIcons = false; render(); removeIcons=null;",3000);
	}
	if (moved_flag == false && (drag_flag || touch_flag)) {
		if (objects[imageId].type == VIDEO) {
			//console.log("Play Video");
			if(objects[imageId].image.paused ||  objects[imageId].image.ended) objects[imageId].image.play(); else {objects[imageId].image.currentTime = 0; objects[imageId].image.pause();}
			
		}
		if (objects[imageId].type == WEB) {
			//console.log("Open Weblink");
			var popupHeight = $("#popupContact").height();
			var popupWidth = $("#popupContact").width();
			document.getElementById('popupFrame').innerHTML = "<iframe width="+popupWidth+" height="+popupHeight+" src=\""+objects[imageId].url+"\"></iframe>";
			
			loadPopup();
			
		}
	}
	//console.log("myUp: " + drag_flag + ", " + single_touch_flag);
	if(drag_flag || rotate_flag || single_touch_flag){

		if ( (currentX >= binX ) && (currentX <= binX + binSize) && (currentY >= binY) && (currentY <= binY + binSize)  && (drag_flag ||single_touch_flag) ) {
			$.ajax({url: "ajax-delete.php", cache: false, data: {id:objects[imageId].id}, dataType: "script"});
			objects.splice(imageId, 1);
		}
		else {
			$.ajax({
				type: "GET",
				url: "ajax-update.php",
				data: { id: objects[imageId].id, x: objects[imageId].x, y: objects[imageId].y, z: objects[imageId].z, size: objects[imageId].size, rotation: objects[imageId].rotation },
				cache: false,
				success: function(html){ sequence = html; }
			});
		}
	}
	if (touches[2].active == 0 && touches[3].active == 0) {
		touch_flag = false;
		touch = false;
		single_touch_flag = false;
		clickBlockTimeout = setTimeout( function() { clickBlock = false; });
	}
	if (touches[2].active != touches[3].active) single_touch_flag = true;
	drag_flag = false;
	rotate_flag = false;
	resize_flag = false;
    render();
    	
}
function sortNumber(a,b) { return a.z - b.z; }

function autoRender()
{ 
	var l = objects.length;
	var videoPlaying = false;
    for (var i = 0; i < l; i++) 
    {
    	if(objects[i].type == VIDEO && (objects[i].image.paused || objects[i].image.ended) != true)
    		videoPlaying = true;
    }
	if (drag_flag || rotate_flag || videoPlaying || touch_flag || volumeFlag)
		render();
}

function render()
{ 
    if(bgImage.loaded) ctx.drawImage(bgImage, 0,0,window.innerWidth, window.innerHeight);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);

    var l = objects.length;
    
    for (var i = 0; i < l; i++) 
    {
    	if (objects[i].z > maxz) maxz = objects[i].z;
    	if (objects[i].loaded)
    	{
    		drawImage(objects[i]);
    		var angle_to_TR = Math.atan2(-1 * (convertSize(objects[i].size) * objects[i].aspectRatio + 30), convertSize(objects[i].size)) + objects[i].rotation * Math.PI  / 180;
    		var angle_to_BR = Math.atan2((convertSize(objects[i].size) * objects[i].aspectRatio + 30), convertSize(objects[i].size)) + objects[i].rotation * Math.PI  / 180;
    		var angle_to_BL = angle_to_TR + Math.PI;
    		var angle_to_TL = angle_to_BR + Math.PI;
    		var mag_to_corner = Math.sqrt(Math.pow(convertSize(objects[i].size)+10,2) + Math.pow((convertSize(objects[i].size) * objects[i].aspectRatio + 30+10),2)) / 2;

    		// Hotspots
    		if (displayIcons && imageId == i)
    		{
    			ctx.drawImage(rotateImage, objects[i].x * window.innerWidth + Math.cos(angle_to_TR) * mag_to_corner - hotspot_size/2, objects[i].y * window.innerHeight + Math.sin(angle_to_TR) * mag_to_corner-hotspot_size/2, hotspot_size,hotspot_size);
    			ctx.drawImage(rotateImage, objects[i].x * window.innerWidth + Math.cos(angle_to_BR) * mag_to_corner - hotspot_size/2, objects[i].y * window.innerHeight + Math.sin(angle_to_BR) * mag_to_corner-hotspot_size/2, hotspot_size,hotspot_size);
    			ctx.drawImage(rotateImage, objects[i].x * window.innerWidth + Math.cos(angle_to_TL) * mag_to_corner - hotspot_size/2, objects[i].y * window.innerHeight + Math.sin(angle_to_TL) * mag_to_corner-hotspot_size/2, hotspot_size,hotspot_size);
    			ctx.drawImage(rotateImage, objects[i].x * window.innerWidth + Math.cos(angle_to_BL) * mag_to_corner - hotspot_size/2, objects[i].y * window.innerHeight + Math.sin(angle_to_BL) * mag_to_corner-hotspot_size/2, hotspot_size,hotspot_size);
    		}
    	}
    }
    //Wastebasket
    if (drag_flag || single_touch_flag)
    {
    	if (	(currentX >= binX ) &&
    			(currentX <= binX + binSize) &&
    			(currentY >= binY) &&
    			(currentY <= binY + binSize)  )
    		ctx.drawImage(binImageFull, binX, binY, binSize, binSize);
    	else
    		ctx.drawImage(binImageEmpty, binX, binY, binSize, binSize);
    		
    }
    if(touches[2].active) ctx.drawImage(target, touches[2].x - 20 , touches[2].y - 20 , 40, 40);	// Target 1
    if(touches[3].active) ctx.drawImage(target, touches[3].x - 20 , touches[3].y - 20 , 20, 20);	// Target 2
    ctx.drawImage(add, addX, addY, addSize, addSize);	// Add image
    ctx.drawImage(arrange, addX, arrangeY, addSize, addSize);	// Arrange image
	ctx.drawImage(CDPImage, 0, 0, 134, 127);
	
	ctx.fillStyle = "#000000"; 
	ctx.font = "14px 'Cabin Sketch', cursive";
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	var volumeImage = volumeImage0;
	if (volume > 0.75)	volumeImage = volumeImage3;
	else if (volume > 0.5)	volumeImage = volumeImage2;
	else if (volume > 0.25)	volumeImage = volumeImage1;

	
	if (volumeFlag)
		{
		ctx.drawImage(volumeSlider, addX, volumeY - ((1 - tempVolume) * addSize*3), addSize, addSize*4);	// VolumeSlider image
		ctx.drawImage(volumeImage, addX, volumeY + (tempVolume * addSize*3) + (-1 * volume * (addSize*3)), addSize, addSize);	// Volume image

		ctx.fillText(Math.floor(volume * 100) +"%", addX + (addSize/2), volumeY + (tempVolume * addSize*3) + (-1 * volume * (addSize*3)) + (addSize * 0.8), addSize);
		}
	else
		{
		ctx.drawImage(volumeImage, addX, volumeY, addSize, addSize);	// Volume image
		ctx.fillText(Math.floor(volume * 100) +"%", addX + (addSize/2) , volumeY + (addSize * 0.8), addSize);
		}
}

init();



