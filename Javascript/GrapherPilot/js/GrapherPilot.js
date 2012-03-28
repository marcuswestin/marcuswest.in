/**
* A grapher pilot program
* @constructor
* @param {String/Element} container The id or dom element of the DOM container element.
* @param {Integer} width The width of the graph
* @param {Integer} height The height of the graph
* @param {Integer} scaleX The number of ticks on the x axis
* @param {Integer} scaleY The number of ticks on the y axis
*/
mwd.GrapherPilot = function(params) {
	this.container = mwd.get(params.container);
	this.initDom();
	this.initHandlers();
	params.arenaId = mwd.cookie('arenaId') || params.arena || this.firstArena;
	this.loadArena(params);
	if (!params.delayRender) {
		this.render();
	}
}

mwd.GrapherPilot.crashImage = mwd.create('img');
mwd.GrapherPilot.crashImage.src = 'img/crash.gif';
$(mwd.GrapherPilot.crashImage).css({position:'relative', top:-50, left:-25})

mwd.tmp = 	'<div class="{className}" id="{id}">';
mwd.tmp += 		'<div id="{id}Arena" class="{arenaClassName}"></div>';
mwd.tmp +=		'<div class="{controllerClassName}">';
mwd.tmp +=			'<span>f(x) = <input type="text" id="{id}FormulaInput" /><input type="button" value="Go" id="{id}GoButton" /></span>';
mwd.tmp +=		'</div>';
mwd.tmp +=	'</div>';
mwd.GrapherPilot.prototype.template = new mwd.util.HtmlTemplate(mwd.tmp);
mwd.GrapherPilot.prototype.initDom = function() {
	this.id = mwd.uniqueId();
	this.el = mwd.create('div');
	$(this.el).css({
		'display' : 'none',
		'position' : 'relative'
	});
	$(this.container).append(this.el);
	this.el.innerHTML = this.template.print(this);
	this.arenaEl = mwd.get(this.id+"Arena");
	this.goButton = mwd.get(this.id+"GoButton");
	this.formulaInput = mwd.get(this.id+"FormulaInput");
	this.crashImage = mwd.create('img');
}

mwd.GrapherPilot.prototype.initHandlers = function() {
	var that = this;
	$(this.goButton).click(function(e){
		that.runFormula.apply(that);
	});
}

/**
* Load and render an arena that is in memory
* @param {Object} params
* @param {String} arenaId The id of the arena to be loaded
*/ 
mwd.GrapherPilot.prototype.loadArena = function(params) {
	// Clear the current 
	this.clearArena();
	// Load the new arena
	this.arena = new mwd.GrapherPilot.Arena({
		data : this.Arenas[params.arenaId],
		width : params.width || this.width,
		height : params.height || this.height,
		el : this.arenaEl,
		events : this.Events
	});
	this.arena.initDom();
}

mwd.GrapherPilot.prototype.render = function() {
	$(this.el).css('display', 'inline');
}

mwd.GrapherPilot.prototype.arenaClassName = 'GrapherPilotArena';
mwd.GrapherPilot.prototype.controllerClassName = 'GrapherPilotController';
mwd.GrapherPilot.prototype.className = 'GrapherPilot';
mwd.GrapherPilot.prototype.firstArena = 'linear1';
mwd.GrapherPilot.prototype.nextArenaTimeout = 1000;
mwd.GrapherPilot.prototype.height = 300;
mwd.GrapherPilot.prototype.width = 300;


mwd.GrapherPilot.Enum = {
	COLLISION : 1,
	MISS : 2,
	HIT : 3,
	OBSTACLE : 4,
	TARGET : 5
};

mwd.GrapherPilot.prototype.nextArena = function() {
	$(this.el).toggle('hidden');
	//this.loadArena(this.arena.nextArena);
	var that = this;
	window.setTimeout(function(){
		$(that.el).toggle('hidden');
	}, 1000);
}

mwd.GrapherPilot.prototype.clearArena = function() {
	if (this.arena) {
		// avoid memory leaks in IE6
		mwd.purgeDom(this.arena.el);
		this.el.removeChild(this.arena.el);
	}
}

/**
* Run a formula and see what happens.
*/
mwd.GrapherPilot.prototype.runFormula = function() {
	this.arena.runFormula(this.getInputFormula());
}

/**
* Get the formula currently inputted by the user and turn it into a javascript function
* @type Function
*/ 
mwd.GrapherPilot.prototype.getInputFormula = function() {
	var formula = this.formulaInput.value;
	return function(x) {
		eval('var result='+(formula || 0));
		return result;
	}
}


mwd.GrapherPilot.prototype.Arenas = {
	linear1 : {
		obstacles : [
			{x:30, y:30, w:40, h:60}
		], targets : [
			{x:100, y:50, w:10, h:10}
		]
	}
}

mwd.GrapherPilot.prototype.Events = {
	crash : function(params) {
		//$(params.vessel.el).css({backgroundColor : 'transparent'});
		params.vessel.el.appendChild(mwd.GrapherPilot.crashImage);
		mwd.timeout(1000, function(){
			params.vessel.el.removeChild(mwd.GrapherPilot.crashImage);
		});
	},
	hit : function(vessel, target) {
		$(vessel.el).css({
			backgroundColor : 'blue'
		});	
	},
	outOfBounds : function(vessel, xy) {
		
	},
	miss : function(vessel) {
		$(vessel.el).css({
			backgroundColor : 'red'
		});					
	}
}