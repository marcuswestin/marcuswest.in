/**
* A GrapherPilot arena - keeps track of the obstacles as well as the dom objects and visualization
* @constructor
* @param {Object} data The arena data
* @param {String/Element} el The container element
* @param {Object} events Must declare functions for hit, crash, miss, outofbounds
* @param {Integer} scaleX
* @param {Integer} scaleY
*/
mwd.GrapherPilot.Arena = function(params) {
	this.container = params.el;
	this.scaleX = params.data.scaleX || this.scaleX;
	this.scaleY = params.data.scaleY || this.scaleY;
	this.height = params.height || this.height;
	this.width = params.width || this.width;
	this.obstacles = params.data.obstacles || [];
	this.targets = params.data.targets || [];
	this.events = params.events || this.events;
	mwd.each(this.obstacles, function(o){ o.type = mwd.GrapherPilot.Enum.OBSTACLE; });
	mwd.each(this.targets, function(t){ t.type = mwd.GrapherPilot.Enum.TARGET; });
	this.vessel = params.data.vessel || this.vessel;
	this.origin = {};
}

mwd.GrapherPilot.Arena.prototype.scaleX = 100;
mwd.GrapherPilot.Arena.prototype.scaleY = 100;
mwd.GrapherPilot.Arena.prototype.width = 300;
mwd.GrapherPilot.Arena.prototype.height = 300;
mwd.GrapherPilot.Arena.prototype.stepSize = 1;
mwd.GrapherPilot.Arena.prototype.axisWidth = 2;
mwd.GrapherPilot.Arena.prototype.vesselWidth = 5;
mwd.GrapherPilot.Arena.prototype.vesselHeight = 5;
mwd.GrapherPilot.Arena.prototype.vesselColor = '#cde';
mwd.GrapherPilot.Arena.prototype.targetColor = 'green';
mwd.GrapherPilot.Arena.prototype.obstacleColor = 'red';
mwd.GrapherPilot.Arena.prototype.vesselTailColor = 'black';
mwd.GrapherPilot.Arena.prototype.vesselTailLength = 10;
mwd.GrapherPilot.Arena.prototype.vesselTailSize = 3;
mwd.GrapherPilot.Arena.prototype.vesselTailDrawFrequency = 10;
mwd.GrapherPilot.Arena.prototype.stepRate = 30;
mwd.GrapherPilot.Arena.prototype.initialized = false;
mwd.GrapherPilot.Arena.prototype.vessel = { x:0, y:0, w:20, h:20 };
mwd.GrapherPilot.Arena.prototype.events = { 
	hit : function(){ alert("Hit!"); },
	miss : function(){ alert("Miss!"); },
	crash : function(){ alert("Crash!"); },
	outOfBounds : function(){ alert("Out of bounds!"); }
};

/** 
* Set up an arena, creating all the dom objects etc
*/ 
mwd.GrapherPilot.Arena.prototype.initDom = function() {
	var that = this;
	// Main div
	this.el = mwd.create('div');
	$(this.el).css({
		height : this.height,
		width : this.width,
		'border-left' : 'solid '+this.axisWidth+'px black',
		'border-bottom' : 'solid '+this.axisWidth+'px black'		
	});
	this.container.appendChild(this.el);
	// Obstacles
	mwd.each(this.obstacles, function(obstacle){
		obstacle.el = mwd.create('div');
		$(obstacle.el).css({
			position : 'absolute',
			width : obstacle.w,
			height : obstacle.h,
			backgroundColor : that.obstacleColor
		});
		that.el.appendChild(obstacle.el);		
	});
	mwd.each(this.targets, function(target){
		target.el = mwd.create('div');
		$(target.el).css({
			position : 'absolute',
			width : target.w,
			height : target.h,
			backgroundColor : that.targetColor
		});
		that.el.appendChild(target.el);		
	});
	// Vessel
	this.initVessel();
	this.draw();
}

mwd.GrapherPilot.Arena.prototype.draw = function() {
	this.updateOrigin();
	this.drawObstacles();
	this.drawTargets();
	this.drawVessel();
}

mwd.GrapherPilot.Arena.prototype.updateOrigin = function() {
	var xy = mwd.xy(this.el);
	this.origin.x = xy[0] + this.axisWidth;
	this.origin.y = xy[1] + this.height;
}

mwd.GrapherPilot.Arena.prototype.drawObstacles = function() {
	//var height = $(this.el).css('height');
	//this.offsetY = height.substr(0, height.indexOf('px'));
	var i, len = this.obstacles.length, origin = this.origin;
	for (var i=0; i<len; i++) {
		var obstacle = this.obstacles[i];
		$(obstacle.el).css({
			// Negative y is up
			top : origin.y - obstacle.y - obstacle.h,
			left : origin.x + obstacle.x
		});
	}
}

