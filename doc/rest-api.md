# Canvas REST Application Programming Interface

## Introduction

Canvas is implemented as two independent components:

* A "front end" which is typically a browser, but could be something 
  different like a Qt application.
* A "back end" which could be for example:
  * An apache-MySQL-PHP stack.
  * A django app.
  * A couchapp.
  
The front end and back end communicate using HTTP. This document defines the 
future format of that HTTP communication.

## Representational State Transfer

Canvas will use Representational State Transfer (REST) because it offers:

* A clean interface that is widely understood.
* The option of adding HTTP authentication late.
* The option of adding caching, proxies, security firewalls and suchlike.

## Canvas Application Programming Interface (API)

### Concepts

#### Group

A group is a group of items or other groups. There is always at least one group 
(the default is called @default_group). Groups and items that have `null` 
parents belong to this group. There can be more than one group 
on the canvas. 

Groups can be used to implement advanced functionality such as:

  * Workspaces (multiple canvas screens).
  * Groups of items to be manipulated as one (moving, zooming, deleting etc.).

#### Item

An `item` is a single item such as an image or video to be displayed on the 
canvas.

In the future, we may have authenticated users. Once authenticated, they will 
be identified using the special name `@me`. In the meantime, @me will 
mean the default user.

### Data format

Data is transferred with HTTP headers in JSON format.

Each group and item is uniquely identified by an id field which is a 
40-character SHA1 hash.

The item id is the hash of the content field and the creation date.

The group id is the hash of the ids of its "children". The children of a 
group are other groups or items which have that group as its parent.

A group has the following data:

    {
        kind: "canvas#group",
        id: "_groupID_",
        parent: "_parentGroupID_",
        selfLink: "/canvas/v1/users/_userID_/groups/_groupID_",
        title: "Group title",
        position: [x, y],
        rotation: degrees_rotation,
        scale: [w, h],
        z_depth: 0,
        opacity: 100
    }

An item has the following data:

    {
        kind: "canvas#item",
        id: "_itemID_",
        parent: "_parentGroupID_",
        selfLink: "/canvas/v1/groups/_groupID_/items/_itemID_",
        title: "Item title",
        contentLink: "http://example.com/file",
        position: [x, y],
        rotation: degrees_rotation,
        scale: [w, h],
        z_depth: 0,
        opacity: 100
    }

Data formats:

* Hash codes, links and titles are strings.
* Position is given by x and y integers in percentage of the view port. 
  Note that x and y positions are defined from the left and TOP of the view port.
* Scale is a decimal number representing the scale factor relative to the 
  original. 
* Rotation is in degrees anti-clockwise.
* z_depth is a positive integer to define which elements are on top of which. 
  The higher the integer, the nearer the top (more visible). Multiple items 
  with equal z position will be ordered by creation date (newer on top).
* Opacity is a positive integer between 0 and 100. Not implemented at the time 
  of writing.

### Requests and responses

The standard URI formats are:

* `/canvas/v1/groups/_groupID_/items?_parameters_`
* `/canvas/v1/users/_userID_/groups?_parameters_`

Requests are HTTP/1.1 requests with a standard HTTP verb (GET, POST, PUT, 
DELETE, PATCH):

* To get an item or group , use GET with an id.
* To insert an item or group, use PUT with no id.
* To edit (update) an item or group, use PUT with an id.
* To delete an item or group, use DELETE with an id.

If a group that contains items is deleted, the items are moved to the default 
group (their parent id is set to `null`).

#### Retrieving a user's groups

Request: `GET /canvas/v1/users/@me/groups`

Response:

    HTTP/1.1 200 OK
    {
        kind: "canvas#groups",
        selfLink: "/canvas/v1/users/@me/groups",
        items: [
            {
                id: _groupID_,
                kind: "canvas#group",
                selfLink: "/canvas/v1/users/@me/groups/_groupID_",
                title: "Group name 1",
                parent: null
            },
            {
                id: _groupID_,
                kind: "canvas#group",
                selfLink: "/canvas/v1/users/@me/groups/_groupID_",
                title: "Group name 2",
                parent: null
            },
            ...
        }
     }
     
#### Retrieving a single group

Request: `GET /canvas/v1/users/@me/groups/_groupID_`

Response:

    HTTP/1.1 200 OK
    {  
        id: _groupID_,  
        kind: "canvas#group",  
        selfLink: "/canvas/v1/users/@me/groups/_groupID_",  
        title: "Group name 1"
    }
    
#### Retrieving a list of the items in a group

Request: `GET /canvas/v1/groups/_groupID_/items`

#### Creating an item

Request:

    PUT /canvas/v1/groups/_groupID_/items`
    Content-Type: application/json
    
    {
        kind: "canvas#item",
        parent: "_parentGroupID_",
        title: "Item title",
        contentLink: "http://example.com/file",
        position: [x, y],
        rotation: degrees_rotation,
        scale: [w, h],
        z_depth: 0,
        opacity: 100
    }

Response:

    HTTP/1.1 200 OK
    {
        kind: "canvas#item",
        id: "_itemID_",
        parent: "_parentGroupID_",
        selfLink: "/canvas/v1/groups/_groupID_/items/_itemID_",
        title: "Item title",
        contentLink: "http://example.com/file",
        position: [x, y],
        rotation: degrees_rotation,
        scale: [w, h],
        z_depth: 0,
        opacity: 100
    }

#### Deleting an item

Request: `DELETE /canvas/v1/groups/_groupID_/items/_itemID_`

### HTTP/1.1 responses used by canvas

* `200 OK` when the request is successful
* `204 No Content` when a group or item is deleted
* `304 Not Modified` when a PUT has been sent to an item or group which 
  resulted in no change
* `400 Bad Request` when the syntax is bad or incomplete, for example due to 
  malformed or incomplete JSON
* `401 Unauthorized` when the user must be authenticated. Authentication is 
  not used at the time of writing
* `404 Not Found` when the URI does not map to a resource
* `405 Method Not Allowed` when a request was made of a resource using a 
  request method not supported by that resource; for example, using GET on a 
  form which requires data to be presented via POST, or using PUT on a 
  read-only resource
* `409 Conflict` when the request could not be processed because of conflict 
  in the request, such as an edit conflict
* `410 Gone` when the resource requested is no longer available and will not be 
  available again; for example, a resource that has been deleted
* `413 Request Entity Too Large` when the request is larger than the server is 
  willing or able to process, for example for large file sizes
* `414 Request-URI Too Long`
* `415 Unsupported Media Type` when he request entity has a media type which 
  the server or resource does not support. For example, the client uploads an 
  image as image/svg+xml, but the server requires that images use a different 
  format
* `429 Too Many Requests` when the user has sent too many requests in a given 
  amount of time
* `500 Internal Server Error`. Hopefully this never happens!
