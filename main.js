/******************************************************************************
 *
 * Copyright (c) 2011 Cambridge Design Partnership
 * All rights reserved.
 * 
 * This file is part of the Canvas Project
 *
 * Commercial Usage
 * Licensees holding a commercial license for the Canvas Project are provided
 * with the rights agreed when taking out this license and are bound to these
 * terms in perpetuity.
 *
 * GNU Lesser General Public License Usage
 * Alternatively, this file may be used under the terms of the GNU Lesser
 * General Public License version 2.1 as published by the Free Software
 * Foundation and appearing in the file LICENSE.LGPL included in the
 * packaging of this file.
 * Please review the following information to ensure the GNU Lesser General
 * Public License version 2.1 requirements will be met:
 * http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
 *
 ******************************************************************************/

//CONSTANTS
IMAGE = 0;
VIDEO = 1;

UPDATE = 0;
REFRESH = 1;

//GLOBALS
var drag_flag = false; 
var rotate_flag = false; 
var resize_flag = false;
var move_flag = false; 
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

var hotspot_size = 40;
var removeIcons;

    var bgImage = new Image;
    bgImage.src = "bg.png";
    bgImage.onload = function(){bgImage.loaded = true;console.log("Background Loaded");render();};
    var rotateImage = new Image;
    rotateImage.src = "ball.png";

v = document.getElementById('v');

function draw(v) {
    if(v.paused || v.ended) return false;
	render();
    setTimeout(draw,50,v);
}
	
function init()
{
	canvas = document.getElementById("myCanvas");
	ctx=canvas.getContext("2d");
        resize();
	
	console.log("Initialisation");
    Refresh=setInterval("ajaxFunction(0,REFRESH);",5000);
}

function CanvasImage() {
        this.id = 0;
        this.type  = IMAGE;
	this.x = 0.5;
	this.y = 0.5;
	this.z = 0;
	this.size = 1;
	this.rotation = 0;
	this.aspectRatio = 1;
	this.image = new Image();
	this.loaded = false;
}

