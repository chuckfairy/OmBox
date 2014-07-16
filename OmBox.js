

/****************************OmBox****************************/

//Globals
var OmBoxThemes = [];




function OmBox(boxId, topId, customize) {
	//if(typeof id == "undefined" || typeof topId == "undefined") {return false;}
	this.window = document.getElementById(boxId);
	this.boxTop = document.getElementById(topId);
	
	if(typeof(this.boxTop) === "undefined" || 
	   typeof(this.boxTop) === "undefined") {return false;}
		
	//Customize	
	this.theme = customize.theme || "default";
	
	
	//Script location
	var scripts = document.getElementsByTagName("script");
	for(var i=0;i < scripts.length;i++) {
		var scriptLocation = scripts[i].src.split("OmBox.js");
		if(scriptLocation.length === 2) {
			this.serverLocation = scriptLocation[0]; 
		}
	};
	
	this.init();
}

OmBox.prototype = {
	//Initialization of buttons and functions
	init: function() {
		this.buttonEnable();
		this.setTheme(this.theme);
		return this;
	},
	
	buttonEnable: function() {
		var thisOm = this;
	
		//Box Show and Hide
		this.boxTopLinks = this.boxTop.getElementsByTagName("a");
		for(var i = 0; i < this.boxTopLinks.length;i++) {
			if(this.boxTopLinks[i].className == this.theme + "X") {
				this.boxTopLinks[i].onclick = function(){thisOm.close()};
			}	
			
			if(this.boxTopLinks[i].className == this.theme + "Full") {
				this.boxTopLinks[i].onclick = function(){thisOm.fullSize()};
			}	
			
			if(this.boxTopLinks[i].className == this.theme + "Out") {
				this.boxTopLinks[i].onclick = function(){thisOm.moveOut()};
			}
			
			if(this.boxTopLinks[i].className == "OmBoxHeader") {
				this.moveable(this.boxTopLinks[i]);
			}	
		}		
	},
	//Show Hide and Fullscreen Functions
	show: function() {
		this.window.style.display = "block";
		this.window.style.opacity = 1;
	},
	
	close: function() {
		this.window.style.opacity = 0;
		var thisWindow = this.window;
		setTimeout(function(){
			thisWindow.style.display = "none";	
		},1000);
	},
	
	fullSize: function() {
		if(this.window.style.width == "100%") {
			this.window.style.top = "2em"
			this.window.style.width  = "95%";
			this.window.style.height = "80%";
			document.body.style.overflow = "auto";
		} else {
			this.window.style.top = "0";
			this.window.style.left = "0";
			this.window.style.width  = "100%";
			this.window.style.height = "100%";
			document.body.style.overflow = "hidden";
		}
	},
	
	moveOut: function() {
		var newWindow = window.open('','mywindow','width=600,height=600');
		var newClone = this.window.innerHTML;
		newWindow.document.body.innerHTML = newClone;
		
	},
	
	moveable: function(header) {
		var thisOm = this;
		console.log(this.window.offsetLeft);
		header.onmousedown = function(e){
			var mousePosition = getMouseXY(e);
			var lastPosition = mousePosition["x"];
			document.body.onmousemove = function(e) {
				var mousePosition = getMouseXY(e);
				var mouseMove = (lastPosition - mousePosition["x"]);
				var newX = thisOm.window.style.left.split("px")[0] - mouseMove;
				
				console.log(newX);
				//var newY = thisOm.window.offsetWidth - mousePosition[""]
				thisOm.window.style.left = (newX) + "px";
				thisOm.window.style.top = (mousePosition["y"] - 11) + "px";
				
				
				lastPosition = mousePosition["x"];
			}
		}
		window.onmouseup = function(t){thisOm.stopMove(header);}
	},
	stopMove: function(header){
		header.onmousedown = null;
		document.body.onmousemove = null;
		this.moveable(header);
	}
}

/****************************Themes****************************/

OmBox.prototype.setTheme = function(theme) {
	//Check if theme is loaded
	if(!in_array(theme, this.themes)) {
		cssUrl = this.serverLocation + "_themes/" + theme + ".css";		
		//Load and Append Css
		if(typeof(cssUrl) !== "undefined") {
			var wilsonCSS = document.createElement("link");
			wilsonCSS.href = cssUrl;
			wilsonCSS.rel = "stylesheet";
			document.head.appendChild(wilsonCSS);
		}
		
		OmBoxThemes.push(theme);
	}
	
	this.window.className = theme;
	this.boxTop.className = theme + "Top";
}


/****************************Utils****************************/

function getMouseXY(e) {
	var mouseCoords = {};
	mouseCoords["x"] = e.pageX;
	mouseCoords["y"] = e.pageY;

    if (mouseCoords["x"] < 0){mouseCoords["x"] = 0;}
    if (mouseCoords["y"] < 0){mouseCoords["y"] = 0;}  

    return mouseCoords;
}


function isset(value) {
	if(typeof(value) == "undefined") {return false;}
	else if(value == null) {return false;}
	else {return true;}
}

function in_array(needle, haystack, argStrict) {
//  original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)

	var key = '',
	strict = !! argStrict;
	if (strict) {
		for (key in haystack) {
			if (haystack[key] === needle) {return true;}
		}
	} else {
		for (key in haystack) {
			if (haystack[key] == needle) {return true;}
		}
	}
	return false;
}
