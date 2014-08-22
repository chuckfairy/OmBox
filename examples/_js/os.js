/****************************OmBox Creation****************************/
//Set up OmBoxes
var aboutOmBox = new OmBox("aboutOmBox", {
	theme: "OmDefault",
	title: "About OmBox"
});

var docBox = new OmBox("documentation", {
	title: "Documentation",
	theme: "wannaBe",
	classOn: "OmBoxHideOn",
	classOff: "OmBoxHideOff"
});

var downloadBox = new OmBox("download", {
	title: "Download",
	classOn: "OmBoxSlideUp",
	classOff: "OmBoxSlideDown"
});

var settingsBox = new OmBox("settings", {
	title: "Settings",
	classOn: "OmBoxExciteOn",
	classOff: "OmBoxExciteOff"
});

var aceBox = new OmBox("aceApp", {
	theme:"OmDefault",
	title:"Ace Code Editor"
});

var tinymceBox = new OmBox("tinymceApp", {
	theme: "OmDefault",
	title: "TinyMCE",
	footer: false
});


/****************************Simple Select****************************/
//Load apps selections and page togglers 
window.onload = function() {
	//Resize app bars
	resizeApps();
		
	////////Set up tinyMCE//////
	tinymce.init({
    	selector: "textarea#tinymceArea",
    	height: 800
    });
	
	////////Set up ace editor//////
	var aceArea = document.getElementById("aceTextarea");
	var aceEditor = ace.edit(aceArea);
	aceEditor.getSession().setUseWrapMode(true);
	aceEditor.setTheme("ace/theme/chrome");
	
	////////Set up ace settings//////
	document.getElementById("aceMode").onchange = function() {
		var thisLang = this.value;
		if(thisLang === "Select Code Mode") {return false;}
		aceEditor.getSession().setMode("ace/mode/" + thisLang);
	}		
	document.getElementById("aceTheme").onchange = function() {
		var thisTheme = this.value;
		if(thisTheme === "Select Theme") {return false;}
		aceEditor.setTheme(thisTheme);
	}
	
	////////Doc box + Window page toggler////////
	var docPageNav = document.getElementById("docNav").getElementsByTagName("a");
	var docWrap = document.getElementById("docContent");
	var docPages = docWrap.getElementsByTagName("div");
	
	var docPageToggler = new PageToggler(docPageNav, docPages, {keyAttribute: "data"});
	
	prettyPrint();//Code highlighter
	
	//Get current OmBox.js data//
	function loadOmBoxJs(responseText) {
		var OmBoxJs = document.getElementById("OmBoxJs");
		OmBoxJs.innerHTML = responseText;
		var OmBoxJsEditor = ace.edit("OmBoxJs");
		OmBoxJsEditor.setReadOnly(true);
		OmBoxJsEditor.getSession().setUseWrapMode(true);
		OmBoxJsEditor.setTheme("ace/theme/terminal");
		OmBoxJsEditor.getSession().setMode("ace/mode/javascript");
	}
	ajaxGetPage("OmBox.js", loadOmBoxJs);

	////////Settings box////////
	//Theme and animation change selects
	function themeChange(theme) {
		for(var i = 0; i < OmBoxes.length; i++) {
			OmBoxes[i].setTheme(theme);
		}
	}
	
	function animationChange(anis) {
		var ani = anis.split(" + ");
		for(var i = 0; i < OmBoxes.length; i++) {
			OmBoxes[i].window.classList.remove(OmBoxes[i].classOn);
			OmBoxes[i].window.classList.remove(OmBoxes[i].classOff);
			OmBoxes[i].classOn  = ani[0];
			OmBoxes[i].classOff = ani[1];
		}
		
		settingsBox.refresh(1000);
	}
	
	simpleselect("chuckSelect", themeChange);
	simpleselect("aniSelect", animationChange);
	
	var themeSelect = document.getElementById("themeSelect");
	var animationSelect = document.getElementById("animationSelect");
	
	//Overlay
	var overlayButton = document.getElementById("overlayButton");
	
	var ov_i = 0;
	overlayButton.onclick = function() {
		if(ov_i === 0) {
			settingsBox.overlayCreate();
			settingsBox.refresh(1000);
			ov_i++;
		} else {
			console.log("SOMETHING");
			settingsBox.close();
			settingsBox.overlay= false;
			settingsBox.refresh(1000);
			ov_i--;
		}		
	}
	
	//OmCeption
	var OmCeption = 0;
	var ceptButton = document.getElementById("OmCeption");
	var ceptWindow = document.createElement("span");
	//ceptWindow.id  = "OmCeptionBox";
	var OmCeptionBox = new OmBox(ceptWindow, {});
	
	ceptButton.onclick = function() {
		if(!OmCeption) {
			var OmCeptionData = document.createElement("iframe");
			OmCeptionData.src = "http://chuckfairy.com/OmBox/index.html";
			OmCeptionBox.setData(OmCeptionData);
			document.body.innerHTML = "";
			document.body.appendChild(OmCeptionBox.window);
			OmCeptionBox.show();
			OmCeption++;
		}
		
		else {
			OmCeptionBox.close();
			setTimeout(function(){
				document.body.innerHTML = OmCeptionBox.getData();
				OmCeptionBox.setData("");
				OmCeption--;
			},500);
		}
	}
	
}

