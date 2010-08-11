Fun (a programming language for the realtime web)
=================================================

What if you could build realtime web apps with the same ease as you build static web pages in PHP today? Without long polling, event handling and state synchronization, the engineering complexity of realtime web applications would drop by an order of magnitude. There would be a fundamental shift in the way we build the realtime web. This is the future of [Fun].

What is Fun?
------------

To better understand what Fun is, let's first look at what it's not. Fun is not PHP. However, Fun and PHP have something in common: they use templates and logic to render data into HTML, or more generally speaking they _map state to UI_.

Let's say you're building a small task manager. To render all of a user's tasks with PHP you would do something like this (sorry for the weird syntax highlighting):

    // PHP code
    <h1>These are your tasks matey</h1>
    <?php
    $myTasks = sqlQueryGetMyTasks();
    for ($i = 0; $i < sizeof($myTasks); $i++) {
        $task = $myTasks[$i];
        $divClass = "task" . ($task->urgent ? " urgent" : "");
    	echo "<div class=\"$divClass\">"
    	    . "<span class=\"title\">" . $task->title . "</span>"
            ."</div>";
    }
    ?>

If someone creates a new task for our user or marks a task as urgent, our user has to refresh the page to be made aware of the change. Alternatively we write a javascript layer that long/short-polls the server and updates the DOM whenever there is a state change event. However, this is a complex and error prone engineering challenge, both client-side and server-side. 

So while PHP and its cousin web frameworks in Python and Ruby sport no means to easily accomplish realtime state synchronization, they all accomplish the task of statically mapping state to UI with bravado.

Ok, now let's have some Fun
---------------------------

Here's your first Fun app. It's also a simple task list.

    // Fun code
	let user = Session.User
	let myTasks = Query({ type: "task", owner: user.id })
    
	<h1>"Hello " user.name ", these are your tasks matey:"</h1>
	for (task in myTasks) {
		<div class="task" + (task.urgent ? " urgent")>
			<input data=task.title />
			if (task.completed) {
				<span class="status">"Completed!"</span>
			} else {
				<button clickHandler=markComplete(task)/>"Mark as completed"</button>
			}
		</div>
	}
	
	let markComplete = handler(task) {
		task.completed = true
	}
	
	<h3>"Create a new task"</h3>
	<input data=Local.newTaskTitle />
	<button clickHandler=createNewTask />
    
	let createNewTask = handler() {
		let title = Local.newTaskTitle
		Local.newTaskTitle = ""
		Global.create({ owner: user.id, type: "task", title: title })
	}


This might seem a bit vanilla. So why should it excite you?

In Fun, when you say `"Hello " user.name`, you don't mean just "render the value of `user.name` right now". Rather, you mean "display the value of `user.name` here, and any time `user.name` changes update the UI." In other words, when someone edits their name you see the changes keystroke by keystroke. And you don't need to write any code for networking, event handling, state synchronization, or DOM manipulation! Fun takes care of all that for you, all you do is _map state to UI_. Fun, eh?

The realtime state synchronization works for lists as well. The statement `let myTasks = Query({ type: 'task', owner: user.id })` declares a list of all tasks that belong to the current user. The `for (task in myTasks) { ... }` loop then emits a piece of HTML for each task - if a new task gets assigned to the user then the for loops emits another piece of HTML for that task, without any effort on your part.

To bind an element that reflects a piece of state to a piece of data, all you do is set `data` attribute in the element. For example, `<input data=task.title />` will create an input field with the value of that particular task's title. If a user starts typing into the input field, then all other users viewing a piece of UI also bound to that task's title will see the updates, keystroke by keystroke.

If this doesn't excite you, then read it again damnit!

Are these all your ideas? And can I use Fun now?
------------------------------------------------

Nope. And No.

First, credit where it's due! This project is conceptually inspired from conversations with Justin Rosenstein about the language LunaScript that he's building together with Dustin Moskovitz & team at [Asana], and from conversations with Misko Hevery about the HTML compiler [&lt;angular/&gt;] that he's building over at Google.

And a disclaimer: All the features of Fun used in the example above are not yet implemented. "Vaporware, Vaporware!" you say. Not quite! A significant subset of Fun already parses and compiles correctly, and I'm making fast progress in implementing the remaining features. At this point I can safely say that Fun is a viable project and that you will be able to use it to build realtime web application by the end of the year.

Technical details you should know about Fun
-------------------------------------------

**First:** Since the primary purpose of Fun is to emit HTML, any statement with a single literal value implicitly emits that value. No `echo` or `emit` needed. Hello World in Fun is about as simple as it can get:

	"Hello World!"

**Second:** Fun has syntactical support for XML. Rather than juggling strings with HTML (PHP: `$html = "<div class='$class'>Hi</div>";`) or switching context between HTML and logic (PHP: `<div class="<?php echo $class ?>">Hi</div>`), you simply inline the XML that you want to emit as HTML (Fun: `<div class=class> "Hi" </div>`)

**Third:** Fun is declarative. You declare aliases like `let aNumber = 1`, or `let someXML = <div> "Hello!" </div>`, but these declarations never change - there are no _variables_ (i.e. you can't say `aNumber += 2`). The reasons why are technical and I won't bore you with them now. But take my word for it: in this sort of programming we don't need variables.

**Finally:** a quick look at the Fun stack. There are a bunch of moving pieces:

 - Parser: The [Fun grammar] is written in [PEG.js], a parser generator written in javascript that outputs parsers _also_ written in javascript.

 - Compiler: The [Fun compiler] is written in javascript, and converts the abstract syntax trees generated by the parser into javascript code that gets run both server and client side.

 - Realtime: The generated javascript uses [fin] to synchronize data across browsers. Fin is a realtime key/value datastore written in javascript. Fin consists of

   - The [fin API], which runs both in browsers and on servers.

   - [js.io] for code modularization and realtime networking

   - [node.js] for the web server

   - [redis] for persistance of data structures and pubsub of data changes

Seeing is believing
-------------------
I know, yet I don't have a demo up. Shucks!

However, when I said you can't use Fun yet I wasn't 100% honest. You can definitely get started playing with Fun - it's just not that useful yet! Grab your own copy of Fun and get some examples up and running:

	git clone http://github.com/marcuswestin/fun.git fun
	cd fun
	make

Then navigate to

    http://localhost/fun-demo/parse_and_run.php?code=if_else.fun&verbose=true

and you should have your first Fun script running locally!

Stay tuned for lots of exciting progress in the coming couple of weeks.





  [Fun]:http://github.com/marcuswestin/fun

  [Fun grammar]:http://github.com/marcuswestin/fun/blob/fba44d87b2b5b9d3fbbf7c35d839cef7392caa1f/language/grammar.peg

  [Fun compiler]: http://github.com/marcuswestin/fun/blob/fba44d87b2b5b9d3fbbf7c35d839cef7392caa1f/language/compiler.js

  [Fin]:http://github.com/marcuswestin/fin

  [Fin API]:http://github.com/marcuswestin/fin/blob/master/js/client/api.js

  [js.io]:http://github.com/mcarter/js.io

  [node.js]:http://nodejs.org/

  [redis]:http://code.google.com/p/redis/

  [Asana]:http://asana.com

  [&lt;angular/&gt;]:http://angularjs.org/

  [PEG.js]:http://pegjs.majda.cz/