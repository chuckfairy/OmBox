/****************************OmBox****************************/
"use strict";
//Globals
var OmBoxThemes = [];
var OmBoxes = [];

//Default config
var OMBOX_DEFAULT = {
	
	//Appearence
	theme: "OmDefault",
	title: "",
	resizeable: true,
	classOn:  "OmBoxSlideOn",
	classOff: "OmBoxSlideOff",
	
	//Buttons
	deleteButton: true,
	fullSizeButton: true,
	outButton: true,
	footer: true,
	
	//View
	top: 20,
	overlay: false,
	showDefault: false
}

function OmBox(boxId, customize) {

	//Grab if it is an object or find by id
	if(typeof(boxId) === "object") {this.window = boxId;}
	else {this.window = document.getElementById(boxId);}
	
	if(typeof(customize) === "undefined") {customize = OMBOX_DEFAULT;}
	this.parseCustomize(customize);
    
	if(this.overlay) {this.overlayCreate();}
	
	//Script location
	var scripts = document.getElementsByTagName("script");
	for(var i=0;i < scripts.length;i++) {
		var scriptLocation = scripts[i].src.split("OmBox.js");
		if(scriptLocation.length === 2) {
			this.serverLocation = scriptLocation[0]; 
		}
	};
	//Set up
	this.init();
}

