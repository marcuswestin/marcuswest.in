




// Our data layer
var gData = {
	emails : {},
	unreadCounter : 0,

	addEmail : function(email) {
		email.haseBeenRead = false;
		gData.emails[email.id] = email;
		gData.unreadCounter++;
		gBroker.publish('email-unread-count-change', gData.unreadCounter);
	},
	
	onRead : function(email) {
		if (!email.haseBeenRead) {
			gData.unreadCounter--;
			gBroker.publish('email-unread-count-change', gData.unreadCounter);
		}
		email.haseBeenRead = true;
	},
	
	removeEmail : function(email) {
		delete gData.emails[email.id];
		gData.counter--;
	}
}









// Our UI layer
var gUI = {
	addEmail : function(email) {
		var emailDiv = document.createElement('div');
		emailDiv.id = email.id;
		emailDiv.onclick = function() { 
			document.getElementById('body').innerHTML = email.body;
			gBroker.publish('email-open', email);
		};
		emailDiv.innerHTML = email.title;

		var removeButton = document.createElement('span');
		removeButton.className = 'remove-button';
		removeButton.onclick = function() { gBroker.publish('email-remove', email) };
		removeButton.innerHTML = '[x]';
		
		emailDiv.appendChild(removeButton)
		document.getElementById('inbox').appendChild(emailDiv);
	},

	removeEmail : function(email) {
		var emailDiv = document.getElementById(email.id);
		emailDiv.parentNode.removeChild(emailDiv);
	},

	markEmail : function(hasBeenRead, email) {
		var emailDiv = document.getElementById(email.id);
		if (emailDiv) {
			emailDiv.className = hasBeenRead ? 'old' : 'new';
		}
	},
	
	updateInboxCount : function(count) {
		document.getElementById('inbox-label').innerHTML = 'Inbox (' + count + ')'
	}
}








// This is all I want to have to do
var gBroker = new PubSubBroker(
	'email-arrive', 
	'email-open', 
	'email-remove', 
	'email-unread-count-change'
);

gBroker.subscribe('email-arrive', gData, 'addEmail');
gBroker.subscribe('email-arrive', gUI, 'addEmail');
gBroker.subscribe('email-arrive', gUI, 'markEmail', false);

gBroker.subscribe('email-open', gData, 'onRead');
gBroker.subscribe('email-open', gUI, 'markEmail', true);

gBroker.subscribe('email-remove', gData, 'removeEmail');
gBroker.subscribe('email-remove', gUI, 'removeEmail');

gBroker.subscribe('email-unread-count-change', gUI, 'updateInboxCount');













