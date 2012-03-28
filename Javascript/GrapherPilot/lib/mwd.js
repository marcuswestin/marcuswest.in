if (!window.mwd) {
	window.mwd = {}
}

mwd = {
	nextUniqueId : 0
};

mwd.util = {};

mwd.util.trim = function(str) {
	return str.replace(/^\s+|\s+$/g,"");
}

// Take jQuery's cookie function for now
mwd.cookie = jQuery.cookie;

mwd.uniqueId = function() {
	return 'mwdUnqId_'+mwd.nextUniqueId++;
}

mwd.util.rgbToHex = function(rgb){
	var start = rgb.indexOf('rgb(')+4;
	if (start == -1) {
		// Not in rgb form
		return rgb;
	}
	var stop = rgb.indexOf(')');
	var arr = rgb.substring(start, stop).split(',');
	var R = arr[0], G = arr[1], B = arr[2];
	var hex = mwd.util.toHex;
	return '#'+hex(R)+hex(G)+hex(B);
}

mwd.util.toHex = function (N) {
 if (N==null) return "00";
 N=parseInt(N); if (N==0 || isNaN(N)) return "00";
 N=Math.max(0,N); N=Math.min(N,255); N=Math.round(N);
 return "0123456789ABCDEF".charAt((N-N%16)/16)
      + "0123456789ABCDEF".charAt(N%16);
}

mwd.parseJson = function(json) {
	try {
		eval('var json = ('+json+')');	
	} catch (e) {
		return false;
	}
	return json
}

mwd.emptyFn = function() {
	// do nothing
}

mwd.renderBreak = function() {
	// take a quick break from processing - this allows for the browser to render what has been painted so far
	window.setTimeout(mwd.emptyFn, 0);
}

mwd.repeat = function(time, fn) {
	return window.setInterval(fn, time);
}

mwd.stop = function(interval) {
	window.clearInterval(interval);
}

mwd.timeout = function(time, fn) {
	window.setTimeout(fn, time);
}

mwd.get = function(el) {
	if (typeof el == "string") {
		return document.getElementById(el);		
	} else {
		return el;
	}
}

mwd.create = function(tag, attributes) {
	var el = document.createElement(tag);
	for (var attr in attributes) {
		el.setAttribute(attr, attributes[attr]);
	}
	return el;
}

mwd.each = function(arr, fn) {
	for (var i=0, len=arr.length; i<len; i++) {
		fn(arr[i]);
	}
}
mwd.log = function() {
	console.debug(arguments)
}

mwd.xy = function(el) {
	el = mwd.get(el);
	var curleft = curtop = 0;
	if (el.offsetParent) {
		curleft = el.offsetLeft
		curtop = el.offsetTop
		while (el = el.offsetParent) {
			curleft += el.offsetLeft
			curtop += el.offsetTop
		}
	}
	return [curleft,curtop];
}

/**
* An html template allows for easy conversion
* Example :
* var template = new mwd.util.HtmlTemplate('<ul><li>Name : {name}<li>Phone : {phone}<li>Email : {email}</ul>');
* template.print({name : 'Marcus', phone : '1-800-javascript', email : 'marcus@example.com'}); 
* This generates:
* <ul><li>Name : Marcus<li>Phone : 1-800-javascript
* @constructor
* @param {String} template The html template string. Variables to be injected should be surrounded with { and }
* @param {Object} formatting A hack for calling formatting functions on the resulting html string, e.g. {toUpperCase : null, strike : null, replace : ['Marcus', 'Marcus Westin']} will capitalize, strike, and replace all occurances of 'Marcus' with 'Marcus Westin'
*/
mwd.util.HtmlTemplate = function(template) {
	this.template = template
}
/**
*
*/
mwd.util.HtmlTemplate.prototype.print = function(params, formatting) {
	var key, keyLen, val, i, html = this.template;
	for (key in params) {
		val = params[key];
		for (fn in formatting) {
			if (val[fn]) {
				val = val[fn].apply(val, formatting[fn]);
			}
		}
		while (html.indexOf('{'+key+'}') > 0) {
			html = html.replace('{'+key+'}', val);			
		}
	}
	return html;
}
