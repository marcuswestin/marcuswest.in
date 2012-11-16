var http = require('http')
var fs = require('fs')
var exec = require('child_process').exec
var parseUrl = require('querystring').parse

var baseDir = __dirname+'/..'
var srcDir = __dirname+'/../src'
var port = '3000'

http.createServer(handleRequest).listen(port)
console.log('Listening on :'+port)

function handleRequest(req, res) {
	console.log("Get", req.url)
	var thumbMatch
	if (thumbMatch = req.url.match(/\/drawings\/(.*)-thumb\.jpg/)) {
		var filename = thumbMatch[1]+'.jpg'
		var thumbName = thumbMatch[1]+'-thumb.jpg'
		fs.stat('drawings/' + thumbName, function(err, stat) {
			if (err) {
				var command = 'convert src/drawings/'+filename+' -resize 300x300^ -gravity Center -crop 185x185+0+0 +repage drawings/'+thumbName
				console.log("Generating thumbnail\n", command)
				exec(command, function(err) {
					if (check(err, res)) { return }
					var command = 'convert src/drawings/'+filename+' -resize 800x800^ -gravity Center +repage drawings/'+filename
					console.log(command)
					exec(command, function(err) {
						if (check(err, res)) { return }
						sendFile(req, res)
					})
				})
			} else {
				sendFile(req, res)
			}
		})
	} else {
		compile(function(err) {
			if (check(err, res)) { return }
			if (req.url[req.url.length - 1] == '/') {
				req.url += 'index.html'
			}
			sendFile(req, res)
		})
	}
}

function sendFile(req, res) {
	fs.readFile(__dirname+'/..'+req.url, function(err, content) {
		if (check(err, res)) { return }
		send(req, res, content)
		console.log("Done")
	})
}

function compile(callback) {
	if (compile.callbacks) { return compile.callbacks.push(callback) }
	compile.callbacks = [callback]
	exec('make', { cwd:baseDir }, function(err, stderr, stdout) {
		var callbacks = compile.callbacks
		compile.callbacks = null
		callbacks.forEach(function(cb) {
			cb(err || stdout)
		})
	})
}

function check(err, res) {
	if (!err) { return false }
	console.log("ERROR", err.stack ? err.stack : err)
	res.writeHead(500)
	res.end(err.stack ? err.stack : err)
	return true
}

function send(req, res, content) {
	var contentType = send.contentTypes[req.url.split('.').pop()]
	res.writeHead(200, { 'Content-Type':contentType })
	res.end(content)
}
send.contentTypes = {
	'ico':'image/x-icon',
	'jpg':'image/jpg',
	'jpeg':'image/jpg',
	'png':'image/png',
	'html':'text/html',
	'css':'text/css'
}
