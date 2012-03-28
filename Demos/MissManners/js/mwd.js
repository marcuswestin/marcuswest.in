if (!window.mwd) {
	window.mwd = {}
}

mwd.util = {};

mwd.util.trim = function(str) {
	return str.replace(/^\s+|\s+$/g,"");
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

mwd.get = function(id) {
	return document.getElementById(id);
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
		html = html.replace('{'+key+'}', val);
	}
	return html;
}

mwd