mwd.GrapherPilot.Arena.prototype.drawTargets = function(){
	var origin = this.origin;
	mwd.each(this.targets, function(target){
		$(target.el).css({
			top : origin.y - target.y - target.h,
			left : origin.x + target.x
		});
	});
}

/**
* Draw the arena vessel.
*/
mwd.GrapherPilot.Arena.prototype.drawVessel = function() {
	$(this.vessel.el).css({
		top : this.origin.y - this.vessel.y - this.vessel.h,
		left : this.origin.x + this.vessel.x
	});
}

/**
* Run a formula and return a HIT, MISS or COLLISION 
* @param {Function} f The function we trace
*/
mwd.GrapherPilot.Arena.prototype.runFormula = function(f) {
	if (!this.running) {
		this.running = true;
		var dx, obstacle, vessel=this.vessel, stepSize=this.stepSize, stepRate = this.stepRate, that=this;
		dx = Math.ceil(this.scaleX / this.stepSize);
		// A for loop construct using intervals to run every 10 ms
		var x = 0, y;
		var runner = mwd.repeat(stepRate, function(){
			x += stepSize;
			y = f(x);
			if (x+vessel.w >= that.width) {
				mwd.stop(runner);
				that.running = false;
				that.events.miss({xy : [x,y], vessel : vessel});
			} else if (y >= that.height || y <= 0) {
				mwd.stop(runner);
				that.running = false;
				that.events.outOfBounds({xy : [x,y], vessel : vessel});
			}
			else {
				that.updateVesselTail(vessel);
				vessel.x = x;
				vessel.y = y;
				that.drawVessel();
				obstacle = that.detectCollision(vessel);
				if (obstacle) {
					switch (obstacle.type) {
						case mwd.GrapherPilot.Enum.OBSTACLE:
						mwd.stop(runner);
						that.running = false;
						that.events.crash({xy : [x,y], vessel : vessel, obstacle : obstacle});
						break;
						case mwd.GrapherPilot.Enum.TARGET:
						mwd.stop(runner);
						that.running = false;
						that.events.hit({xy : [x,y], vessel : vessel, obstacle : obstacle});
						break;
						default:
						// do nothing
					}				
				}
			}
		});
	}
}
mwd.GrapherPilot.Arena.prototype.initVessel = function(){
	this.vessel.el = mwd.create('div');
	$(this.vessel.el).css({
		position : 'absolute',
		width : this.vessel.w,
		height : this.vessel.h,
		backgroundColor : this.vesselColor
	});
	this.vessel.tail = [];
	for (var i=0; i<this.vesselTailLength; i++) {
		var px = mwd.create('div');
		$(px).css({
			position:'absolute',
			width : this.vesselTailSize,
			height : this.vesselTailSize,
			backgroundColor : this.vesselTailColor
		});
		this.vessel.tail.push(px);
		this.el.appendChild(px);
	}
	this.vessel.tailGapCount = 0;
	this.vessel.pixelIndex = 0;
	this.el.appendChild(this.vessel.el);
}
mwd.GrapherPilot.Arena.prototype.updateVesselTail = function() {
	if (this.vessel.tailGapCount++ % this.vesselTailDrawFrequency == 0) {
		$(this.vessel.tail[this.vessel.pixelIndex++ % this.vessel.tail.length]).css({
			left : this.vessel.x,
			top : this.vessel.el.style.top
		});
	}
}

mwd.GrapherPilot.Arena.prototype.onMiss = function() {
	alert("Miss");
}
mwd.GrapherPilot.Arena.prototype.onOutOfBounds = function() {
	alert("Miss");
}

/**
* Detects if the object with given properties collides with any of the objects in the arena. Returns the object collided with if collided, null otherwise
* @type Obstacle The object that was hit; mwd.GrapherPilot.Enum.OBSTACLE or mwd.GrapherPilot.Enum.TARGET
* @param {Vessel} Vessel The vessel we're trying to test for collision
*/
mwd.GrapherPilot.Arena.prototype.detectCollision = function(vessel) {
	var i, len = this.obstacles.length, o, t;
	for (i=0, len=this.obstacles.length; i<len; i++) {
		o = this.obstacles[i];
		if(this.boundryCheck(vessel,o)) { return o; }
	}
	for (i=0, len=this.targets.length; i<len; i++) {
		t = this.targets[i];
		if(this.boundryCheck(vessel,t)) { return t; }
	}
	// no hits
	return null;
}

mwd.GrapherPilot.Arena.prototype.boundryCheck = function(o1,o2) {
	return (
		o1.x < o2.x+o2.w && //'left',
		o1.x+o1.w > o2.x && //'right', 
		o1.y+o1.h > o2.y && //'top', 
		o1.y < o2.y+o2.h //'bottom', 
	);
}