OmBox.prototype = {
	//Initialization of buttons and functions
	init: function() {
		//Load animations and core styles
		if(OmBoxes.length < 1) {this.loadTheme("OmBoxCore");}
	
        this.contentInit();
		this.headerCreate();
		if(this.footer) {this.footerCreate();}
		this.buttonEnable();
		this.setTheme(this.theme);
		this.clear();
		OmBoxes.push(this);
		
		//Mobile setup
		var isTouchSupported = 'ontouchstart' in window;
		if(isTouchSupported) {this.mobileSetup();}
		
		//Show by default check
		var thisOm = this;
		if(this.showDefault) {setTimeout(function(){thisOm.show();}, 600);}
		
		return this;
	},
	
    contentInit: function() {
        this.contents = this.window.getElementsByTagName("div");
        if(!this.contents[0]) {
            this.contents = document.createElement("div");   
            this.window.appendChild(this.contents);
        } else {
	        this.contents = this.contents[0];
        }
    },    
    
	headerCreate: function() {
		//Create header top, title, and controls span to hold buttons
		this.boxTop = document.createElement("div");
		this.controlsWrap = document.createElement("span");
		this.moveAbleWrap = document.createElement("a");
		this.moveAbleWrap.href = "javascript:void(0)";
		this.titleElement = document.createElement("h3");
		this.titleElement.innerHTML = this.title;
		
		//Create Buttons//
		//Delete Button
		if(this.deleteButton) {
			this.deleteButton = document.createElement("a");
			this.deleteButton.href = "javascript:void(0)";
			this.controlsWrap.appendChild(this.deleteButton);
		}
		//FullSize Button
		if(this.fullSizeButton) {
			this.fullSizeButton = document.createElement("a");
			this.fullSizeButton.href = "javascript:void(0)";
			this.controlsWrap.appendChild(this.fullSizeButton);
		}
		//OutButton 
		if(this.outButton) {
			this.outButton = document.createElement("a");
			this.outButton.href = "javascript:void(0)";
			this.controlsWrap.appendChild(this.outButton);
		}
		
		//Add to boxtop then append to window.
		this.boxTop.appendChild(this.controlsWrap);
		this.moveAbleWrap.appendChild(this.titleElement);
		this.boxTop.appendChild(this.moveAbleWrap);
		
		//Add to the window
		this.window.insertBefore(this.boxTop, this.window.firstChild);		
	},
	
	footerCreate: function() {
		//Create footer and go through footer functions
		this.footer = document.createElement("div");
		this.footer.className = this.theme + "Footer";	
		this.resizeHandle = document.createElement("a");
		this.resizeHandle.href = "javascript:void(0)";
		this.resizeHandle.className = this.theme + "Handle";
		//Append Elements to window
		this.footer.appendChild(this.resizeHandle);
		this.window.appendChild(this.footer);
		
		
	},
	
	
	//Enable Button Funcationality and resizeability
	buttonEnable: function() {
		var thisOm = this;	
		
		this.moveable(this.boxTop);
		//Set up valid buttons
		//Delete uses close() to close the window
		if(this.deleteButton) {
			this.deleteButton.onclick = function() {thisOm.close();}
		}
		//Fullsize
		if(this.fullSizeButton) {
			this.fullSizeButton.onclick = function() {
				thisOm.fullSize();
			}
		}
		//Brings out another window with content. Pretty jenky.
		if(this.outButton) {
			this.outButton.onclick = function() {thisOm.moveOut();}
		}
		//Footer resize
		if(this.resizeHandle) {this.resize(this.resizeHandle);}
		
		
		
		//When clicked will bring to top
		this.window.onclick = function() {thisOm.zTop();}	
	},
	
	
	//Show Hide and Fullscreen Functions
	show: function() {
		this.window.style.display = "block";
		
		//Overlay over other omboxes
		this.zTop();
		
		if(this.overlay) {this.overlay.style.display = "block";}
		
		var om = this;
		setTimeout(function(){
			if(!isset(this.window.classList)) {
				om.window.className = om.theme + " " + om.classOn;
				return true;
			}
			
			om.window.classList.remove(om.classOff);
			om.window.classList.add(om.classOn);			
		},100);
		
		//Change style height to fit window height
		var doc = document.documentElement;
		var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
		this.window.style.top = (top + this.top) + "px";		
	},
	
	close: function() {
		//Toggle On classes
		if(!isset(this.window.classList)) {
			this.window.className = this.theme + " " + this.classOff;
		} else {
			this.window.classList.remove(this.classOn);
			this.window.classList.add(this.classOff);
		}

		var om = this;
		
		if(this.overlay) {
			om.overlay.style.display = "none";
			//document.body.removeChild(om.overlay);
			//om.overlayCreate();
		}
		
		setTimeout(function(){
			om.window.style.display = "none";	
		},1000);
	},
	
	refresh: function(timer) {
		var thisOm = this;
		this.close();
		setTimeout(function(){thisOm.show()}, parseInt(timer));	
	},
	
	clear: function() {
		this.window.style.display = "none";
		if(!isset(this.window.classList)) {
			this.window.className = this.theme + " " + this.classOff;
			return true;
		}
		this.window.classList.remove(this.classOn);
		this.window.classList.add(this.classOff);
	},
	
	//Overlay over other omboxes
	zTop: function() {
		var topOm = 0;
		//Get top OmBoxess z height
		for(var i = 0; i < OmBoxes.length; i++) {
			if(topOm === 0) {topOm = OmBoxes[i].window.style.zIndex || 5;}
			if(parseInt(OmBoxes[i].window.style.zIndex) > topOm) {
				topOm = OmBoxes[i].window.style.zIndex;
			}
		}
		//Set up overlay
		if(this.overlay) {
			this.overlay.style.zIndex = ++topOm;
		}
		this.window.style.zIndex = ++topOm;
	},
	
	overlayCreate: function() {
		this.overlay = document.createElement("div");
		this.overlay.className = "OmBoxOverlay";
		this.overlay.display = "none";
		document.body.appendChild(this.overlay);
	},
	
	fullSize: function() {
		if(this.window.style.width == "100%") {
			this.window.style.top =  "10px";
			this.window.style.width  = "95%";
			this.window.style.height = "80%";
		} else {
			this.window.style.top = "0";
			this.window.style.left = "0";
			this.window.style.width  = "100%";
			this.window.style.height = "100%";
		}
	},
	
	moveOut: function() {
		var newWindow = window.open('','mywindow','width=600,height=600');
		var newClone = this.window.innerHTML;
		newWindow.document.body.innerHTML = newClone;
		
	},
	
	//Set up moveable functionality on chosen element
	moveable: function(header) {
		var thisOm = this;
		
		//Desktop mouse
		header.onmousedown = function(e){
			this.mouseDown++;
			thisOm.move(e);
			if(isset(e)) {e.preventDefault();}
			document.body.onclick = function(){thisOm.stopMove(header);}
		}
		window.onmouseup = function(t){thisOm.stopMove(header);}
		
	},
	
	//Actual move function
	move: function(e) {
		this.zTop();
		var thisOm = this;
		var mousePosition = getMouseXY(e);
		var lastPositionX = mousePosition["x"];
		var lastPositionY = mousePosition["y"];
		document.body.onmousemove = function(e) {
			var mousePosition = getMouseXY(e);
			//Get new x number of moves
			var mouseMoveX = (lastPositionX - mousePosition["x"]);
			var newX = thisOm.window.style.left.split("px")[0] - (mouseMoveX * 1.2);
			
			//Get new y number of moves
			var mouseMoveY = (lastPositionY - mousePosition["y"]);
			var newY = thisOm.window.style.top.split("px")[0] - (mouseMoveY * 1);

			thisOm.window.style.left = (newX) + "px";
			thisOm.window.style.top = (newY) + "px";
			
			lastPositionX = mousePosition["x"];
			lastPositionY = mousePosition["y"];
		}
	},
	
	stopMove: function(header){
		header.onmousedown = null;
		document.body.onmousemove = null;
		document.body.onclick = null;
		this.moveable(header);
	},
	
	//Resize works by user grabbing a handle and calculating size
	resize: function(resizeEl) {
		this.resizeEl = resizeEl;
		var thisOm = this;
		
		//when mouse down called the mouse resize
		this.resizeEl.onmousedown = function(e) {
			thisOm.resizeMouseWatch(e);
			if(isset(e)) {e.preventDefault();}
			window.onmouseup = function() {thisOm.stopResize(thisOm.resizeEl);}
			document.body.onclick = function() {thisOm.stopResize(thisOm.resizeEl);}
		}		
	},
	
	resizeMouseWatch: function(e) {
		var thisOm = this;
		var mousePosition = getMouseXY(e);
		var lastWidth  = thisOm.window.offsetWidth;
		var lastHeight = thisOm.window.offsetHeight - 45
		var lastTop    = thisOm.window.offsetTop;
		
		var lastPositionX = mousePosition["x"];
		var lastPositionY = mousePosition["y"];
		document.body.onmousemove = function(e) {
			var mousePosition = getMouseXY(e);
			//Get x moves
			var mouseMoveX = (lastPositionX - mousePosition["x"]) * 2;
			var newWidth = (lastWidth - mouseMoveX); 
			//Get y moves
			var mouseMoveY = (lastPositionY - mousePosition["y"]);
			var newHeight = lastHeight - mouseMoveY;
			//newHeight = (newHeight - lastTop);
			
			thisOm.window.style.width  = (newWidth + "px");
			thisOm.window.style.height = (newHeight + "px");				
		}
		
	},
	
	stopResize: function(resizeEl) {
		resizeEl.onmousedown = null;
		document.body.onmousemove = null;
		document.body.onclick = null;
		this.resize(resizeEl);
	}
	
	//Overlay black background over 
}


