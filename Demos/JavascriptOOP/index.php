<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
	"http://www.w3.org/TR/html4/strict.dtd">

<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Object Oriented Javascript with prototyping</title>
	<meta name="author" content="Marcus Westin">
	<!-- Date: 2007-12-22 -->
	<style type="text/css">
	body {
		font-family : arial;
		font-size : .8em;
		color : #678;
	}
	a { 
		text-decoration : none;
		color : #9ab;
	}
	pre {
	        border : 2px solid #bbb;
	        overflow : auto;
		padding : 10px;
		background-color : #ddd;
	}
	a:hover {
		color : #abc;
	}
	div {
		margin-left : 20px;
	}
	.hidden {
		display : none;
	}
	.missMannersGuest {
		font-family : Times;
		font-size : 1.3em;
		padding : 2px;
		margin : 10px;
		width : 350px;
	}
	input {
		color : #567;
	}
	button {
		margin : 4px;
		border : #786;
		color : #876;
	}
	</style>
</head>
<body>
	<h2>Demo: OOP With Javascript - Miss Manners Guest class</h2>
	<p>See tutorial article at <a href="http://marcuswestinblog.blogspot.com/2007/12/object-oriented-programming-with.html">Object Oriented Programming with Javascript
	</a>. 
	<p>This is an exctract of the code used for the <a href="../MissManners/">Miss Manners demo application</a> I wrote on December 22 2007.</p>
</p>
<div>
	<br /><input type="text" id="name" value="Marcus Westin" /> Name 
	<br /><input type="text" id="gender" value="Male" /> Gender
	<br /><input type="text" id="interest" value="Flow" /> Interest
	<br /><input type="text" id="color" value="#cde" /> Color
	<br /><br />
	<button onclick="createGuest('container')">Create Guest</button>
	<button onclick="var s=document.getElementById('script');s.className ? s.className='' : s.className='hidden'">View script</button>
</div>
<div class="hidden" id="script">
	<h3>The script</h3>
	<p>Note that there is the button with a <code>onclick="createGuest('container')"</code> handler</p>
	<code><pre>
		/**
		* Our MissManners application
		*/
		var MissManners = {
			nextUniqueId : 0
		};

		/**
		* A miss manners guest
		* @constructor
		* @param {Object} params The parameters object. All other parameters are named properties of this object
		* @param {String} name The guest name
		* @param {String} gender The guest gender. 'male' or 'female'
		* @param {String} interest The guest interest. A single string. You should give guests interests so that some match up - this is what the rule engine bases their placemenet on. 
		* @param {String} color Hexadecimal value of the color to represent the guest with.
		*/
		MissManners.Guest = function(params) {
			this.name = params.name || this.Default.name;
			this.gender = params.gender ? params.gender.toLowerCase() : this.Default.gender;
			this.interest = params.interest ? params.interest.toLowerCase() : this.Default.interest;
			this.color = params.color || this.Default.color;
			this.id = 'MMGuest-' + MissManners.nextUniqueId++;
		}

		/**
		* Generate and Html snippet to represent the guest.
		*/
		MissManners.Guest.prototype.toHtml = function() {
			var result = '';
			result += '&lt;div class=&quot;missMannersGuest&quot; id=&quot;'+this.color+'&quot; style=&quot;background-color:'+this.color+'&quot;&gt;';
			result +=   '&lt;ul&gt;';
			result +=     '&lt;li&gt;Name: '+this.name;
			result +=     '&lt;li&gt;Gender: '+this.gender;
			result +=     '&lt;li&gt;Interest: '+this.interest;
			result +=   '&lt;/ul&gt;';
			result += '&lt;/div&gt;';
			return result;
		}

		/**
		* The default values for a guest.
		*/
		MissManners.Guest.prototype.Default = {
			name : 'Joan Doe',
			gender : 'female',
			interest : 'weather',
			color : '#def'
		}

		// ... 

		function getVal(id) {
			return document.getElementById(id).value;
		}
		function createGuest(divId) {
			var guest = new MissManners.Guest({
				name : getVal('name'),
				gender : getVal('gender'),
				interest : getVal('interest'),
				color : getVal('color')
			});
			var wrapper = document.createElement('div');
			wrapper.innerHTML = guest.toHtml();
			document.getElementById(divId).appendChild(wrapper);
		}
	</code></pre>
</div>
<div id="container">
</div>

<?php
	$ROOT = $_SERVER['DOCUMENT_ROOT']."/../"; 
	include "${ROOT}include/macros.php";
?>	
<?printTracker("UA-1101899-13");?>

</body>
<script type="text/javascript" id="script">
/**
* Our MissManners application
*/
var MissManners = {
	nextUniqueId : 0
};

/**
* A miss manners guest
* @constructor
* @param {Object} params The parameters object. All other parameters are named properties of this object
* @param {String} name The guest name
* @param {String} gender The guest gender. 'male' or 'female'
* @param {String} interest The guest interest. A single string. You should give guests interests so that some match up - this is what the rule engine bases their placemenet on. 
* @param {String} color Hexadecimal value of the color to represent the guest with.
*/
MissManners.Guest = function(params) {
	this.name = params.name || this.Default.name;
	this.gender = params.gender ? params.gender.toLowerCase() : this.Default.gender;
	this.interest = params.interest ? params.interest.toLowerCase() : this.Default.interest;
	this.color = params.color || this.Default.color;
	this.id = 'MMGuest-' + MissManners.nextUniqueId++;
}

/**
* Generate and Html snippet to represent the guest.
*/
MissManners.Guest.prototype.toHtml = function() {
	var result = '';
	result += '<div class="missMannersGuest" id="'+this.color+'" style="background-color:'+this.color+'">';
	result +=   '<ul>';
	result +=     '<li>Name: '+this.name;
	result +=     '<li>Gender: '+this.gender;
	result +=     '<li>Interest: '+this.interest;
	result +=   '</ul>';
	result += '</div>';
	return result;
}

/**
* The default values for a guest.
*/
MissManners.Guest.prototype.Default = {
	name : 'Joan Doe',
	gender : 'female',
	interest : 'weather',
	color : '#def'
}

// ... 

function getVal(id) {
	return document.getElementById(id).value;
}
function createGuest(divId) {
	var guest = new MissManners.Guest({
		name : getVal('name'),
		gender : getVal('gender'),
		interest : getVal('interest'),
		color : getVal('color')
	});
	var wrapper = document.createElement('div');
	wrapper.innerHTML = guest.toHtml();
	document.getElementById(divId).appendChild(wrapper);
}
</script>
</html>
