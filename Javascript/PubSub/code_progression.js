
// Our publication and subscription broker
function PubSubBroker() {
	var signals = arguments;
	this.subscribers = {};
	for (var i=0; i < signals.length; i++) {
		this.subscribers[signals[i]] = [];
	}
}


PubSubBroker.prototype.publish = function(signal) {
	var variableLengthArguments = Array.prototype.slice.call(arguments, 1)
	for (var i=0; i < this.subscribers[signal].length; i++) {
		var handler = this.subscribers[signal][i];
		handler.apply(this, variableLengthArguments);
	}
}


// Allow for currying of subscription handlerName
PubSubBroker.prototype.subscribe = function(){ /* we'll build this together */ };

















////////////////////////////////////////////////////////
// 1) Simple subscription
////////////////////////////////////////////////////////
PubSubBroker.prototype.subscribe = function(signal, handler){
	this.subscribers[signal].push(function(eventArguments){
		handler(eventArguments);
	});
}












////////////////////////////////////////////////////////
// 2) Subscription with handler scope
////////////////////////////////////////////////////////
PubSubBroker.prototype.subscribe = function(signal, scope, handlerName){
	this.subscribers[signal].push(function(eventArguments){
		scope[handlerName].call((scope || window), eventArguments);
	});
}













////////////////////////////////////////////////////////
// 3) Apply variable number of event arguments
////////////////////////////////////////////////////////
PubSubBroker.prototype.subscribe = function(signal, scope, handlerName){
	this.subscribers[signal].push(function(){
		scope[handlerName].apply((scope || window), arguments);
	});
}












////////////////////////////////////////////////////////
// 4) Allow for currying of subscription handlerName
////////////////////////////////////////////////////////
PubSubBroker.prototype.subscribe = function(signal, scope, handlerName){
	var curryArray = Array.prototype.slice.call(arguments, 3);
	this.subscribers[signal].push(function(){
		var normalizedArgs = Array.prototype.slice.call(arguments, 0);
		scope[handlerName].apply((scope || window), curryArray.concat(normalizedArgs));
	});
}















