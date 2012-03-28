TodoMVC sample app written in Fun
=================================

What if building realtime JavaScript web apps was as straight-forward as it is to build a static webpage in languages like PHP today? Without worrying about state & UI synchronization, the engineering complexity of realtime web applications would drop by an order of magnitude. There would be a fundamental shift in the way we build the realtime web. Fun is a new programming language for the realtime web that delivers on this promise.

How? By a unique combination of functional, declarative and reactive programming language features. In Fun, every expression creates implicit data bindings for you, so when you write `if (user.status is "available") { ... }` in Fun, then the statement automatically re-evaluates whenever `user.status` changes.

Seeing is believing! TodoMVC is a common demo application for popular JavaScript MVC frameworks. Implemented in vanilla JavaScript you end up with [317 lines of readable code](https://github.com/addyosmani/todomvc/blob/master/reference-examples/vanillajs/js/todo.js). The exact same functionality is coded in [less than 60 even more readable lines of fun code](https://github.com/marcuswestin/fun/blob/master/apps/todo-mvc/todo-mvc.fun). The result? The [Fun app](http://marcuswest.in/fun/todo-mvc.html) is identical to [the original](http://addyosmani.github.com/todomvc/reference-examples/vanillajs/index.html).

I've included the Fun app source here for convenience:

	import localstorage
	import filter
	
	let tasks = []
	
	localstorage.persist(tasks, 'todo-fun')
	
	<link rel="stylesheet" type="text/css" href="./todo-mvc.css" />
	
	<div id="todoapp">
		<div class="title">
			<h1>"Todos"</h1>
		</div>
		<div class="content">
			<div id="create-todo">
				let newTaskName = null
				<input id="new-todo" data=newTaskName placeholder="What needs to be done?" onkeypress=handler(event) {
					if event.keyCode is 13 {
						tasks push: { name:newTaskName.copy(), done:false }
						newTaskName set: ''
					}
				}/>
			</div>
			<div id="todos">
				<ul id="todo-list">
					for task in tasks {
						<li class="todo"+(task.done ? " done" : "")>
							<input class="check" type="checkbox" data=task.done />
							<div class="todo-content">task.name</div>
						</li>
					}
				</ul>
			</div>
			<div id="todo-stats">
				if tasks.length is > 0 {
					let doneTasks = filter(tasks, function(task) { return task.done }),
						pluralize = function(num) { return num is > 1 ? "items" : "item" }
					<span class="todo-count">
						let numTasksLeft = tasks.length - doneTasks.length
						<span class="number">numTasksLeft</span>" "pluralize(numTasksLeft) " left."
					</span>
					if doneTasks.length is > 0 {
						<span class="todo-clear">
							<a href="#">"Clear "doneTasks.length" completed "pluralize(doneTasks.length)</a onclick=handler() {
								let remainingTasks = []
								for task in tasks {
									if !task.done {
										remainingTasks push: task
									}
								}
								tasks set: remainingTasks
							}>
						</span>
					}
				}
			</div>
		</div>
	</div>