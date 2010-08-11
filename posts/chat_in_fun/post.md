A quick chat app in Fun
=======================

Just a quick sample chat app written in Fun:

    <div class="compose">
    	<input data=Local.newMessage />
    	<button clickHandler=sendMessage>Send</button>
    </div>

    let sendMessage = handler() {
    	Global.messages.push({ user: Session.User, text: Local.newMessage })
    }

    <div class="messages">
    	for (message in Global.messages) {
    		<div class="message">
    			<img src=message.user.pictureURL />
    			message.user.name " says:"
    			<span class="text"> message.text </span>
    		</div>
    	}
    </div>

Let's break it down!

    <div class="compose">
    	<input data=Local.newMessage />
    	<button clickHandler=sendMessage>Send</button>
    </div>

This code emits a text input element and a button to the user. The text input has its `data` bound to `Local.newMessage`. What's with the `Local`? Well, it's a special data object which syncs its properties only with the current page. This means that any other element on this page bound to `Local.newMessage` will display that value, but Fun won't sync the value across the network with other users.

Next, the button has its `clickHandler` attribute bound to `sendMessage`:

    let sendMessage = handler() {
    	Global.messages.push({ user: Session.User, text: Local.newMessage })
    }

This means that whenever the button gets clicked, the sendMessage handler gets called. Fun code running inside of handlers are a little different from other Fun code. Rather than emit HTML they _mutate state_. This kind of makes sense if you think about it: a handler gets called in response to user input (keystrokes, mouse moves, clicks), and usually when user input happens then something should change. The change could be the position of the cursor, the value of an input box, or in this case add a message to the list of chat messages.

Finally we've got the rendering of all the chat messages:

    <div class="messages">
        for (message in Global.messages) {

This loop emits for each message in `Global.messages`. Whenever the `sendMessage` handler above pushes a message onto this list, the loop will automatically emit again for that item. No controller code needed!

        <div class="message">
        	<img src=message.user.pictureURL />
        	message.user.name " says:"
        	<span class="text"> message.text </span>
        </div>

For each message, emit the sender's picture, name, and the message that they wrote.

    	}
    </div>

Close the loop aaaaand we're done! That's it - a realtime chat app in 16 lines of Fun code.
