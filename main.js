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

UPDATE = 0;
REFRESH = 1;
DELETE = 2;

// GLOBALS
var drag_flag = false; 
var rotate_flag = false; 
var resize_flag = false;
var move_flag = false; 
var moved_flag = false; 
var touch_flag = false;
var single_touch_flag = false;
var canvas;
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
var touch;
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

var hotspot_size = 45;
var removeIcons;

    var bgImage = new Image;
    bgImage.src = "bg.jpg";
    bgImage.onload = function(){bgImage.loaded = true;console.log("Background Loaded");render();};
    var rotateImage = new Image;
    rotateImage.src = "ball.png";
    var binImageEmpty = new Image;
    binImageEmpty.src = "Recylebin_empty.png";
    var binImageFull = new Image;
    binImageFull.src = "Recylebin_full.png";
    var target = new Image;
    target.src = "target.png";
	
function init()
{
	google.load("webfont", "1");
	google.setOnLoadCallback(function() {
		console.log("Start Loading fonts");
		WebFont.load({
			google: {
				families: [ 'Loved by the King' ]
			},
			active: function(){
				console.log("Font Loaded");
				fontsLoaded = true;
				render();
			}
		});
	});
	canvas = document.getElementById("myCanvas");
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
	},5000);

	// Set Framerate
	renderTimeout = setInterval(autoRender,50); //50
	
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
	            	$.ajax({
						type: "GET",
						url: "ajax-insert.php",
						data: {
							x:  (dropX / window.innerWidth),
							y: (dropY / window.innerHeight),
							size: 0.2,
							rotation: ((Math.random()*60)-30),
							name: "Upload",
							type: IMAGE,
							link: ".."+file.large_url
						},
						  dataType: "script"
					});
	            });
	        }
	    });
	});
	
	window.addEventListener("MozTouchDown", myDown, false);
	window.addEventListener("MozTouchUp"  , myUp  , false);
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

function addObject(id, type, x, y, z, size, rotation, desc, src) {

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

	if(type == VIDEO)
	{
		tempImage.image = document.createElement('video');
		tempImage.image.src = src;
		document.body.appendChild(tempImage.image);
		var newid = objects.push(tempImage) - 1;
		objects[newid].image.newid = newid;
	}
	else if(type == IMAGE)
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
	e.target.height = e.target.videoHeight;
	e.target.width = e.target.videoWidth;
	objects[e.target.newid].aspectRatio = e.target.height / e.target.width; 
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
	
	render();
}

function convertx(x, size) {return (x - (size/2)) * window.innerWidth ;}
function converty(y, size, aspectRatio) {return (y * window.innerHeight - ((size/2)* aspectRatio) * window.innerWidth);}
function convertSize(size) {return size * window.innerWidth;}

function drawImage(image)
{
	var size = convertSize(image.size);
    // console.log("drawImage " + v.width + ", " + v.height);
    ctx.save();  // Save co-ordinate system
    ctx.translate(image.x * window.innerWidth, image.y * window.innerHeight);
    ctx.rotate(image.rotation * Math.PI / 180);

    if((drag_flag || rotate_flag || resize_flag) && image.z == maxz)    
    {
    	ctx.shadowOffsetX = 10;
    	ctx.shadowOffsetY = 10;
    	ctx.shadowBlur    = 10;
    	ctx.shadowColor   = 'rgba(0, 0, 0, 0.5)';    
    }
    
    // Frame around each item
    ctx.beginPath(); 
    ctx.rect(-0.5*size-10, -0.5 * size * image.aspectRatio -25, size+20, (size * image.aspectRatio)+50);	
    ctx.fillStyle = "#FFFFFF"; 
    ctx.fill();

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur    = 0;
    ctx.shadowColor   = 'rgba(0, 0, 0, 0)';    

    if(fontsLoaded)
    {
    	ctx.fillStyle = "#000000"; 
    	ctx.font = "20px 'Loved by the King', cursive";
    	ctx.textBaseline = "middle";
    	ctx.textAlign = "center";
    	ctx.fillText(image.desc, 0, 0.5*size*image.aspectRatio + 5, size);
    }

    ctx.drawImage(image.image, -0.5*size, -0.5*size * image.aspectRatio - 15, size, (size * image.aspectRatio));

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
	console.log("myDown");
	if (e.streamId == null)
		{
		if (touches[2].active || touches[3].active || touch == true)
			return
		console.log("Click");
		touch = false;
		canvas.onmouseup = myUp;
		}
	else
		{
		touch = true;
		console.log("Touch: " + e.streamId);
	    touches[e.streamId].active = false; //reset
		}
	
    currentX = e.pageX;
    currentY = e.pageY;
    
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
		if (    objects[i].loaded && touch == false &&
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
			if (removeIcons != null) clearTimeout(removeIcons);
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
				touches[e.streamId].x = e.clientX;
				touches[e.streamId].y = e.clientY;
			    touches[e.streamId].active = true;
//				if (e.streamId == 3 && (touches[2].object != touches[3].object))
//					touches[2].object = touches[3].object - 1;
//				if (e.streamId == 2 && (touches[2].object != touches[3].object))
//					touches[3].object = touches[2].object - 1;
				
//				if (e.streamId == 3 && (touches[2].object == touches[3].object))
//					{
//					touches[2].oldx = touches[2].x;
//					touches[2].oldy = touches[2].y;
//					}
				console.log("Object: " + objects[i].id);
				touches[e.streamId].object = objects[i].id;
				touches[e.streamId].oldx = e.pageX;
				touches[e.streamId].oldy = e.pageY;
				touches[e.streamId].tempx = temp_x;
				touches[e.streamId].tempy = temp_y;
		    	touches[e.streamId].x = e.pageX;
		    	touches[e.streamId].y = e.pageY;	
				
				window.addEventListener("MozTouchMove", myMove, false);
				canvas.onmousemove = null;
				touch_flag = true;
			}
			else
			{
				drag_flag = true;
				imageId = i;
				canvas.onmousemove = myMove;
				moved_flag = false;
				displayIcons = true;  
				if (removeIcons != null) clearTimeout(removeIcons);
			}
			
			return;
		}

	}
}