/****************************Data setting and getting methods****************************/
OmBox.prototype.setData = function(dataSet) {
    if(!isset(dataSet)){return false;}
    if(typeof(dataSet) === "object") {
        this.contents.innerHTML = "";
        this.contents.appendChild(dataSet);
        return true;
    } else {
        this.contents.innerHTML = dataSet;   
    }
}

//Return data inside contents div
OmBox.prototype.getData = function() {return this.contents.innerHTML;}


/****************************Themes****************************/
OmBox.prototype.setTheme = function(theme) {
	
	//Check if theme is set
	if(!isset(theme)) {
		console.log("Theme is empty");
		return false;
	}
	
	//Check if theme is loaded
	if(!in_array(theme, OmBoxThemes)) {this.loadTheme(theme);}
	
	
	//Add theme names to needed Objects
	this.theme = theme;
	this.window.className = theme;
	this.boxTop.className = theme + "Top";
	if(this.deleteButton) {this.deleteButton.className = theme + "X";}
	if(this.fullSizeButton) {this.fullSizeButton.className = theme + "Full";}
	if(this.outButton) {this.outButton.className = theme + "Out";}
	if(this.footer) {this.footer.className = theme + "Footer";}
    if(this.contents) {this.contents.className = theme + "Content";}
}

OmBox.prototype.loadTheme = function(theme) {
	if(!in_array(theme, this.themes)) {
		var cssUrl = this.serverLocation + "_themes/" + theme + ".css";		
		
		//Load and Append Css
		if(isset(cssUrl)) {
			var cssLink = document.createElement("link");
			cssLink.href = cssUrl;
			cssLink.rel = "stylesheet";
			if(!isset(document.head)) {
				document.body.insertBefore(cssLink, document.body.firstChild);
			} else {
				document.head.appendChild(cssLink);
			}
			
		}
		//Push theme to used themes
		OmBoxThemes.push(theme);
	}
}

