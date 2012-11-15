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
	exec('make', { cwd:baseDir }, function(err, stdout, stderr) {
		if (check(err || stderr, res)) { return }
		if (req.url[req.url.length - 1] == '/') {
			req.url += 'index.html'
		}
		fs.readFile(__dirname+'/..'+req.url, function(err, content) {
			if (check(err, res)) { return }
			send(req, res, content)
			console.log("Done")
		})
	})
}

function check(err, res) {
	if (!err) { return false }
	console.log("ERROR", err)
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
