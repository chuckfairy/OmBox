[OmBox](http://chuckfairy.com/OmBox)
=====

A javascript window manager for the web

Quick start guide
=====
Include Js file
Create Span or div with an id of your choice
Create OmBox Object with your customizations or relay on defaults.

```html
<span id="om">
	<div>Hello World</div>
</span>

<script type="text/javascript" src="ombox/ombox.js"></script>

<script>
//Your JS OmBox Object
var NewOmBox = new OmBox("om", {
	//Show by default
	showDefault: true
});
</script>
```
			
All Api actions are done to your instances of an OmBox. By default many actions and buttons will be put in place and the theme will be set as the default theme. Configurations are listed in the Config page. Here are some quick snippets to get you started as well.

```javascript
NewOmBox.show(); //show instance of ombox
NewOmBox.close(); //close

NewOmBox.setTheme("wannaBe"); //Set to another theme (best if done in the config)
```

Configuration and customization
=====

Configs are done when setting the OmBox. Below is every configuration currently on OmBox. These are also the default values.

```javascript
var NewOmBox = new OmBox("om", {
  //Appearence
  theme: "OmDefault",
  resizeable: true,
  title: "",
  classOn: "OmBoxSlideOn",
  classOff: "OmBoxSlideOff",

  //Buttons
  deleteButton: true,
  fullSize: true,
  outButton: true,
  footer: true,

  //View
  top: 20,
  overlay: false,
  showDefault: false
});
```

Current Themes
=====

* OmDefault
* wannaBe
* geoff
* darkHorse
<<<<<<< HEAD
* lonestar
=======
* lonestar
>>>>>>> FETCH_HEAD
