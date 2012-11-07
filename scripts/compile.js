var fs = require('fs')
var mustache = require('mustache')
var stylus = require('stylus')
var util = require('util')
var Showdown = require('../write/showdown')
// var funSyntaxHighlighter = require('../lib/funSyntaxHighlighter')
var mustache = require('mustache')
var exec = require('child_process').exec
require('./date') // date.js modifies the Date prototype

compileRead(function(err) {
	if (err) { throw err }
	compileIndex(function(err) {
		if (err) { throw err }
		console.log("Done!")
	})
})

function compileIndex(callback) {
	var templateHTML = fs.readFileSync('src/index.html').toString()
	var data = {}
	var html

	data.posts = JSON.parse(fs.readFileSync('read/posts.json').toString())
	fs.writeFileSync('index.html', mustache.to_html(templateHTML, data))

	stylus.render(fs.readFileSync('src/index.styl').toString(), function(err, css) {
		if (err) { return callback(err) }
		fs.writeFileSync('index.css', css)
	})
}

function compileRead(callback) {
	function p(o) { util.puts(JSON.stringify(o)) }
	function puts(o) { util.puts(o) }
	
	var markdownConverter = new Showdown.converter()
	var postsInfo = []
	var dstDir = './read/'
	
	exec('rm -rf '+dstDir, function(err) {
		if (err) { return callback(err) }
		fs.mkdirSync(dstDir, 0755)
		
		var posts = fs.readdirSync('src/read')
		for (var i=0, postID; postID = posts[i]; i++) {
			if (!fs.statSync('src/read/' + postID).isDirectory()) { continue }
			var postInfo = JSON.parse(fs.readFileSync('src/read/'+postID + '/info.json').toString())
			var postMarkdow = fs.readFileSync('src/read/'+postID + '/post.md').toString()
			var templateHTML = fs.readFileSync('src/read/template.html').toString()
			var view = {}
			var html
	
			view.body = markdownConverter.makeHtml(postMarkdow)
			view.id = postInfo.id = postID
			view.title = postInfo.title = postMarkdow.split("\n")[0]
			view.date = postInfo.date
	
			html = mustache.to_html(templateHTML, view)
			// html = syntaxHighlight(html)
	
			fs.mkdirSync(dstDir + postInfo.id + '/', 0755)
			fs.writeFileSync(dstDir + postInfo.id + '/index.html', html)
	
			postsInfo.push(postInfo)
		}
	
		postsInfo.sort(function(a,b){ return Date.parse(a.date) > Date.parse(b.date) ? -1 : 1 })
		fs.writeFileSync(dstDir+'posts.json', JSON.stringify(postsInfo))
		
		callback()
	})
}

function syntaxHighlight(html) {
	var lines = html.split('\n')
	var newLines = []
	var inCode = false
	var startCode = /<code>/g
	var endCode = /<\/code>/g

	for (var i=0; i < lines.length; i++) {
		var line = lines[i],
			starts = line.match(startCode),
			ends = line.match(endCode)

		if ((starts && starts.length) > (ends && ends.length)) {
			inCode = true
		}
		if ((ends && ends.length) > (starts && starts.length)) {
			inCode = false
		}

		if (inCode) {
			line = funSyntaxHighlighter.highlightLine(line)
		}

		newLines.push(line)
	}

	return newLines.join('\n')
}
