// Author: Marcus.Westin@gmail.com, July 25th

function EventBroadcaster(signals) {
	this.events = {};
	for (var i=0; i < signals.length; i++) {
		this.events[signals[i]] = [];		
	}
}

EventBroadcaster.prototype.subscribe = function(signal, args){ //signal, scope, handler, curry, once) {
	if (!this.events[signal]) { throw ('EventBroadcaster.prototype.subscribe: event name not recognized: ' + signal); }
	if (!args.handler) { throw ('EventBroadcaster.prototype.subscribe: no handler given.')}
	args = args || {};
	function makeArray(arg) {
		return arg ? (arg instanceof Array ? arg : [arg]) : [];
	}
	this.events[signal].push({
		handler : function(handlerArgs){ 
			args.handler.apply((args.scope || window), makeArray(args.curry).concat(makeArray(handlerArgs)));
		},
		once : args.once
	});
}

EventBroadcaster.prototype.once = function(signal, args) {
	args = args || {};
	args.once = true;
	this.subscribe(signal, args);
}

EventBroadcaster.prototype.broadcast = function(signal, broadcastArgs) {
	if (!this.events[signal]) { throw ('EventBroadcaster.prototype.broadcast: event name not recognized: ' + signal); }
	var subscriptions = this.events[signal];
	for (var i=0; i < subscriptions.length; i++) {
		subscriptions[i].handler && subscriptions[i].handler(broadcastArgs);
		subscriptions[i].once && delete subscriptions[i];
	}
}

EventBroadcaster.prototype.fire = EventBroadcaster.prototype.publish = EventBroadcaster.prototype.broadcast;