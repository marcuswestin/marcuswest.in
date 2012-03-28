///// UTIL //////////
$ = function(id) {
	return document.getElementById(id);
}

hitch = function(scope, fn) {
	var fun = typeof fn == 'function' ? fn : scope[fn];
	return function() {
		return fun.apply(scope, arguments);
	}
}

addClassName = function(el, className) {
	if (!el.className.match(className)) {
		el.className += ' '+className;
	}
}

removeClassName = function(el, className) {
	el.className = el.className.replace(className, '');
}


///// FORM WIDGET //////////

FormLess = function(id, params) {
	this.m_parent = $(id);
	this.m_submitHandler = params.onsubmit;
	this.items = [];
	this.defaultValidate = params.validate;
	this.initContent();
	for (var i=0; i < params.items.length; i++) {
		this.addField(params.items[i]);
	};
	this.addSubmitButton();
}

FormLess.prototype.initContent = function() {
	this.form = document.createElement('form');
	this.form.action = '#';
	this.form.onsubmit = hitch(this, 'onSubmit');
	this.m_parent.appendChild(this.form);
}

FormLess.prototype.onSubmit = function(e) {
	if(this.validateData()) {
		var data = this.collectData();
		try { this.m_submitHandler(data); } catch(e) {}
	}
	return false;	
}

FormLess.prototype.addField = function(item) {
	var formItem = {};
	formItem.field = this.createField(item, formItem);
	formItem.validate = item.validate;
	this.items.push(formItem);
	this.form.appendChild(formItem.field);
}

FormLess.prototype.addSubmitButton = function() {
	var submit = document.createElement('input');
	submit.type = 'submit';
	submit.value = 'Ok!';

	var div = document.createElement('div');
	div.className = 'itemField submit';

	div.appendChild(submit);
	this.form.appendChild(div);
}

FormLess.prototype.getValue = function(formItem) {
	return formItem.dataElement.value;
}
FormLess.prototype.getName = function(formItem) {
	return formItem.dataElement.name;
}


FormLess.prototype.getStatus = function(item) {
	return item.field.childNodes[0];
}

FormLess.prototype.validateData = function() {
	var success = true;
	for (var i=0; i < this.items.length; i++) {
		if (!this.validateAndMarkItem(this.items[i])) {
			success = false;
		}
	}
	return success;
}

FormLess.prototype.validateAndMarkItem = function(item) {
	if (!this.validateItem(item)) {
		this.markInvalid(item);
		return false;
	} else {
		this.markValid(item);
		return true;
	}    
}

FormLess.prototype.validateItem = function(item) {
	var validate = (item.validate || this.defaultValidate);
	return validate ? validate(this.getValue(item)) : true;
}

FormLess.prototype.markInvalid = function(item) {
	removeClassName(this.getStatus(item), 'valid');
	addClassName(this.getStatus(item), 'invalid');
}

FormLess.prototype.markValid = function(item) {
	removeClassName(this.getStatus(item), 'invalid');
	addClassName(this.getStatus(item), 'valid');
}

FormLess.prototype.collectData = function() {
	var data = {};
	for (var i=0; i < this.items.length; i++) {
		data[this.getName(this.items[i])] = this.getValue(this.items[i]);
	};
	return data;
}

FormLess.prototype.createField = function(item, formItem) {
	var div = document.createElement('div');
	div.className = 'itemField';

	var status = document.createElement('div');
	status.className = 'status';
	div.appendChild(status)

	var field;
	if (item.options) {
		field = document.createElement('select');
		for (var i=0; i < item.options.length; i++) {
			var option = document.createElement('option');
			option.value = item.options[i];
			option.innerHTML = item.options[i];
			field.appendChild(option);
		}
	} else {
		field = document.createElement('input');
		field.type = item.type;
	}
	var validate = hitch(this, function(){ this.validateAndMarkItem(formItem) });
	field.onchange = field.onblur = validate

	field.value = item.value ? item.value : '';
	field.name = item.name;

	var label = document.createElement('label');
	label.innerHTML = item.name

	label.appendChild(field)
	div.appendChild(label);

	formItem.dataElement = field;

	return div;
}