OmBox.prototype.parseCustomize = function(customize) {
	
	var customs = [
		"theme", "title", "resizeable",
		"classOn", "classOff", 
		"deleteButton", "fullSizeButton", "outButton",
		"footer", "top", "overlay", "showDefault"
	];
	
	for(var c = 0; c < customs.length; c++) {
		var custom = customs[c]
		
		if(!isset(customize[customs[c]])) {
			this[custom] = OMBOX_DEFAULT[custom];
		} else {
			this[custom] = customize[custom];
		}
	}
	
	return customize;
}

/****************************Mobile****************************/

OmBox.prototype.mobileSetup = function() {
	//Enable touch for moving box
	
	touchDefault(this.boxTop);
	
	//Enable touch for resizing box
	if(this.footer) {touchDefault(this.footer);}
	
	//Revert to clicks for buttons
	if(this.deleteButton) {
		clickDefault(this.deleteButton);
			
	}
	
	//Setup buttons who were set by onclick
	var thisOm = this;
	//Delete
	if(this.deleteButton) {
		this.deleteButton.ontouchstart = function() {thisOm.close();}
	}
	//Fullsize
	if(this.fullSizeButton) {
		this.fullSizeButton.ontouchstart = function() {thisOm.fullSize();}
	}
	//OutButton
	if(this.outButton) {
		this.outButton.ontouchstart = function() {thisOm.moveOut();}
	}
	
}

function touchHandler(event) {
    var touch = event.changedTouches[0];

    var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function touchDefault(header) {
	header.addEventListener("touchstart", touchHandler, true);
	header.addEventListener("touchmove", touchHandler, true);
	header.addEventListener("touchend", touchHandler, true);
	header.addEventListener("touchcancel", touchHandler, true);
}

function clickDefault(thisElement) {
    thisElement.ontouchstart = thisElement.onclick;
	thisElement.ontouchmove = function() { return true; };
	thisElement.ontouchend = function() { return true; };
	thisElement.ontouchcancel = function() { return true; };
}


/****************************Utils****************************/

function getMouseXY(e) {
	var mouseCoords = {};
	if(!isset(e)) {
		//IE no pageX
		mouseCoords["x"] = event.clientX + document.body.scrollLeft;
		mouseCoords["y"] = event.clientY + document.body.scrollTop;
	} else {
		mouseCoords["x"] = e.pageX;
		mouseCoords["y"] = e.pageY;
	}

    if (mouseCoords["x"] < 0){mouseCoords["x"] = 0;}
    if (mouseCoords["y"] < 0){mouseCoords["y"] = 0;}  

    return mouseCoords;
}


function isset(value) {
	if(typeof(value) == "undefined") {return false;}
	//else if(value == null) {return false;}
	else {return true;}
}

function in_array(needle, haystack, argStrict) {

	var key = '',
	strict = !! argStrict;
	if(strict) {
		for (key in haystack) {if (haystack[key] === needle) {return true;}}
	} else {
		for (key in haystack) {if (haystack[key] == needle) {return true;}}
	}
	return false;
}