function myTouchMove(e){
	touches[e.streamId].x = e.clientX;
	touches[e.streamId].y = e.clientY;
}
function myTouchUp(e){
	touches[e.streamId].x = e.clientX;
	touches[e.streamId].y = e.clientY;
	touches[e.streamId].active = false;
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
    if (e.type != "MozTouchMove") moved_flag = true;
    else
   // if (touch && e.streamId != null)
    {
    	//Work around for hyper sensitive touch events
    	if ( (e.pageX < touches[e.streamId].oldx - 3) || (e.pageX > touches[e.streamId].oldx + 3) || (e.pageY < touches[e.streamId].oldy - 3) || (e.pageY > touches[e.streamId].oldy + 3) ) moved_flag = true;
    		
    		
    	if (touches[e.streamId].active == false) return;
    	objectId = findObjectId(touches[e.streamId].object);
    	//console.log(e.streamId + ":" + touches[e.streamId].object);
    	touches[e.streamId].x = e.clientX;
    	touches[e.streamId].y = e.clientY;	

		single_touch_flag = ((touches[2].active && touches[3].active && (touches[2].object == touches[3].object)) == false);
    	if (single_touch_flag == false)
    	{
    		if (multitouch == false) 
    		{
    			multitouch = true;

    			touches[2].oldx = touches[2].x;
    			touches[2].oldy = touches[2].y;
    			touches[3].oldx = touches[3].x;
    			touches[3].oldy = touches[3].y;

    			temp_x = (objects[objectId].x * window.innerWidth) - (touches[2].oldx + touches[3].oldx) / 2;
    			temp_y = (objects[objectId].y * window.innerHeight) - (touches[2].oldy + touches[3].oldy) / 2;

    			resise_ratio = objects[objectId].size / (Math.sqrt (Math.pow((touches[2].y - (objects[objectId].y * window.innerHeight)),2) + Math.pow((touches[2].x - (objects[objectId].x * window.innerWidth)),2) ));
    			clean_angle(rotate_offset = Math.atan2((touches[2].y - touches[3].y) , (touches[2].x - touches[3].x)) * 180 / Math.PI - objects[objectId].rotation);
    		}
    		if (e.streamId == 2)
    		{
    			objects[objectId].rotation = clean_angle(Math.atan2((touches[2].y - touches[3].y) , (touches[2].x - touches[3].x)) * 180 / Math.PI - rotate_offset);
    			//objects[objectId].rotation = (Math.atan2((touches[2].y - (objects[objectId].y * window.innerHeight)) , (touches[2].x - (objects[objectId].x * window.innerWidth))) * 180 / Math.PI - rotate_offset);
    			objects[objectId].size = (Math.sqrt(Math.pow((touches[2].y - (objects[objectId].y * window.innerHeight)),2) + Math.pow((touches[2].x - (objects[objectId].x * window.innerWidth)),2)) * resise_ratio );
    			objects[objectId].x = (((touches[2].x + touches[3].x) / 2) + temp_x) / window.innerWidth;
    			objects[objectId].y = (((touches[2].y + touches[3].y) / 2) + temp_y) / window.innerHeight;
    		}
    	}
    	else
    	{
    		if (multitouch == true)
    		{

    			touches[e.streamId].tempx = (objects[objectId].x * window.innerWidth) - e.pageX;;
    			touches[e.streamId].tempy = (objects[objectId].y * window.innerHeight) - e.pageY;;

    		}
    		multitouch = false;
    		objects[objectId].x = (touches[e.streamId].x + touches[e.streamId].tempx) / window.innerWidth;
    		objects[objectId].y = (touches[e.streamId].y + touches[e.streamId].tempy) / window.innerHeight;
    	}
    	render(); //Increase Framerate while moving an object
    }
    currentX = e.pageX;
    currentY = e.pageY;
	if (drag_flag)	{
		objects[imageId].x = (e.pageX + temp_x) / window.innerWidth;
		objects[imageId].y = (e.pageY + temp_y) / window.innerHeight;
		render(); //Increase Framerate while moving an object
	}
	if (rotate_flag)	{
		objects[imageId].rotation = clean_angle(Math.atan2((e.pageY - (objects[imageId].y * window.innerHeight)) , (e.pageX - (objects[imageId].x * window.innerWidth))) * 180 / Math.PI - rotate_offset);
		objects[imageId].size = (Math.sqrt(Math.pow((e.pageY - (objects[imageId].y * window.innerHeight)),2) + Math.pow((e.pageX - (objects[imageId].x * window.innerWidth)),2)) * resise_ratio );
		if (objects[imageId].size < 0.05) objects[imageId].size = 0.05;
		render(); //Increase Framerate while moving an object
	}
}

