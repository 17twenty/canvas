Canvas installation
===================

Requirements
------------

`Canvas` has been tested on Windows 7 using Firefox9.0b2. IE9 and Chrome 15 
will work in time but the browsers do not support multitouch at the time 
of writing.

Firefox Beta can be downloaded from http://www.mozilla.org/beta

Installation
------------

The following instructions work on Windows 7. Canvas should 
work on Linux or Mac OSX with the appropriate adjustments.

1. Install [WAMP](http://www.wampserver.com/en/download.php)
2. Start apache using `Start Menu > start WampServer`
3. Add an apache alias to point to your workspace containing the 
   canvas source files:
   1. Select the WampServer icon in the Windows system tray
   2. Select `Apache > Alias directories > Add an alias...`
   3. Enter something like `canvas` for the alias name and 
      then the path to your public_html directory in the canvas 
      source code on your machine
4. Open a browser (preferably the latest Firefox) and navigate to `localhost`.
   You should see the WampServer home screen. If not, go back and check 
   your settings
5. Select phpmyadmin
6. Select `Databases` and create a new database called `canvas`.
   Leave the type as `Collation`
7. Select the `canvas` database from the menu on the left
8. Select `Import`
9. Browse to `canvas.sql` in the canvas source code and import
10. Select the home icon
11. Select `Privileges`
12. Select `Add new user` and create a new user with the following 
    properties:
    * Host: `localhost`
    * Grant all privileges
13. Navigate to `localhost/canvas` in a web browser
