var EmailPubSub = new EventBroadcaster([
	'openEmail', 'sendEmail', 'receiveEmail'
]);

function InboxView(unreadCountDom){
	this.count = 0;
	EmailPubSub.subscribe('receiveEmail', {
		scope : this,
		handler : function(email) {
			this.count++;
			this.refresh();
		}
	});
	EmailPubSub.subscribe('openEmail', {
		scope : this,
		handler : function(email) { 
			if (!email.opened) {
				this.count--;
				this.refresh();
				email.opened = true;
				email.listing.firstChild.className = 'opened'
			}
		}
	});
	this.refresh = function(){
		unreadCountDom.innerHTML = '('+ this.count +')';
	}
}

function EmailView(emailListingsDiv, emailTitleDiv, emailTextDiv){
	EmailPubSub.subscribe('openEmail', {
		handler : function(titleDiv, textDiv, email) { 
			titleDiv.innerHTML = email.title;
			textDiv.innerHTML = email.text;
		},
		curry : [
			emailTitleDiv,
			emailTextDiv
		]
	});
	EmailPubSub.subscribe('receiveEmail', {
		handler : function(email, date) { 
			var inboxListing = document.createElement('div'); 
			email.listing = inboxListing;
			inboxListing.className = 'email-listing';
			inboxListing.innerHTML = '<div>'+email.title + '<span class="date">' + date + '</span></div>'
			inboxListing.firstChild.onclick = function(){ EmailPubSub.broadcast('openEmail', email); }
			emailListingsDiv.appendChild(inboxListing);
		}
	});
}