function myUp(e){
	console.log("myUp");
	canvas.onmouseup = null;
	if (e.streamId != null)
	{
		touches[e.streamId].active = false;
		

    	objectId = findObjectId(touches[e.streamId].object);
		imageId = objectId;
		console.log("TouchUp: " + e.streamId);
		
	}
	//else
	{
	    currentX = e.pageX;
	    currentY = e.pageY;
		canvas.onmousemove = null;
		removeIcons=setTimeout("displayIcons = false;",3000);
		if (moved_flag == false && (drag_flag || touch_flag)) {
			if (objects[imageId].type == VIDEO) {
				console.log("Play Video");
				if(objects[imageId].image.paused ||  objects[imageId].image.ended) objects[imageId].image.play(); else objects[imageId].image.pause();
			}
		}
		if(drag_flag || single_touch_flag){

			if (	(currentX >= binX ) &&
					(currentX <= binX + binSize) &&
					(currentY >= binY) &&
					(currentY <= binY + binSize)  )
			{
				$.ajax({
					url: "ajax-delete.php",
					cache: false,
					data: {id:objects[imageId].id},
					dataType: "script"
				});
				objects.splice(imageId, 1);
			}
			else
			{
				$.ajax({
					type: "GET",
					url: "ajax-update.php",
					data: {
						id: objects[imageId].id,
						x: objects[imageId].x,
						y: objects[imageId].y,
						z: objects[imageId].z,
						size: objects[imageId].size,
						rotation: objects[imageId].rotation
					},
					cache: false,
					success: function(html){
						sequence = html;
					}
				});
			}

		}
	}
	if (touches[2].active == 0 && touches[3].active == 0)
	{
		touch_flag = false;
		touch = false;
		removeEventListener("MozTouchMove", myMove, false);
	}
	moved_flag = false;
	drag_flag = false;
	rotate_flag = false;
	resize_flag = false;
	single_touch_flag = false;
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
	if (drag_flag || rotate_flag || videoPlaying || touch_flag)
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
    		var mag_to_corner = Math.sqrt(Math.pow(convertSize(objects[i].size),2) + Math.pow((convertSize(objects[i].size) * objects[i].aspectRatio + 30),2)) / 2;

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
    if(touches[2].active) ctx.drawImage(target, touches[2].x - 20 , touches[2].y - 20 , 40, 40);
    if(touches[3].active) ctx.drawImage(target, touches[3].x - 20 , touches[3].y - 20 , 40, 40);
}

init();
canvas.onmousedown = myDown;//function () {setTimeout(myDown,10);};