function addObject(id, type, x, y, z, size, rotation, src) {
    
    console.log("Add: " + src);
    var tempImage = new CanvasImage;
    tempImage.id = id;
    tempImage.type = type;
    tempImage.x = x;
    tempImage.y = y;
    tempImage.z = z;
    tempImage.size = size;
    tempImage.rotation = rotation;
    
    if(type == VIDEO)
        {
        tempImage.image = document.createElement('video');
        tempImage.image.src = src;
        document.body.appendChild(tempImage.image);
        var newid = objects.push(tempImage) - 1;
        objects[newid].image.newid = newid;
        
//        tempImage.image = video;
        
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

window.addEventListener('loadedmetadata', function(e) { 

 //       tempImage.image.onloadedmetadata = function(e){
            console.log("Video " + e.target.src + " Loaded");
            e.target.height = e.target.videoHeight;
            e.target.width = e.target.videoWidth;
            objects[e.target.newid].aspectRatio = e.target.height / e.target.width; 
            objects[e.target.newid].loaded = true;
            render();
   //         }
            }, true);

function resize()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
	
	render();
}

function convertx(x, size) {return (x - (size/2)) * window.innerWidth ;}
function converty(y, size, aspectRatio) {return (y * window.innerHeight - ((size/2)* aspectRatio) * window.innerWidth);}
function convertSize(size) {return size * window.innerWidth;}

function drawImage(image)
{
	var size = convertSize(image.size);
    //console.log("drawImage " + v.width + ", " + v.height);
    ctx.save();  // Save co-ordinate system
    ctx.translate(image.x * window.innerWidth, image.y * window.innerHeight);
    ctx.rotate(image.rotation * Math.PI / 180);


//    {
//    ctx.shadowOffsetX = 0;
//    ctx.shadowOffsetY = 0;
//    ctx.shadowBlur    = 4;
//    ctx.shadowColor   = 'rgba(0, 0, 0, 0.5)';    
//    }
    if((drag_flag || rotate_flag || resize_flag) && image.z == maxz)    
        {
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 10;
        ctx.shadowBlur    = 10;
        ctx.shadowColor   = 'rgba(0, 0, 0, 0.5)';    
        }
    //Frame around each item
    ctx.beginPath(); 
    ctx.rect(-0.5*size-5, -0.5*size * image.aspectRatio-5, size+10, (size * image.aspectRatio)+10);	
    ctx.closePath(); 
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#FFFFFF"; 
    ctx.lineCap = "square";
    ctx.stroke(); 
    
    
    {
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur    = 0;
    ctx.shadowColor   = null;    
    }

    ctx.drawImage(image.image, -0.5*size, -0.5*size * image.aspectRatio, size, (size * image.aspectRatio));

    if (VIDEO == image.type && (image.image.paused ||  image.image.ended))
    	{
    	ctx.beginPath(); 
	    ctx.moveTo(-0.1*size,-0.1*size);
	    ctx.lineTo(-0.1*size, 0.1*size);
	    ctx.lineTo(0.1*size, 0);
	    ctx.closePath(); 
	    ctx.lineWidth = 10;
	    ctx.strokeStyle = "#FFFFFF";  
	    ctx.globalAlpha = 0.2;  
	    ctx.lineJoin = 'round';
	    ctx.stroke(); 
    	}

    ctx.restore();  // Restore co-ordinate system
}

function myDown(e){
	var l = objects.length;
    for (var i = l-1; i >= 0; i--)
	{
		angle_to_TR = Math.atan2(-1*objects[i].image.height, objects[i].image.width) + objects[i].rotation * Math.PI  / 180;
                angle_to_BR = Math.atan2(objects[i].image.height, objects[i].image.width) + objects[i].rotation * Math.PI  / 180;
                angle_to_TL = angle_to_TR + 180 * Math.PI  / 180;
                angle_to_BL = angle_to_BR + 180 * Math.PI  / 180;
                mag_to_corner = Math.sqrt(Math.pow(convertSize(objects[i].size),2) + Math.pow((convertSize(objects[i].size) * objects[i].aspectRatio),2)) / 2 + 5;
		//Rotate hotspot
		if (    (  e.pageX < objects[i].x * window.innerWidth + Math.cos(angle_to_TR)  * mag_to_corner + hotspot_size/2 
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
			temp_x = (e.pageX);
			temp_y = (e.pageY);
			resise_ratio = objects[i].size / (Math.sqrt(Math.pow((e.pageY - (objects[i].y * window.innerHeight)),2) + Math.pow((e.pageX - (objects[i].x * window.innerWidth)),2) ));
			rotate_offset = Math.atan2((temp_y - (objects[i].y * window.innerHeight)) , (temp_x - (objects[i].x * window.innerWidth))) * 180 / Math.PI - objects[i].rotation;
                        rotate_flag = true;
			resize_flag = true;
			imageId = i;
			canvas.onmousemove = myMove;
                        displayIcons = true;
                        if (removeIcons != null) clearTimeout(removeIcons);
			return;
		}
		//Move hotspot
		else if (  e.pageX < convertx(objects[i].x, objects[i].size) + convertSize(objects[i].size) + hotspot_size/2 
                        && e.pageX > convertx(objects[i].x, objects[i].size) - hotspot_size/2
                        && e.pageY < converty(objects[i].y, objects[i].size, objects[i].aspectRatio) + (convertSize(objects[i].size) * objects[i].aspectRatio) + hotspot_size/2
                        && e.pageY > converty(objects[i].y, objects[i].size, objects[i].aspectRatio) -hotspot_size/2)	
		{ // TODO: Improve move hotspot to support rotation
                    
                        if (objects[i].z < maxz) {
                            objects[i].z = maxz+1;
                            objects.sort(sortNumber);
                            render();
                            myDown(e); 
                            return;
                        }
                        
			temp_x = (objects[i].x * window.innerWidth) - e.pageX;
			temp_y = (objects[i].y * window.innerHeight) - e.pageY;
			drag_flag = true;
			imageId = i;
			canvas.onmousemove = myMove;
                        moved_flag = false;
                        displayIcons = true;  
                        if (removeIcons != null) clearTimeout(removeIcons);
			return;
		}
	}
}

function myMove(e){
        moved_flag = true;
	if (drag_flag)	{
		objects[imageId].x = (e.pageX + temp_x) / window.innerWidth;
		objects[imageId].y = (e.pageY + temp_y) / window.innerHeight;
		render();
	}
	if (rotate_flag)	{
		objects[imageId].rotation = (Math.atan2((e.pageY - (objects[imageId].y * window.innerHeight)) , (e.pageX - (objects[imageId].x * window.innerWidth))) * 180 / Math.PI - rotate_offset);
		render();
	}
	if (resize_flag)	{
		objects[imageId].size = (Math.sqrt(Math.pow((e.pageY - (objects[imageId].y * window.innerHeight)),2) + Math.pow((e.pageX - (objects[imageId].x * window.innerWidth)),2)) * resise_ratio );
		if (objects[imageId].size < 0.05) objects[imageId].size = 0.05;
                render();
	}
}

function myUp(){
	canvas.onmousemove = null;
        removeIcons=setTimeout("displayIcons = false;",3000);
	if (moved_flag == false && drag_flag) {
            if (objects[imageId].type == VIDEO) {
		console.log("Play Video");
		if(objects[imageId].image.paused ||  objects[imageId].image.ended) objects[imageId].image.play(); else objects[imageId].image.pause(); 
		
		draw(objects[imageId].image);
            }
	}
        else
            {
            //console.log(sequence);
            ajaxFunction(imageId, UPDATE);
            }
	moved_flag = false;
	drag_flag = false;
	rotate_flag = false;
	resize_flag = false;
        render();
}
function sortNumber(a,b)
{
    //console.log(a.z + " - " + b.z);
    return a.z - b.z;
}

function render()
{ 
    if(bgImage.loaded) ctx.drawImage(bgImage, 0,0,window.innerWidth, window.innerHeight);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);

    var l = objects.length;
    
    for (var i = 0; i < l; i++) 
	{
        if (objects[i].z > maxz) maxz = objects[i].z;
        //if (objects[i].type == VIDEO) objects[i].loaded =  (objects[i].image.readyState > 0);
        if (objects[i].loaded)
            {
            drawImage(objects[i]);

            angle_to_TR = Math.atan2(-1*objects[i].image.height, objects[i].image.width) + objects[i].rotation * Math.PI  / 180;
            angle_to_BR = Math.atan2(objects[i].image.height, objects[i].image.width) + objects[i].rotation * Math.PI  / 180;
            angle_to_TL = angle_to_TR + 180 * Math.PI  / 180;
            angle_to_BL = angle_to_BR + 180 * Math.PI  / 180;
            mag_to_corner = Math.sqrt(Math.pow(convertSize(objects[i].size),2) + Math.pow((convertSize(objects[i].size) * objects[i].aspectRatio),2)) / 2 + 5;

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
}



//Browser Support Code
function ajaxFunction(id, action){
    var ajaxRequest;  // The variable that makes Ajax possible!

    try{
        // Opera 8.0+, Firefox, Safari
        ajaxRequest = new XMLHttpRequest();
    } catch (e){
        // Internet Explorer Browsers
        try{
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try{
                ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e){
                // Something went wrong
                alert("Your browser broke!");
                return false;
            }
        }
    }
    // Create a function that will receive data sent from the server
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4){
            //objects.length = 0;  
            //render();
            switch(action)
            {
                case UPDATE:
                    sequence = ajaxRequest.responseText;
                    break;
                case REFRESH:
                    eval(ajaxRequest.responseText);
                    break;
            }
        }
    };
    switch(action)
    {
        case UPDATE:
            var queryString = "?id=" + objects[id].id + "&x=" + objects[id].x + "&y=" + objects[id].y + "&z=" + objects[id].z + "&size=" + objects[id].size + "&rotation=" + objects[id].rotation;
            ajaxRequest.open("GET", "ajax-update.php" + queryString, true);
            break;
        case REFRESH:
            var queryString = "?sequence=" + sequence;
            ajaxRequest.open("GET", "ajax-refresh.php" + queryString, true); 
            break;
    }
    ajaxRequest.send(null); 
    //render();
    
}

init();
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;


