// Create a deck of cards
function Deck() {
	this.cards = [];
	this.pool = [];
	for (var suite in Deck.Suites) {
		for (var value=13; value > 0; value--) {
			this.cards.push(new Deck.Card({
				suite : suite,
				value : value
			}))
		}	
	}
}

// Get the top card of a deck
Deck.prototype.topCard = function(){
	if (this.cards.length == 0) {
		throw Deck.Exceptions.EmptyDeskError
	}
	var card = this.cards.pop();
	this.pool.push(card);
	return card;
}

// Shuffle a deck
Deck.prototype.shuffle = function() {
	this.cards = this.cards.concat(this.pool);
	this.pool = [];
	// Fisher-Yates shuffle: http://en.wikipedia.org/wiki/Fisher-Yates_shuffle
	var cards = this.cards;
	var tempCard, randomIndex;
	for (var i=cards.length-1; i >= 0; i--) {
		randomIndex = Math.floor(Math.random() * i);
		tempCard = cards[i];
		cards[i] = cards[randomIndex];
		cards[randomIndex] = tempCard;
	};
}

// Possible card suites
Deck.Suites = {
	spades : 'spades',
	diamonds : 'diamonds',
	clubs : 'clubs',
	hearts : 'hearts'
}

// Deck Exceptions
Deck.Exceptions = {
	EmptyDeskError : function(){},
	UnkownSuiteError : function(suite){ this.suite = suite; },
}
Deck.Exceptions.EmptyDeskError.prototype.toString = function() {
	return 'The desk you tried to remove the top card from has no cards'
}
Deck.Exceptions.UnkownSuiteError.prototype.toString = function() {
	return 'The suite '+this.suite+' is not known';
}

// Construct a deck card
Deck.Card = function(params) {
	if (!Deck.Suites[params.suite]) {
		throw new Deck.Exceptions.UnkownSuiteError(params.suite); 
	}
	if (params.value > 13 || params.value < 1) {
		throw ("Card values must be between 1 and 13");
	}
	this.suite = params.suite;
	this.value = params.value;
}

// Return a string describing the card, e.g. "Queen of hearts" or "4 of spades"
Deck.Card.prototype.toString = function(){
	switch(this.value) {
		case 1:
		return 'Ace of '+this.suite;
		case 11:
		return 'Jack of '+this.suite;
		case 12:
		return 'Queen of '+this.suite;
		case 13:
		return 'King of '+this.suite;
		default:
		return this.value+' of '+this.suite;
	}
}