/****************************Simple Select****************************/
//Simple select by chuck fairy
function simpleselect(thisClass, loadfunction) {
	
	var load = loadfunction || false;
	this.isOn = 1;
	

	function setupSelector(selector) {
		var t = this;
	
		if(typeof(selector) == "undefined") {return false;}
		var topSelect = selector.firstChild;
		var selections = selector.getElementsByTagName("span")[0];
		var selectionLink = selections.getElementsByTagName("a");
		
		for(var i=0; i < selectionLink.length;  i++) {
			selectionLink[i].onclick = function() {
				topSelect.innerHTML = this.innerHTML;
				if(load) {
					load(this.innerHTML);
				}
				selections.style.display = "none";
				selections.style.zIndex = "-5";
				t.isOn = 0;
			}
			
			
		}
		
		selections.style.display = "none";
		selections.style.zIndex = "-5";
		
		t.isOn = 0;
		topSelect.onclick = function() {
			t.isOn = 0;
			selections.style.display = "block";
			selections.style.zIndex = "5";
			setTimeout(function(){
				document.onclick = function() {
					if(t.isOn) {
						selections.style.display = "none";
						selections.style.zIndex = "-5";
					}
					document.onclick = null;	
				}
			}, 300);
			
			t.isOn = 1;
		}		
	}

	//Simple select fallback
	thisClass = thisClass || "simpleselect";
	if(!isset(document.getElementsByClassName)) {return false;}
	var simpleSelects = document.getElementsByClassName(thisClass);
	for(var i=0; i < simpleSelects.length;i++) {
		setupSelector(simpleSelects[i]);
	}
}

//Change icon view based on height
var applicationBlock = document.getElementById("applicationsLoad");

function resizeApps(){
	var appButtons = applicationBlock.getElementsByTagName("a");
	var moreApps = document.createElement("div");
	moreApps.className = "applications";
	moreApps.appendChild(appButtons[appButtons.length -1]);
	moreApps.appendChild(appButtons[appButtons.length -1]);
	moreApps.appendChild(appButtons[appButtons.length -1]);
	document.body.insertBefore(moreApps, applicationBlock.nextSibling);
}

/****************************Page Toggler****************************/
//Use for page tabs and loading
//Expects links to have data or href to find divs
//Divs finds all with matching key as data attribute
function PageToggler(keys, toggleDivs, customize) {
	
	//Check customizeable interface
	//classes are for display, attribute if for grabbing
	if(typeof(customize) == "undefined") {customize = false;}
	this.classOn  = customize.classOn  || "opacityOn";
	this.classOff = customize.classOff || "opacityOff";
	this.keyAttribute = customize.keyAttribute || "href";
	
	if(!isset(keys)) {return false;}
	if(!isset(toggleDivs)) {return false;}
	
	this.keys = keys;	
	keysArray=[];
	for(var i=0; i<this.keys.length; i++) {
		keyData = this.keys[i].getAttribute(this.keyAttribute);
		if(this.keyAttribute == "href") {
			keyData = keyData.split("#")[1];	
		}
		keysArray.push(keyData);
	}
	
	var pages = [];
	for(var i=0; i<toggleDivs.length; i++) {
		var page = toggleDivs[i];
		var pageData = page.getAttribute("data");
		if(in_array(pageData, keysArray)) {	
			pages.push(page);
		}
	}
	
	this.toggleDivs = pages;
	this.init();
}

PageToggler.prototype = {
	init: function() {
		var t = this;
		this.clear();
		this.buttonEnable();
		if(this.keyAttribute !== "href") {
			this.show(this.keys[0]);
		} else {
			var hashChange = t.hrefLoad;
			hashChange = hashChange.bind(t);
			thisWindow.addHashChange(hashChange);
		}
	},


	buttonEnable: function() {
		var thisToggler = this;
		
		for(var i=0; i<this.keys.length;i++) {
			this.keys[i].onclick = function(){
				thisToggler.show(this);
			}
		}
	},

	clear: function() {
		for(var i=0; i<this.toggleDivs.length;i++) {
			this.toggleDivs[i].removeAttribute("class", this.classOn);
			this.toggleDivs[i].setAttribute("class", this.classOff);
		}
		
		for(var i=0; i<this.keys.length;i++) {
			this.keys[i].className = "";
		}
	},
	
	show: function(keyA) {
		this.clear();
		var keyData = keyA.getAttribute(this.keyAttribute);
		if(this.keyAttribute == "href") {
			keyData = keyData.split("#")[1];
		}
		
		for(var i=0; i<this.toggleDivs.length;i++) {
			if(this.toggleDivs[i].getAttribute("data") === keyData) {
				this.toggleDivs[i].removeAttribute("class", this.classOff);
				this.toggleDivs[i].setAttribute("class", this.classOn);
			}
		}
		keyA.className = "selected";
	},
	
	setPage: function(keyData) {
		this.clear();
		for(var i=0; i<this.toggleDivs.length;i++) {
			if(this.toggleDivs[i].getAttribute("data") === keyData) {
				this.toggleDivs[i].removeAttribute("class", this.classOff);
				this.toggleDivs[i].setAttribute("class", this.classOn);
			}
		}
	},
	
	//Load a page by href
	hrefLoad: function(hash) {
		
		//Find key
		if(hash == "") {hash = "home";}
		for(var i = 0; i < this.keys.length;i++) {
			var keyData = this.keys[i].getAttribute(this.keyAttribute);
			keyData = keyData.split("#")[1];
			if(keyData == hash) {
				this.show(this.keys[i]);
				return true;
			}
		}	
	}
}

/****************************Utils Toggler****************************/

function ajaxGetPage(page, callback) {
	page = page || "";
	
	var request = new XMLHttpRequest();
	request.open("GET", page, true);	
	request.setRequestHeader("Content-Type", "application/html");
	//request.responseType = "text";
	request.onreadystatechange = function() {
		if(request.readyState === 4 && request.status===200) {
			var responseText = this.response;
			callback(responseText);
		}
	}
	request.send(null);
}